import Game from './Game.js';

// Add EventListener to load the game whenever the browser is ready
window.addEventListener('load', () => {
  console.log('Handling the Load event');

  const game = new Game(document.getElementById('canvas'));
  game.start();
});
