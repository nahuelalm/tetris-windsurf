export class Piece {
    constructor(type, shape, color) {
        this.type = type;
        this.shape = shape;
        this.color = color;
        this.x = 0;
        this.y = 0;
        this.boardWidth = 10; // Ancho del tablero
        this.boardHeight = 20; // Alto del tablero
    }

    // Verifica si la pieza puede moverse a una posición específica
    canMove(grid, dx = 0, dy = 0, boardWidth = 10, boardHeight = 20) {
        const newX = this.x + dx;
        const newY = this.y + dy;

        // Verificar límites del tablero
        if (newX < 0 || newX + this.shape[0].length > boardWidth ||
            newY + this.shape.length > boardHeight) {
            return false;
        }

        // Si no hay grid, solo verificar límites
        if (!grid) return true;

        // Verificar colisiones con otras piezas
        for (let row = 0; row < this.shape.length; row++) {
            for (let col = 0; col < this.shape[row].length; col++) {
                if (this.shape[row][col] && 
                    grid[newY + row] && grid[newY + row][newX + col]) {
                    return false;
                }
            }
        }
        return true;
    }

    // Mueve la pieza a una nueva posición
    moveTo(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    // Rota la pieza
    rotate() {
        // Crear una copia de la forma actual
        const oldShape = JSON.parse(JSON.stringify(this.shape));
        
        // Rotar la pieza
        const newShape = [];
        for (let i = 0; i < this.shape[0].length; i++) {
            newShape[i] = [];
            for (let j = this.shape.length - 1; j >= 0; j--) {
                newShape[i].push(this.shape[j][i]);
            }
        }

        // Guardar la posición actual
        const oldX = this.x;
        const oldY = this.y;
        
        // Ajustar la posición si es necesario
        while (oldY + newShape.length > this.boardHeight) {
            oldY--;
        }

        // Verificar si la nueva posición es válida
        if (this.canMove(null, 0, 0, this.boardWidth, this.boardHeight)) {
            // Si es válida, aplicar la rotación
            this.shape = newShape;
            this.y = oldY;
        } else {
            // Si no es válida, restaurar la posición anterior
            this.shape = oldShape;
        }
    }
}
