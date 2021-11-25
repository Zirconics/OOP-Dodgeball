/**
 * Main class of this Game.
 */
export default class Game {
  private canvas: HTMLCanvasElement;

  private ballRadius: number;

  private ballPositionX: number;

  private ballPositionY: number;

  private ballSpeedX: number;

  private ballSpeedY: number;

  private playerPositionX: number;

  private lastTickTimeStamp : number;

  public static readonly GRAVITY: number = 0.0098;

  public static readonly MIN_BALL_RADIUS: number = 25;

  public static readonly BALL_SCATTER_RADIUS: number = 25;

  public static readonly MIN_BALL_X_SPEED: number = -5;

  public static readonly BALL_X_SPEED_SCATTER: number = 10;

  public static readonly MIN_BALL_Y_SPEED: number = 0;

  public static readonly BALL_Y_SPEED_SCATTER: number = 0;

  public static readonly BALL_Y_POSITION_AREA: number = 0.2;

  public static readonly BALL_COLOR: string = 'BLUE';

  public static readonly PLAYER_BALL_RADIUS: number = 50;

  public static readonly PLAYER_COLOR: string = 'RED';

  public static readonly FULL_CIRCLE: number = Math.PI * 2;

  /**
   * Construc a new instance of this class
   *
   * @param canvas the canvas to render on
   */
  public constructor(canvas: HTMLElement) {
    this.canvas = <HTMLCanvasElement>canvas;

    // Resize the canvas to full window size
    this.canvas.width = window.innerWidth - 1;
    this.canvas.height = window.innerHeight - 4;

    // Spawn a Ball
    this.createBalls();

    // Set the player at the center
    this.playerPositionX = this.canvas.width / 2;
  }

  /**
   * Creates balls.
   */
  private createBalls() {
    this.ballRadius = Game.MIN_BALL_RADIUS + Game.BALL_SCATTER_RADIUS * Math.random();
    this.ballSpeedX = Game.MIN_BALL_X_SPEED + Game.BALL_X_SPEED_SCATTER * Math.random();
    this.ballSpeedY = Game.MIN_BALL_Y_SPEED;
    this.ballPositionX = this.ballRadius
      + (this.canvas.width - 2 * this.ballRadius) * Math.random();
    this.ballPositionY = this.canvas.height * 0.8
    + this.canvas.height * Game.BALL_Y_POSITION_AREA * Math.random();
  }

  /**
   * Start the game.
   */
  public start(): void {
    // Start the animation
    console.log('start animation');
    // Set the last tick timestamp to current time
    this.lastTickTimeStamp = performance.now();
    requestAnimationFrame(this.step);
  }

  /**
   * This MUST be an arrow method in order to keep the `this` variable working
   * correctly. It will otherwise be overwritten by another object caused by
   * javascript scoping behaviour.
   *
   * @param timestamp a `DOMHighResTimeStamp` similar to the one returned by
   *   `performance.now()`, indicating the point in time when `requestAnimationFrame()`
   *   starts to execute callback functions
   */
  private step = (timestamp: number): void => {
    // To make it as accurate as possible, incorporate the time t
    // At 60fps, each interval is approximately 17ms.
    const gameover = this.gameSimulation(timestamp);

    // draw: the items on the canvas
    // Get the canvas rendering context
    this.screenRender();

    // Call this method again on the next animation frame
    if (!gameover) {
      requestAnimationFrame(this.step);
    }
  };

  /**
   * Renders things on screen.
   */
  private screenRender() {
    const ctx = this.canvas.getContext('2d');
    // Clear the entire canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the player
    ctx.fillStyle = Game.PLAYER_COLOR;
    ctx.beginPath();
    const playerPositionY = this.canvas.height - Game.PLAYER_BALL_RADIUS;
    ctx.ellipse(this.playerPositionX, playerPositionY, 50, 50, 0, 0, Game.FULL_CIRCLE);
    ctx.fill();

    // Draw the ball
    ctx.fillStyle = Game.BALL_COLOR;
    ctx.beginPath();
    // reverse height, so the ball falls down
    const y = this.canvas.height - this.ballPositionY;
    ctx.ellipse(this.ballPositionX, y, this.ballRadius, this.ballRadius, 0, 0, Game.FULL_CIRCLE);
    ctx.fill();
  }

  /**
   * Handles the simulation of the game.
   *
   * @param timestamp - timestamp
   * @returns - Gameover
   */
  private gameSimulation(timestamp: number) {
    const t = timestamp - this.lastTickTimeStamp;
    this.lastTickTimeStamp = timestamp;

    // move: calculate the new position of the ball
    // Some physics here: the y-portion of the speed changes due to gravity
    // Formula: Vt = V0 + gt
    // 9.8 is the gravitational constant
    this.ballSpeedY -= Game.GRAVITY * t;
    // Calculate new X and Y parts of the position
    // Formula: S = v*t
    this.ballPositionX += this.ballSpeedX * t;
    // Formula: S=v0*t + 0.5*g*t^2
    this.ballPositionY += this.ballSpeedY * t + 0.5 * Game.GRAVITY * t * t;

    // collide: check if the ball hits the walls and let it bounce
    // Left wall
    if (this.ballPositionX <= this.ballRadius && this.ballSpeedX < 0) {
      this.ballSpeedX = -this.ballSpeedX;
    }
    // Right wall
    if (this.ballPositionX >= this.canvas.width - this.ballRadius
      && this.ballSpeedX > 0) {
      this.ballSpeedX = -this.ballSpeedX;
    }

    // Bottom only (ball will always come down)
    if (this.ballPositionY <= this.ballRadius && this.ballSpeedY < 0) {
      this.ballSpeedY = -this.ballSpeedY;
    }

    // adjust: Check if the ball collides with the player. It's game over
    // then
    const distX = this.playerPositionX - this.ballPositionX;
    const distY = Game.PLAYER_BALL_RADIUS - this.ballPositionY;
    // Calculate the distance between ball and player using Pythagoras'
    // theorem
    const distance = Math.sqrt(distX * distX + distY * distY);
    // Collides is distance <= sum of radii of both circles
    const gameover = distance <= (this.ballRadius + 50);
    return gameover;
  }
}
