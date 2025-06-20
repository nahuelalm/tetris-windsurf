export class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = Array(height).fill().map(() => Array(width).fill(null));
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
        const linesToDelete = [];
        
        for (let row = 0; row < this.height; row++) {
            if (this.grid[row].every(cell => cell !== null)) {
                linesToDelete.push(row);
            }
        }

        linesToDelete.forEach(row => {
            this.grid.splice(row, 1);
            this.grid.unshift(Array(this.width).fill(null));
        });

        return linesToDelete.length;
    }

    // Limpiar la cuadrícula
    clear() {
        this.grid = Array(this.height).fill().map(() => Array(this.width).fill(null));
    }

    // Obtiene una copia del grid
    getGrid() {
        return JSON.parse(JSON.stringify(this.grid));
    }
}
