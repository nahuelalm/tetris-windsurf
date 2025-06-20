export class GameMovement {
    constructor(game) {
        this.game = game;
    }

    movePiece(dx, dy) {
        if (!this.game.currentPiece) return false;
        
        const newX = this.game.currentPiece.x + dx;
        const newY = this.game.currentPiece.y + dy;
        
        if (this.canPieceMove(newX, newY)) {
            this.game.currentPiece.x = newX;
            this.game.currentPiece.y = newY;
            return true;
        }
        return false;
    }

    rotatePiece() {
        if (!this.game.currentPiece) return;
        
        // Guardar la posición actual
        const oldX = this.game.currentPiece.x;
        const oldY = this.game.currentPiece.y;
        
        // Rotar la pieza
        const rotated = this.game.currentPiece.rotate();
        
        // Intentar colocar la pieza en la nueva posición
        if (this.canPieceMove(oldX, oldY)) {
            this.game.currentPiece.shape = rotated;
            return true;
        }
        
        // Si no se puede colocar en la posición actual, intentar ajustar la posición
        for (let x = -2; x <= 2; x++) {
            for (let y = -2; y <= 2; y++) {
                if (this.canPieceMove(oldX + x, oldY + y)) {
                    this.game.currentPiece.x = oldX + x;
                    this.game.currentPiece.y = oldY + y;
                    this.game.currentPiece.shape = rotated;
                    return true;
                }
            }
        }
        
        // Si no se puede rotar, restaurar la posición original
        this.game.currentPiece.x = oldX;
        this.game.currentPiece.y = oldY;
        return false;
    }

    canPieceMove(x, y) {
        const piece = this.game.currentPiece;
        if (!piece) return false;
        
        for (let i = 0; i < piece.shape.length; i++) {
            for (let j = 0; j < piece.shape[i].length; j++) {
                if (piece.shape[i][j] === 1) {
                    const gridX = x + j;
                    const gridY = y + i;
                    
                    if (gridX < 0 || gridX >= this.game.grid.width ||
                        gridY >= this.game.grid.height ||
                        (gridY >= 0 && this.game.grid.grid[gridY][gridX])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
