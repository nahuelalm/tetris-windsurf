import { Game } from './src/models/Game.js';

export function initGame() {
    const game = new Game();
    const startButton = document.getElementById('start-button');
    const gameOverElement = document.getElementById('game-over');
    const restartButton = document.getElementById('restart-button');

    // Manejar el inicio del juego (solo para escritorio)
    startButton.addEventListener('click', () => {
        game.resetGame();
        game.startGame();
        startButton.disabled = true;
        gameOverElement.classList.add('hidden');
    });

    // Manejar el reinicio del juego
    restartButton.addEventListener('click', () => {
        game.resetGame();
        game.startGame();
        startButton.disabled = true;
        gameOverElement.classList.add('hidden');
    });

    // Manejar el evento de carga de la página
    window.addEventListener('load', () => {
        // Si es un dispositivo móvil, iniciar el juego automáticamente
        if (window.innerWidth <= 768) {
            // Ocultar el botón de inicio
            startButton.classList.add('hidden');
            game.resetGame();
            game.startGame();
            startButton.disabled = true;
            gameOverElement.classList.add('hidden');
        }
    });
}