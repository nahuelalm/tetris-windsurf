import { Piece } from './Piece.js';
import { Grid } from './Grid.js';
import { GameBoard } from './GameBoard.js';

export class Game {
    constructor() {
        this.board = new GameBoard();
        this.grid = new Grid(10, 20);
        this.currentPiece = null;
        this.gameInterval = null;
        this.gameOver = false;
        this.dropSpeed = 1000; // Velocidad de caída en milisegundos
        this.eventListeners = new Set();
        this.score = 0;
        this.lines = 0;
        this.colors = {
            I: '#00FFFF',
            J: '#0000FF',
            L: '#FFA500',
            O: '#FFFF00',
            S: '#00FF00',
            T: '#9400D3',
            Z: '#FF0000'
        };
        this.tetrominos = {
            I: [[1, 1, 1, 1]],
            J: [[1, 0, 0], [1, 1, 1]],
            L: [[0, 0, 1], [1, 1, 1]],
            O: [[1, 1], [1, 1]],
            S: [[0, 1, 1], [1, 1, 0]],
            T: [[0, 1, 0], [1, 1, 1]],
            Z: [[1, 1, 0], [0, 1, 1]]
        };
    }

    createPiece() {
        const types = Object.keys(this.tetrominos);
        const type = types[Math.floor(Math.random() * types.length)];
        const shape = this.tetrominos[type];
        const color = this.colors[type];
        
        const piece = new Piece(type, shape, color);
        piece.x = Math.floor((this.board.width - shape[0].length) / 2);
        piece.y = 0; // Asegurarse de que la pieza comience en la parte superior
        
        // Asegurarse de que la pieza esté dentro de los límites del tablero
        if (piece.x < 0) {
            piece.x = 0;
        } else if (piece.x + shape[0].length > this.board.width) {
            piece.x = this.board.width - shape[0].length;
        }
        
        return piece;
    }

    startGame() {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
        }

        this.gameOver = false;
        this.currentPiece = this.createPiece();
        
        // Iniciar el bucle del juego
        this.gameInterval = setInterval(() => {
            if (this.gameOver) {
                clearInterval(this.gameInterval);
                return;
            }

            // Mover la pieza hacia abajo
            if (!this.movePiece(0, 1)) {
                // Si no se puede mover, bloquear
                if (!this.lockPiece()) {
                    this.gameOver = true;
                    clearInterval(this.gameInterval);
                    return;
                }
                this.clearLines();
            }

            // Renderizar el juego
            this.render();
        }, this.dropSpeed);

        // Si el juego termina, limpiar el intervalo
        if (this.gameOver) {
            clearInterval(this.gameInterval);
        }
    }
    // Método auxiliar para verificar si una pieza puede moverse
    canPieceMove(piece, grid, dx, dy, boardWidth, boardHeight) {
        const newX = piece.x + dx;
        const newY = piece.y + dy;

        if (newX < 0 || newX + piece.shape[0].length > boardWidth ||
            newY + piece.shape.length > boardHeight) {
            return false;
        }

        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col] && 
                    grid[newY + row] && grid[newY + row][newX + col]) {
                    return false;
                }
            }
        }
        return true;
    };

    resetGame() {
        // Limpiar el intervalo del juego
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }

        // Limpiar la cuadrícula
        this.grid.clear();
        
        // Crear una nueva cuadrícula vacía
        this.grid = new Grid(10, 20);
        
        // Limpiar la pieza actual
        this.currentPiece = null;
        
        // Limpiar el tablero visual
        this.board.clearCells();
        
        // Reiniciar el estado del juego
        this.gameOver = false;
        this.score = 0;
        this.lines = 0;
    }

    movePiece(dx, dy) {
        if (!this.currentPiece) return false;

        const newX = this.currentPiece.x + dx;
        const newY = this.currentPiece.y + dy;

        if (newY < 0) return false;

        if (this.canPieceMove(this.currentPiece, this.grid.getGrid(), dx, dy, this.board.width, this.board.height)) {
            this.currentPiece.x = newX;
            this.currentPiece.y = newY;
            return true;
        }
        return false;
    }

    rotatePiece() {
        if (!this.currentPiece) return;

        // Guardar la posición y forma actual
        const oldShape = JSON.parse(JSON.stringify(this.currentPiece.shape));
        const oldX = this.currentPiece.x;
        const oldY = this.currentPiece.y;

        // Rotar la pieza
        this.currentPiece.rotate();

        // Verificar si la nueva posición es válida
        if (!this.canPieceMove(this.currentPiece, this.grid.getGrid(), 0, 0, this.board.width, this.board.height)) {
            // Si no es válida, restaurar la posición y forma anteriores
            this.currentPiece.shape = oldShape;
            this.currentPiece.x = oldX;
            this.currentPiece.y = oldY;
            return; // Salir si la rotación no es válida
        }

        // Asegurarse de que la pieza esté visible
        if (this.currentPiece.y < 0) {
            this.currentPiece.y = 0;
        }

        this.render();
    };

    softDrop() {
        if (!this.currentPiece) return;

        // Intentar mover la pieza hacia abajo
        if (this.movePiece(0, 1)) {
            // Si se pudo mover, aumentar la puntuación
            this.score += 1;
            this.render();
        }
    }

    lockPiece() {
        if (!this.currentPiece) return false;

        // Bloquear la pieza en el tablero
        for (let row = 0; row < this.currentPiece.shape.length; row++) {
            for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col]) {
                    const x = this.currentPiece.x + col;
                    const y = this.currentPiece.y + row;
                    if (y >= 0) {
                        this.grid.set(x, y, this.currentPiece.color);
                    }
                }
            }
        }

        // Crear y verificar la siguiente pieza
        const nextPiece = this.createPiece();
        if (!nextPiece.canMove(this.grid.getGrid(), 0, 0, this.board.width, this.board.height)) {
            // Si la siguiente pieza no puede moverse, el juego termina
            this.gameOver = true;
            if (this.onGameOver) {
                this.onGameOver();
            }
            return false;
        }

        // Si está todo bien, establecer la siguiente pieza
        this.currentPiece = nextPiece;
        return true;
    };

    clearLines() {
    }

    clearLines() {
        const linesCleared = this.grid.clearLines();
        if (linesCleared > 0) {
            this.score += linesCleared * 100;
            this.lines += linesCleared;
            const scoreElement = document.getElementById('score');
            if (scoreElement) scoreElement.textContent = this.score;
            const linesElement = document.getElementById('lines');
            if (linesElement) linesElement.textContent = this.lines;
            this.render();
        }
        return linesCleared;
    }

    softDrop() {
        if (!this.currentPiece) return;
        
        while (this.movePiece(0, 1)) { }
        this.lockPiece();
        this.clearLines();
        this.currentPiece = this.createPiece();
        
        while (!this.currentPiece.canMove(this.grid.getGrid(), 0, 0, this.board.width, this.board.height)) {
            this.currentPiece.y = Math.max(0, this.currentPiece.y - 1);
        }
    }

    render() {
        if (!this.board) return;

        this.board.clearCells();
        if (this.currentPiece) {
            this.board.drawPiece(this.currentPiece);
        }
        this.board.drawGrid(this.grid);
    }
}
