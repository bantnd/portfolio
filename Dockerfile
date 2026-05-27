# ---- Stage 1: Build static assets ----
# Static HTML/CSS/JS is platform-independent — always build natively
FROM --platform=$BUILDPLATFORM oven/bun:1.3.14-alpine AS assets

WORKDIR /app

COPY package.json bun.lock* pnpm-lock.yaml* bunfig.toml ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# ---- Stage 2: Build Go binary ----
# Go cross-compiles natively via GOOS/GOARCH — no emulation needed
FROM --platform=$BUILDPLATFORM golang:1.26.3-alpine AS gobuilder

ARG TARGETOS
ARG TARGETARCH

WORKDIR /src
COPY server/ .
RUN CGO_ENABLED=0 GOOS=${TARGETOS} GOARCH=${TARGETARCH} go build -ldflags="-s -w" -o /server .

# ---- Stage 3: Scratch runtime ----
# Only the runtime stage uses the target platform
FROM scratch

COPY --from=gobuilder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=gobuilder /server /server
COPY --from=assets /app/dist /dist

ENV PORT=4321
ENV STATIC_DIR=/dist

EXPOSE 4321

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD ["/server", "-healthcheck"]

ENTRYPOINT ["/server"]
