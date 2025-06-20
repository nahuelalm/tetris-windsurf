import { Piece } from './Piece.js';
import { Grid } from './Grid.js';
import { GameBoard } from './GameBoard.js';
import { GameState } from './GameState.js';
import { GameMovement } from './GameMovement.js';
import { GameEvents } from './GameEvents.js';
import { GAME_CONFIG } from './Config.js';

export class Game {
    constructor() {
        this.board = new GameBoard();
        this.grid = new Grid(GAME_CONFIG.BOARD_WIDTH, GAME_CONFIG.BOARD_HEIGHT);
        this.currentPiece = null;
        this.gameInterval = null;
        this.gameState = new GameState();
        this.movement = new GameMovement(this);
        this.events = new GameEvents(this);
        this.initializeGame();
    }

    initializeGame() {
        this.grid.clear();
        this.gameState.reset();
        this.currentPiece = null;
        this.gameInterval = null;
        this.stopGame();
        this.render();
    }

    startGame() {
        this.initializeGame();
        this.gameState.gameOver = false;
        this.createPiece();
        this.gameInterval = setInterval(() => {
            if (!this.gameState.gameOver) {
                // Si está haciendo soft drop, usar velocidad rápida
                const dropSpeed = this.gameState.isSoftDropping ? this.gameState.softDropSpeed : this.gameState.dropSpeed;
                
                if (!this.movePiece(0, 1)) {
                    this.lockPiece();
                    this.gameState.gameOver = this.grid.isGameOver();
                }
            }
        }, this.gameState.dropSpeed);
    }

    stopGame() {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
        if (this.gameState.softDropTimer) {
            clearInterval(this.gameState.softDropTimer);
            this.gameState.softDropTimer = null;
        }
    }

    movePiece(dx, dy) {
        if (!this.currentPiece) return false;
        const newX = this.currentPiece.x + dx;
        const newY = this.currentPiece.y + dy;
        
        if (this.movement.canPieceMove(newX, newY)) {
            this.board.clearCells();
            this.currentPiece.x = newX;
            this.currentPiece.y = newY;
            this.render();
            return true;
        }
        return false;
    }



    createPiece() {
        const types = Object.keys(GAME_CONFIG.TETROMINOS);
        const type = types[Math.floor(Math.random() * types.length)];
        const shape = GAME_CONFIG.TETROMINOS[type];
        const color = GAME_CONFIG.COLORS[type];
        
        this.currentPiece = new Piece(type, shape, color);
        this.currentPiece.x = Math.floor((this.board.width - shape[0].length) / 2);
        this.currentPiece.y = 0;
        
        if (!this.movement.canPieceMove(this.currentPiece.x, this.currentPiece.y)) {
            this.gameState.gameOver = true;
            this.stopGame();
        }
    }

    resetGame() {
        this.initializeGame();
        this.startGame();
    }

    lockPiece() {
        if (this.currentPiece) {
            this.board.clearCells();
            this.grid.mergePiece(this.currentPiece);
            const linesCleared = this.grid.clearLines();
            if (linesCleared > 0) {
                this.gameState.updateScore(linesCleared * 100);
                this.gameState.updateLines(linesCleared);
            }
            
            // Resetear el soft drop cuando cambia de pieza
            if (this.gameState.isSoftDropping) {
                this.gameState.toggleSoftDrop();
                if (this.gameState.softDropTimer) {
                    clearInterval(this.gameState.softDropTimer);
                    this.gameState.softDropTimer = null;
                }
            }
            
            this.createPiece();
            this.render();
        }
    }

    softDrop() {
        if (!this.gameState.isSoftDropping) {
            this.gameState.toggleSoftDrop();
            this.gameState.softDropTimer = setInterval(() => {
                if (!this.gameState.gameOver) {
                    if (!this.movePiece(0, 1)) {
                        this.lockPiece();
                        this.gameState.toggleSoftDrop();
                    }
                }
            }, this.gameState.softDropSpeed);
        }
    }

    stopSoftDrop() {
        if (this.gameState.isSoftDropping && this.gameState.softDropTimer) {
            clearInterval(this.gameState.softDropTimer);
            this.gameState.softDropTimer = null;
            this.gameState.toggleSoftDrop();
            
            // Restablecer el intervalo principal del juego a la velocidad normal
            if (this.gameInterval) {
                clearInterval(this.gameInterval);
                this.gameInterval = setInterval(() => {
                    if (!this.gameState.gameOver) {
                        if (!this.movePiece(0, 1)) {
                            this.lockPiece();
                            this.gameState.gameOver = this.grid.isGameOver();
                        }
                    }
                }, this.gameState.dropSpeed);
            }
        }
    }

    render() {
        this.board.clearCells();
        this.board.drawGrid(this.grid);
        if (this.currentPiece) {
            this.board.drawPiece(this.currentPiece);
        }
    }
}