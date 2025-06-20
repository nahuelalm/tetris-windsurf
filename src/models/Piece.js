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
        const newShape = JSON.parse(JSON.stringify(this.shape));
        
        // Guardar la posición y forma actual
        const oldShape = this.shape;
        const oldY = this.y;
        
        // Rotar la pieza
        const rotated = [];
        for (let i = 0; i < this.shape[0].length; i++) {
            rotated[i] = [];
            for (let j = 0; j < this.shape.length; j++) {
                rotated[i][j] = this.shape[j][i];
            }
        }
        
        // Actualizar la rotación
        this.rotation = (this.rotation + 90) % 360;
        
        // Verificar si la nueva posición es válida
        if (this.canMove(null, 0, 0, this.boardWidth, this.boardHeight)) {
            // Si es válida, aplicar la rotación
            this.shape = rotated;
        } else {
            // Si no es válida, restaurar la posición anterior
            this.shape = oldShape;
        }
        
        return rotated;
    }
}
