import GameLoop from './GameLoop.js';
import Scene from './Scene.js';

/**
 * Main class of this Game.
 */
export default class Game {
  public static readonly GRAVITY = 0.0098;

  public static readonly FULL_CIRCLE = Math.PI * 2;

  // Constants that define the allowed ball dimensions
  public static readonly MIN_BALL_RADIUS = 25;

  public static readonly BALL_RADIUS_SCATTER = 25;

  public static readonly MIN_BALL_X_SPEED = -5;

  public static readonly BALL_X_SPEED_SCATTER = 10;

  public static readonly MIN_BALL_Y_SPEED = 0;

  public static readonly BALL_Y_POSITION_AREA = 0.8;

  public static readonly BALL_Y_POSITION_SCATTER = 0.2;

  public static readonly BALL_COLOR = 'blue';

  public static readonly INITIAL_BALL_COUNT = 1;

  // Constants for the player
  public static readonly PLAYER_BALL_RADIUS = 50;

  public static readonly PLAYER_COLOR = 'red';

  private scene: Scene;

  private gameloop: GameLoop;

  /**
   * Construc a new instance of this class
   *
   * @param canvas the canvas to render on
   */
  public constructor(canvas: HTMLElement) {
    this.scene = new Scene(canvas);
    this.gameloop = new GameLoop(this.scene);
  }

  /**
   * Start the game.
   */
  public start(): void {
    // Start the animation
    console.log('start animation');
    this.gameloop.start();
  }
}
