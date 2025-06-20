export class GameState {
    constructor() {
        this.gameOver = false;
        this.score = 0;
        this.lines = 0;
        this.dropSpeed = 1000;
        this.softDropSpeed = 100;
        this.isSoftDropping = false;
        this.softDropTimer = null;
        this.eventListeners = new Set();
    }

    reset() {
        this.score = 0;
        this.lines = 0;
        this.gameOver = false;
        this.dropSpeed = 1000;
        this.isSoftDropping = false;
        this.softDropTimer = null;
    }

    updateScore(points) {
        this.score += points;
    }

    updateLines(cleared) {
        this.lines += cleared;
    }

    toggleSoftDrop() {
        this.isSoftDropping = !this.isSoftDropping;
    }
}
