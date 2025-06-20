export class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = Array(height).fill().map(() => Array(width).fill(null));
    }

    mergePiece(piece) {
        if (!piece) return;
        
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col]) {
                    const gridX = piece.x + col;
                    const gridY = piece.y + row;
                    if (gridY >= 0 && gridY < this.height && gridX >= 0 && gridX < this.width) {
                        this.grid[gridY][gridX] = piece.color;
                    }
                }
            }
        }
    }

    // Verifica si una posición está vacía
    isEmpty(x, y) {
        return this.grid[y] && this.grid[y][x] === null;
    }

    // Establece un valor en una posición específica
    set(x, y, value) {
        if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
            this.grid[y][x] = value;
        }
    }

    // Obtiene el valor en una posición específica
    get(x, y) {
        if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
            return this.grid[y][x];
        }
        return null;
    }

    // Verifica si hay líneas completas y las elimina
    clearLines() {
        let linesCleared = 0;
        
        // Verificar y eliminar líneas completas desde abajo hacia arriba
        for (let row = this.height - 1; row >= 0; row--) {
            if (this.grid[row].every(cell => cell !== null)) {
                linesCleared++;
                // Eliminar la línea completa
                this.grid.splice(row, 1);
                // Agregar una nueva línea vacía en la parte superior
                this.grid.unshift(Array(this.width).fill(null));
                // Ajustar el índice para mantener la iteración correcta
                row++;
            }
        }
        return linesCleared;
    }

    // Limpiar la cuadrícula
    clear() {
        this.grid = Array(this.height).fill().map(() => Array(this.width).fill(null));
    }

    isGameOver() {
        // El juego termina si hay celdas llenas en la fila superior
        return this.grid[0].some(cell => cell !== null);
    }

    // Obtiene una copia del grid
    getGrid() {
        return JSON.parse(JSON.stringify(this.grid));
    }
}
