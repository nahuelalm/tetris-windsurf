export class GameBoard {
    constructor() {
        this.board = document.getElementById('game-board');
        this.width = 10;
        this.height = 20;
        this.cellSize = 22;
        this.cells = [];
        this.initializeBoard();
    }

    initializeBoard() {
        this.board.innerHTML = '';
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.style.width = `${this.cellSize}px`;
                cell.style.height = `${this.cellSize}px`;
                this.board.appendChild(cell);
                this.cells.push(cell);
            }
        }
    }

    // Obtiene el índice de una celda en el grid
    getCellIndex(row, col) {
        return row * this.width + col;
    }

    // Actualiza el color de una celda
    updateCell(row, col, color = null) {
        const index = this.getCellIndex(row, col);
        if (index < this.cells.length) {
            this.cells[index].style.backgroundColor = color || '#000';
        }
    }

    // Limpia todas las celdas
    clearCells() {
        this.cells.forEach(cell => {
            cell.style.backgroundColor = '#000';
            cell.classList.remove('active', 'filled');
        });
    }

    // Dibuja una pieza en el tablero
    drawPiece(piece) {
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col]) {
                    const x = piece.x + col;
                    const y = piece.y + row;
                    if (y >= 0 && y < this.height) {
                        const index = this.getCellIndex(y, x);
                        if (index < this.cells.length) {
                            this.cells[index].classList.add('active');
                            this.cells[index].style.backgroundColor = piece.color;
                        }
                    }
                }
            }
        }
    }

    // Dibuja las piezas fijadas en el grid
    drawGrid(grid) {
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                const value = grid.get(col, row);
                if (value) {
                    const index = this.getCellIndex(row, col);
                    if (index < this.cells.length) {
                        this.cells[index].classList.add('filled');
                        this.cells[index].style.backgroundColor = value;
                    }
                }
            }
        }
    }
}
