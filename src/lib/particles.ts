export interface ParticleConfig {
  canvasWidth: number;
  canvasHeight: number;
  maxSpeed?: number; // default 0.5
  maxRadius?: number; // default 2
  twinkleMaxSpeed?: number; // default 0.05
  mouseRange?: number; // default 200
  mouseForce?: number; // default 0.00005
  damping?: number; // default 0.99
  /** If true, mouse force falls off linearly with distance (playground style). */
  forceFalloff?: boolean; // default false
  /** Multiplier applied to opacity in the fill pass. */
  fillOpacityFactor?: number; // default 0.8
  /** Multiplier applied to opacity in the glow pass. */
  glowOpacityFactor?: number; // default 0.3
  /** Glow circle radius = particle.radius * glowRadiusMultiplier. */
  glowRadiusMultiplier?: number; // default 2
  colors?: string[];
}

const DEFAULT_COLORS = [
  'rgba(255, 255, 255, 0.8)',
  'rgba(34, 211, 238, 0.8)',
  'rgba(167, 139, 250, 0.8)',
  'rgba(249, 115, 22, 0.6)',
];

export class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  canvasWidth: number;
  canvasHeight: number;
  twinkle: number;
  twinkleSpeed: number;
  private mouseRange: number;
  private mouseForce: number;
  private damping: number;
  private forceFalloff: boolean;
  private fillOpacityFactor: number;
  private glowOpacityFactor: number;
  private glowRadiusMultiplier: number;

  constructor(config: ParticleConfig) {
    this.canvasWidth = config.canvasWidth;
    this.canvasHeight = config.canvasHeight;

    const maxSpeed = config.maxSpeed ?? 0.5;
    const maxRadius = config.maxRadius ?? 2;
    const twinkleMaxSpeed = config.twinkleMaxSpeed ?? 0.05;

    this.mouseRange = config.mouseRange ?? 200;
    this.mouseForce = config.mouseForce ?? 0.00005;
    this.damping = config.damping ?? 0.99;
    this.forceFalloff = config.forceFalloff ?? false;
    this.fillOpacityFactor = config.fillOpacityFactor ?? 0.8;
    this.glowOpacityFactor = config.glowOpacityFactor ?? 0.3;
    this.glowRadiusMultiplier = config.glowRadiusMultiplier ?? 2;

    this.x = Math.random() * config.canvasWidth;
    this.y = Math.random() * config.canvasHeight;
    this.vx = (Math.random() - 0.5) * maxSpeed;
    this.vy = (Math.random() - 0.5) * maxSpeed;
    this.radius = Math.random() * maxRadius + 0.5;
    this.twinkle = Math.random() * Math.PI * 2;
    this.twinkleSpeed = Math.random() * twinkleMaxSpeed + 0.02;

    const colors = config.colors ?? DEFAULT_COLORS;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(mouseX: number, mouseY: number): void {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.mouseRange) {
      if (this.forceFalloff) {
        const force =
          ((this.mouseRange - distance) / this.mouseRange) * this.mouseForce;
        this.vx += dx * force;
        this.vy += dy * force;
      } else {
        this.vx += dx * this.mouseForce;
        this.vy += dy * this.mouseForce;
      }
    }

    this.x += this.vx;
    this.y += this.vy;
    this.twinkle += this.twinkleSpeed;

    // Wrap around edges
    if (this.x < 0) this.x = this.canvasWidth;
    if (this.x > this.canvasWidth) this.x = 0;
    if (this.y < 0) this.y = this.canvasHeight;
    if (this.y > this.canvasHeight) this.y = 0;

    // Damping
    this.vx *= this.damping;
    this.vy *= this.damping;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const opacity = 0.5 + Math.sin(this.twinkle) * 0.5;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color.replace(
      /[\d.]+\)$/,
      `${opacity * this.fillOpacityFactor})`,
    );
    ctx.fill();

    // Glow effect
    const glowRadius = this.radius * this.glowRadiusMultiplier;
    ctx.beginPath();
    ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      glowRadius,
    );
    gradient.addColorStop(
      0,
      this.color.replace(/[\d.]+\)$/, `${opacity * this.glowOpacityFactor})`),
    );
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}
