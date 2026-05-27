package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strings"
	"sync"
	"time"
)

var (
	botToken = os.Getenv("TELEGRAM_BOT_TOKEN")
	chatID   = os.Getenv("TELEGRAM_CHAT_ID")
	port     = getEnv("PORT", "4321")

	// OIDC credentials for Kafka connector status proxy
	oidcTokenURL     = os.Getenv("OIDC_TOKEN_URL")
	oidcClientID     = os.Getenv("OIDC_CLIENT_ID")
	oidcClientSecret = os.Getenv("OIDC_CLIENT_SECRET")
	connectorsURL    = os.Getenv("CONNECTORS_API_URL")

	emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)

	// Rate limiter: max 5 requests per IP per minute
	rateMu  sync.Mutex
	rateMap = make(map[string][]time.Time)

	// Cached OIDC token
	cachedToken       string
	cachedTokenExpiry time.Time
	tokenMu           sync.Mutex
)

func init() {
	go func() {
		for range time.Tick(5 * time.Minute) {
			rateMu.Lock()
			now := time.Now()
			window := now.Add(-1 * time.Minute)
			for ip, times := range rateMap {
				valid := times[:0]
				for _, t := range times {
					if t.After(window) {
						valid = append(valid, t)
					}
				}
				if len(valid) == 0 {
					delete(rateMap, ip)
				} else {
					rateMap[ip] = valid
				}
			}
			rateMu.Unlock()
		}
	}()
}

func main() {
	// Healthcheck mode for Docker HEALTHCHECK (scratch has no shell/curl)
	if len(os.Args) > 1 && os.Args[1] == "-healthcheck" {
		resp, err := http.Get("http://localhost:" + port + "/api/health")
		if err != nil || resp.StatusCode != 200 {
			os.Exit(1)
		}
		os.Exit(0)
	}

	mux := http.NewServeMux()

	// API routes
	mux.HandleFunc("/api/health", handleHealth)
	mux.HandleFunc("/api/contact", handleContact)
	mux.HandleFunc("/api/connectors", handleConnectors)
	mux.HandleFunc("/api/config", handleConfig)

	// Static files
	staticDir := getEnv("STATIC_DIR", "./dist")
	fileServer := http.FileServer(http.Dir(staticDir))
	mux.Handle("/", spaHandler(staticDir, fileServer))

	// Keep-alive for Render.com free tier (spins down after 15m of no inbound traffic).
	// Must ping the PUBLIC URL so the request passes through Render's router.
	if os.Getenv("RENDER") != "" {
		renderURL := os.Getenv("RENDER_EXTERNAL_URL")
		if renderURL == "" {
			log.Println("WARN: RENDER is set but RENDER_EXTERNAL_URL is empty — keep-alive disabled")
		} else {
			intervalMin := 10
			if v := os.Getenv("KEEP_ALIVE_INTERVAL_MIN"); v != "" {
				if parsed, err := fmt.Sscanf(v, "%d", &intervalMin); err != nil || parsed != 1 || intervalMin < 1 {
					log.Printf("WARN: invalid KEEP_ALIVE_INTERVAL_MIN=%q, using default 10", v)
					intervalMin = 10
				}
			}
			go func() {
				time.Sleep(5 * time.Second)
				client := &http.Client{Timeout: 10 * time.Second}
				pingURL := renderURL + "/api/health"
				interval := time.Duration(intervalMin) * time.Minute
				log.Printf("Render.com keep-alive enabled — pinging %s every %dm", pingURL, intervalMin)
				for range time.Tick(interval) {
					resp, err := client.Get(pingURL)
					if err != nil {
						log.Printf("Keep-alive ping failed: %v", err)
						continue
					}
					resp.Body.Close()
				}
			}()
		}
	}

	addr := ":" + port
	log.Printf("Serving on %s (static: %s)", addr, staticDir)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}

// spaHandler serves static files; falls back to index.html for SPA routes
func spaHandler(root string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path

		// Root path
		if path == "/" {
			http.ServeFile(w, r, root+"/index.html")
			return
		}

		// Clean path for fs.Stat (remove leading/trailing slash)
		clean := strings.TrimPrefix(path, "/")
		clean = strings.TrimSuffix(clean, "/")

		// Try as directory with index.html (handles /projects/ and /projects)
		if _, err := fs.Stat(os.DirFS(root), clean+"/index.html"); err == nil {
			http.ServeFile(w, r, root+"/"+clean+"/index.html")
			return
		}

		// Try exact file (for assets like .css, .js, images)
		if info, err := fs.Stat(os.DirFS(root), clean); err == nil && !info.IsDir() {
			next.ServeHTTP(w, r)
			return
		}

		// Try path.html
		if _, err := fs.Stat(os.DirFS(root), clean+".html"); err == nil {
			http.ServeFile(w, r, root+"/"+clean+".html")
			return
		}

		// 404
		w.WriteHeader(http.StatusNotFound)
		// Try serving custom 404 page
		if _, err := fs.Stat(os.DirFS(root), "404.html"); err == nil {
			http.ServeFile(w, r, root+"/404.html")
			return
		}
		fmt.Fprint(w, "404 Not Found")
	})
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":    "ok",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

type contactRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
}

func handleContact(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		jsonError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Rate limiting by IP
	ip := r.RemoteAddr
	if fwd := r.Header.Get("X-Forwarded-For"); fwd != "" {
		ip = strings.Split(fwd, ",")[0]
	}
	if !allowRequest(strings.TrimSpace(ip)) {
		jsonError(w, "Too many requests, please try again later", http.StatusTooManyRequests)
		return
	}

	var req contactRequest
	if err := json.NewDecoder(io.LimitReader(r.Body, 1<<16)).Decode(&req); err != nil {
		jsonError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.TrimSpace(req.Email)
	req.Message = strings.TrimSpace(req.Message)

	if req.Name == "" || req.Email == "" || req.Message == "" {
		jsonError(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	// Field length limits
	if len(req.Name) > 100 {
		jsonError(w, "Name too long (max 100 characters)", http.StatusBadRequest)
		return
	}
	if len(req.Email) > 254 {
		jsonError(w, "Email too long", http.StatusBadRequest)
		return
	}
	if len(req.Message) > 2000 {
		jsonError(w, "Message too long (max 2000 characters)", http.StatusBadRequest)
		return
	}

	// Email format validation
	if !emailRegex.MatchString(req.Email) {
		jsonError(w, "Invalid email format", http.StatusBadRequest)
		return
	}

	if botToken == "" || chatID == "" {
		log.Println("ERROR: Telegram credentials not configured")
		jsonError(w, "Server configuration error", http.StatusInternalServerError)
		return
	}

	text := fmt.Sprintf("📬 *New Contact Message*\n\n*Name:* %s\n*Email:* %s\n\n*Message:*\n>%s",
		escapeMarkdownV2(req.Name),
		escapeMarkdownV2(req.Email),
		strings.ReplaceAll(escapeMarkdownV2(req.Message), "\n", "\n>"),
	)

	if err := sendTelegram(text); err != nil {
		log.Printf("Telegram API error: %v", err)
		jsonError(w, "Failed to send message", http.StatusBadGateway)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]bool{"ok": true})
}

func sendTelegram(text string) error {
	apiURL := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", botToken)

	payload, _ := json.Marshal(map[string]string{
		"chat_id":    chatID,
		"text":       text,
		"parse_mode": "MarkdownV2",
	})

	resp, err := http.Post(apiURL, "application/json", bytes.NewReader(payload))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		var body bytes.Buffer
		body.ReadFrom(resp.Body)
		return fmt.Errorf("status %d: %s", resp.StatusCode, body.String())
	}
	return nil
}

func escapeMarkdownV2(s string) string {
	// Backslash MUST be replaced first to avoid double-escaping
	s = strings.ReplaceAll(s, "\\", "\\\\")
	for _, ch := range []string{"_", "*", "[", "]", "(", ")", "~", "`", ">", "#", "+", "-", "=", "|", "{", "}", ".", "!"} {
		s = strings.ReplaceAll(s, ch, "\\"+ch)
	}
	return s
}

// allowRequest implements a sliding window rate limiter (5 req/min per IP)
func allowRequest(ip string) bool {
	rateMu.Lock()
	defer rateMu.Unlock()

	now := time.Now()
	window := now.Add(-1 * time.Minute)

	// Clean old entries
	times := rateMap[ip]
	valid := times[:0]
	for _, t := range times {
		if t.After(window) {
			valid = append(valid, t)
		}
	}

	if len(valid) >= 5 {
		rateMap[ip] = valid
		return false
	}

	rateMap[ip] = append(valid, now)
	return true
}

func jsonError(w http.ResponseWriter, msg string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}

// handleConnectors proxies the Kafka connector status API with server-side auth
func handleConnectors(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		jsonError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if oidcTokenURL == "" || oidcClientID == "" || oidcClientSecret == "" || connectorsURL == "" {
		jsonError(w, "Connectors API not configured", http.StatusServiceUnavailable)
		return
	}

	token, err := getOIDCToken()
	if err != nil {
		log.Printf("OIDC token error: %v", err)
		jsonError(w, "Authentication failed", http.StatusBadGateway)
		return
	}

	req, _ := http.NewRequest("GET", connectorsURL, nil)
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Connectors API error: %v", err)
		jsonError(w, "Failed to reach connectors API", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, io.LimitReader(resp.Body, 1<<20)) // Cap response at 1MB
}

// getOIDCToken returns a cached or fresh OIDC access token
func getOIDCToken() (string, error) {
	tokenMu.Lock()
	defer tokenMu.Unlock()

	// Return cached token if still valid (with 30s buffer)
	if cachedToken != "" && time.Now().Before(cachedTokenExpiry.Add(-30*time.Second)) {
		return cachedToken, nil
	}

	data := url.Values{
		"grant_type":    {"client_credentials"},
		"client_id":     {oidcClientID},
		"client_secret": {oidcClientSecret},
	}

	resp, err := http.PostForm(oidcTokenURL, data)
	if err != nil {
		return "", fmt.Errorf("token request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("token endpoint returned %d", resp.StatusCode)
	}

	var tokenResp struct {
		AccessToken string `json:"access_token"`
		ExpiresIn   int    `json:"expires_in"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return "", fmt.Errorf("failed to parse token response: %w", err)
	}

	cachedToken = tokenResp.AccessToken
	cachedTokenExpiry = time.Now().Add(time.Duration(tokenResp.ExpiresIn) * time.Second)
	return cachedToken, nil
}

func handleConfig(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		jsonError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	converterURL := os.Getenv("IMAGE_CONVERTER_API_URL")

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"imageConverterApiUrl": converterURL,
	})
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
