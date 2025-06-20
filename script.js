import { Game } from './src/models/Game.js';

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    
    // Set up event listeners
    document.getElementById('start-button').addEventListener('click', () => {
        game.startGame();
    });

    // Add key event listeners
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Reset the game when Escape is pressed
            const game = new Game();
            game.startGame();
        }
    });
});
