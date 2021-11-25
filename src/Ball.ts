import Game from './Game.js';

export default class Ball {
  private radius: number;

  private positionX: number;

  private positionY: number;

  private speedX: number;

  private speedY: number;

  /**
   * Constructs a new Ball
   *
   * @param canvas the canvas to place the ball on
   */
  public constructor(canvas: HTMLCanvasElement) {
    this.radius = Game.MIN_BALL_RADIUS + Game.BALL_RADIUS_SCATTER * Math.random();
    this.speedX = Game.MIN_BALL_X_SPEED + Game.BALL_X_SPEED_SCATTER * Math.random();
    this.speedY = Game.MIN_BALL_Y_SPEED;
    this.positionX = this.radius
      + (canvas.width - 2 * this.radius) * Math.random();
    this.positionY = canvas.height * Game.BALL_Y_POSITION_AREA
      + canvas.height * Game.BALL_Y_POSITION_SCATTER * Math.random();
  }

  /**
   * Moves the ball by applying the Newtonian laws of physics
   *
   * @param t the time to move over
   */
  public applyPhysics(t: number): void {
    // move: calculate the new position of the ball
    // Some physics here: the y-portion of the speed changes due to gravity
    // Formula: Vt = V0 + gt
    // 9.8 is the gravitational constant
    this.speedY -= Game.GRAVITY * t;
    // Calculate new X and Y parts of the position
    // Formula: S = v*t
    this.positionX += this.speedX * t;
    // Formula: S=v0*t + 0.5*g*t^2
    this.positionY += this.speedY * t + 0.5 * Game.GRAVITY * t * t;
  }

  /**
   * Lets the ball bounce from the canvas walls
   *
   * @param canvas the canvas to bounce between
   */
  public bounceFromCanvasWalls(canvas: HTMLCanvasElement): void {
    // collide: check if the ball hits the walls and let it bounce
    // Left wall
    if (this.positionX <= this.radius && this.speedX < 0) {
      this.speedX = -this.speedX;
    }
    // Right wall
    if (this.positionX >= canvas.width - this.radius
      && this.speedX > 0) {
      this.speedX = -this.speedX;
    }

    // Bottom only (ball will always come down)
    if (this.positionY <= this.radius && this.speedY < 0) {
      this.speedY = -this.speedY;
    }
  }

  /**
   * Check if the ball collides with the player
   *
   * @param x the x position of the player
   * @param y the y position of the player
   * @param r the radius of the player
   * @returns `true` if the ball overlaps with the player
   */
  public overlapsWith(x: number, y:number, r: number): boolean {
    // adjust: Check if the ball collides with the player. It's game over
    // then
    const distX = x - this.positionX;
    const distY = y - this.positionY;
    // Calculate the distance between ball and player using Pythagoras'
    // theorem
    const distance = Math.sqrt(distX * distX + distY * distY);
    // Collides is distance <= sum of radii of both circles
    return distance <= (this.radius + r);
  }

  /**
   * Renders the ball on the canvas
   *
   * @param canvas the canvas to render on
   * @param ctx the rendering context to draw on
   */
  public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    // reverse height, so the ball falls down
    const y = canvas.height - this.positionY;
    ctx.ellipse(this.positionX, y, this.radius, this.radius, 0, 0,
      2 * Game.FULL_CIRCLE);
    ctx.fill();
  }
}
