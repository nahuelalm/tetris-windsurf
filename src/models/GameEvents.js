import { GAME_CONFIG } from './Config.js';

export class GameEvents {
    constructor(game) {
        this.game = game;
        this.setupKeyboardEvents();
        this.setupTouchEvents();
    }

    setupKeyboardEvents() {
        const { KEY_DEBOUNCE } = GAME_CONFIG;
        let lastKeyPressTime = 0;

        document.addEventListener('keydown', (e) => {
            if (this.game.gameState.gameOver) return;
            
            const currentTime = Date.now();
            if (currentTime - lastKeyPressTime < KEY_DEBOUNCE) return;
            lastKeyPressTime = currentTime;

            switch(e.key) {
                case 'ArrowLeft':
                    this.game.movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    this.game.movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    this.game.softDrop();
                    break;
                case 'ArrowUp':
                    this.game.movement.rotatePiece();
                    break;
                case ' ':
                    this.game.stopSoftDrop();
                    break;
            }
            this.game.render();
        });
    }

    setupTouchEvents() {
        const gameBoard = document.getElementById('game-board');
        if (!gameBoard) {
            console.error('No se pudo encontrar el elemento game-board');
            return;
        }

        let touchStartX = 0;
        let touchStartY = 0;
        let isRotating = false;

        // Agregar evento para detectar doble toque
        let lastTouchTime = 0;
        const DOUBLE_TOUCH_THRESHOLD = 300; // 300ms entre toques

        gameBoard.addEventListener('touchstart', (e) => {
            if (this.game.gameState.gameOver) return;

            const currentTime = Date.now();
            const timeDiff = currentTime - lastTouchTime;
            
            // Si es un doble toque, rotar la pieza
            if (timeDiff < DOUBLE_TOUCH_THRESHOLD) {
                this.game.movement.rotatePiece();
                this.game.render();
            }
            
            lastTouchTime = currentTime;
            
            // Guardar posición inicial del toque
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isRotating = false;
        });

        gameBoard.addEventListener('touchmove', (e) => {
            if (this.game.gameState.gameOver) return;
            
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const deltaX = touchX - touchStartX;
            const deltaY = touchY - touchStartY;

            // Si se mueve más de 50px en cualquier dirección, no es una rotación
            if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
                isRotating = true;
            }
        });

        gameBoard.addEventListener('touchend', (e) => {
            if (this.game.gameState.gameOver) return;
            
            // Si el usuario mantuvo el dedo sin moverse, rotar la pieza
            if (!isRotating) {
                this.game.movement.rotatePiece();
                this.game.render();
            }
        });

        // Eventos para mover la pieza con gestos
        gameBoard.addEventListener('touchstart', (e) => {
            if (this.game.gameState.gameOver) return;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        gameBoard.addEventListener('touchmove', (e) => {
            if (this.game.gameState.gameOver) return;
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const deltaX = touchX - touchStartX;
            const deltaY = touchY - touchStartY;

            // Mover horizontalmente
            if (Math.abs(deltaX) > 20) {
                this.game.movePiece(deltaX > 0 ? 1 : -1, 0);
                touchStartX = touchX;
            }

            // Mover verticalmente
            if (Math.abs(deltaY) > 20) {
                this.game.softDrop();
                touchStartY = touchY;
            }
        });

        gameBoard.addEventListener('touchend', () => {
            if (this.game.gameState.gameOver) return;
            this.game.stopSoftDrop();
        });
        let isTouching = false;
        let lastMoveTime = 0;
        const moveDebounce = 100;

        gameBoard.addEventListener('touchstart', (e) => {
            if (this.game.gameState.gameOver) return;
            
            e.preventDefault();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            isTouching = true;
            lastMoveTime = Date.now();
        });

        gameBoard.addEventListener('touchmove', (e) => {
            if (!isTouching || this.game.gameState.gameOver) return;
            
            e.preventDefault();
            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;
            const currentTime = Date.now();

            if (currentTime - lastMoveTime < moveDebounce) return;

            if (Math.abs(deltaX) > 20 && Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) {
                    this.game.movePiece(1, 0);
                } else {
                    this.game.movePiece(-1, 0);
                }
                touchStartX = touch.clientX;
                lastMoveTime = currentTime;
            }

            if (Math.abs(deltaY) > 20 && Math.abs(deltaY) > Math.abs(deltaX)) {
                if (deltaY > 0) {
                    if (!this.game.gameState.isSoftDropping) {
                        this.game.softDrop();
                    }
                } else {
                    this.game.rotatePiece();
                }
                touchStartY = touch.clientY;
                lastMoveTime = currentTime;
            }
            
            this.game.render();
        });

        gameBoard.addEventListener('touchend', () => {
            isTouching = false;
            if (this.game.gameState.isSoftDropping) {
                this.game.stopSoftDrop();
            }
        });
    }
}
