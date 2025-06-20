import { Game } from './src/models/Game.js';

const game = new Game();

export function initGame() {
    document.addEventListener('keydown', (e) => {
        if (game.gameOver) return;
        
        switch (e.key) {
            case 'a':
            case 'A':
            case 'ArrowLeft':
                game.movePiece(-1, 0);
                break;
            case 'd':
            case 'D':
            case 'ArrowRight':
                game.movePiece(1, 0);
                break;
            case 's':
            case 'S':
            case 'ArrowDown':
                game.softDrop();
                break;
            case 'w':
            case 'W':
            case 'ArrowUp':
                game.rotatePiece();
                break;
        }
        game.render();
    });

    const startButton = document.getElementById('start-button');
    const gameOverElement = document.getElementById('game-over');
    const restartButton = document.getElementById('restart-button');

    // Manejar el inicio del juego
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

    // Manejar el juego terminado
    game.onGameOver = () => {
        startButton.disabled = false;
        gameOverElement.classList.remove('hidden');
    };
}