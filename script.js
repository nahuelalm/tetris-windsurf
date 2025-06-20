class Tetris {
    constructor() {
        this.board = document.getElementById('game-board');
        this.score = 0;
        this.lines = 0;
        this.gameOver = false;
        this.boardWidth = 10;
        this.boardHeight = 20;
        this.grid = Array(this.boardHeight).fill().map(() => Array(this.boardWidth).fill(0));
        
        // Configuración de piezas
        this.tetrominos = {
            I: [[1, 1, 1, 1]],
            J: [[1, 0, 0], [1, 1, 1]],
            L: [[0, 0, 1], [1, 1, 1]],
            O: [[1, 1], [1, 1]],
            S: [[0, 1, 1], [1, 1, 0]],
            T: [[0, 1, 0], [1, 1, 1]],
            Z: [[1, 1, 0], [0, 1, 1]]
        };

        this.colors = {
            I: '#00ff00',
            J: '#00ff00',
            L: '#00ff00',
            O: '#00ff00',
            S: '#00ff00',
            T: '#00ff00',
            Z: '#00ff00'
        };
        
        // Estado de juego
        this.currentPiece = null;
        this.nextPiece = null;
        this.dropSpeed = 1000;
        this.gameInterval = null;
        
        this.initializeGame();
        this.setupEventListeners();
    }

    createPiece() {
        const pieceTypes = Object.keys(this.tetrominos);
        const randomPiece = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
        return {
            type: randomPiece,
            matrix: this.tetrominos[randomPiece],
            row: 0,
            col: Math.floor((this.boardWidth - this.tetrominos[randomPiece][0].length) / 2)
        };
    }

    startGame() {
        if (this.gameInterval) return;
        
        this.gameInterval = setInterval(() => {
            if (this.gameOver) return;
            
            if (!this.currentPiece) {
                this.currentPiece = this.createPiece();
            }
            
            if (!this.movePiece(0, 1)) {
                this.lockPiece();
                this.clearLines();
                this.currentPiece = this.nextPiece;
                this.nextPiece = this.createPiece();
                
                if (!this.validPosition()) {
                    this.gameOver = true;
                    clearInterval(this.gameInterval);
                    this.gameInterval = null;
                }
            }
            
            this.render();
        }, this.dropSpeed);
    }

    resetGame() {
        this.score = 0;
        this.lines = 0;
        this.gameOver = false;
        this.grid = Array(this.boardHeight).fill().map(() => Array(this.boardWidth).fill(0));
        this.currentPiece = null;
        this.nextPiece = null;
        this.updateScore();
        
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lines').textContent = this.lines;
    }

    initializeGame() {
        // Crear la cuadrícula del tablero
        for (let i = 0; i < this.boardHeight; i++) {
            for (let j = 0; j < this.boardWidth; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                this.board.appendChild(cell);
            }
        }

        // Generar la primera pieza
        this.nextPiece = this.createPiece();
        this.updateScore();
    }

    movePiece(dx, dy) {
        if (!this.currentPiece) return false;

        const newX = this.currentPiece.col + dx;
        const newY = this.currentPiece.row + dy;

        if (this.validPosition(newY, newX)) {
            this.currentPiece.col = newX;
            this.currentPiece.row = newY;
            return true;
        }
        return false;
    }

    validPosition(y = this.currentPiece.row, x = this.currentPiece.col) {
        if (!this.currentPiece) return true;

        for (let i = 0; i < this.currentPiece.matrix.length; i++) {
            for (let j = 0; j < this.currentPiece.matrix[i].length; j++) {
                if (this.currentPiece.matrix[i][j]) {
                    const newX = x + j;
                    const newY = y + i;

                    if (newX < 0 || newX >= this.boardWidth || newY >= this.boardHeight) {
                        return false;
                    }

                    if (newY >= 0 && this.grid[newY][newX]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    lockPiece() {
        if (!this.currentPiece) return;

        for (let i = 0; i < this.currentPiece.matrix.length; i++) {
            for (let j = 0; j < this.currentPiece.matrix[i].length; j++) {
                if (this.currentPiece.matrix[i][j]) {
                    const x = this.currentPiece.col + j;
                    const y = this.currentPiece.row + i;
                    if (y >= 0) {
                        this.grid[y][x] = this.currentPiece.type;
                    }
                }
            }
        }
    }

    clearLines() {
        let linesCleared = 0;
        for (let i = this.boardHeight - 1; i >= 0; i--) {
            if (this.grid[i].every(cell => cell)) {
                this.grid.splice(i, 1);
                this.grid.unshift(Array(this.boardWidth).fill(0));
                linesCleared++;
            }
        }

        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += linesCleared * 100;
            this.updateScore();
        }
    }

    rotatePiece() {
        if (!this.currentPiece) return;

        const rotated = this.currentPiece.matrix[0].map((_, i) => 
            this.currentPiece.matrix.map(row => row[i]).reverse()
        );

        const tempPiece = {
            ...this.currentPiece,
            matrix: rotated
        };

        if (this.validPosition(this.currentPiece.row, this.currentPiece.col, tempPiece)) {
            this.currentPiece.matrix = rotated;
        }
    }

    softDrop() {
        if (!this.currentPiece) return;

        while (this.movePiece(0, 1)) {}
        this.lockPiece();
        this.clearLines();
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createPiece();
        
        if (!this.validPosition()) {
            this.gameOver = true;
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
        
        this.render();
    }

    render() {
        const cells = this.board.querySelectorAll('.cell');
        
        // Limpiar el tablero
        cells.forEach(cell => {
            cell.classList.remove('active');
            cell.style.backgroundColor = '';
        });

        // Dibujar pieza actual
        if (this.currentPiece) {
            for (let i = 0; i < this.currentPiece.matrix.length; i++) {
                for (let j = 0; j < this.currentPiece.matrix[i].length; j++) {
                    if (this.currentPiece.matrix[i][j]) {
                        const x = this.currentPiece.col + j;
                        const y = this.currentPiece.row + i;
                        if (y >= 0) {
                            const cell = cells[y * this.boardWidth + x];
                            if (cell) {
                                cell.classList.add('active');
                                cell.style.backgroundColor = this.colors[this.currentPiece.type];
                            }
                        }
                    }
                }
            }
        }

        // Dibujar piezas fijas
        for (let i = 0; i < this.boardHeight; i++) {
            for (let j = 0; j < this.boardWidth; j++) {
                if (this.grid[i][j]) {
                    const cell = cells[i * this.boardWidth + j];
                    if (cell) {
                        cell.style.backgroundColor = this.colors[this.grid[i][j]];
                    }
                }
            }
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) return;
            
            switch(e.key) {
                case 'a':
                case 'A':
                    this.movePiece(-1, 0);
                    break;
                case 'd':
                case 'D':
                    this.movePiece(1, 0);
                    break;
                case 's':
                case 'S':
                    this.softDrop();
                    break;
                case 'w':
                case 'W':
                case ' ':
                    this.rotatePiece();
                    break;
            }
        });

        document.getElementById('start-button').addEventListener('click', () => {
            this.resetGame();
            this.startGame();
        });
    }



    initializeGame() {
        // Crear la cuadrícula del tablero
        for (let i = 0; i < this.boardHeight; i++) {
            for (let j = 0; j < this.boardWidth; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                this.board.appendChild(cell);
            }
        }

        // Generar la primera pieza
        this.generatePiece();
        this.updateScore();
    }

    generatePiece() {
        this.currentPiece = this.createPiece();
        this.nextPiece = this.createPiece();
    }

    createPiece() {
        const types = Object.keys(this.tetrominos);
        const type = types[Math.floor(Math.random() * types.length)];
        return {
            type,
            shape: this.tetrominos[type],
            x: Math.floor(this.boardWidth / 2) - Math.floor(this.tetrominos[type][0].length / 2),
            y: 0,
            color: this.colors[type]
        };
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) return;
            
            switch(e.key) {
                case 'a':
                case 'A':
                    this.movePiece(-1);
                    break;
                case 'd':
                case 'D':
                    this.movePiece(1);
                    break;
                case 's':
                case 'S':
                    this.softDrop();
                    break;
                case 'w':
                case 'W':
                case ' ':
                    this.rotatePiece();
                    break;
            }
        });

        document.getElementById('start-button').addEventListener('click', () => {
            this.resetGame();
            this.startGame();
        });
    }

    startGame() {
        if (this.gameOver) {
            // Reiniciar el juego
            this.gameOver = false;
            this.score = 0;
            this.lines = 0;
            this.grid = Array(this.boardHeight).fill().map(() => Array(this.boardWidth).fill(0));
            this.board.innerHTML = '';
            this.initializeGame();
            
            // Reproducir música al iniciar el juego
            this.music.play();
            this.music.volume = 0.5; // Ajustar volumen
        }

        this.gameLoop();
    }



    gameLoop() {
        if (!this.gameOver) {
            const delay = this.isSoftDropping ? this.softDropSpeed : this.dropSpeed;
            
            this.movePiece(0, 1);
            
            // Si la pieza no puede moverse hacia abajo, iniciar lock delay
            if (!this.isValidPosition(0, 1)) {
                if (!this.lockDelayTimer) {
                    this.lockDelayTimer = setTimeout(() => {
                        this.freezePiece();
                        this.playDropSound();
                        this.clearLines();
                        this.currentPiece = this.nextPiece;
                        this.nextPiece = this.createPiece();
                        
                        if (!this.isValidPosition()) {
                            this.gameOver = true;
                            alert('¡Game Over! Puntuación: ' + this.score);
                        }
                        this.lockDelayTimer = null;
                    }, this.lockDelay);
                }
            } else {
                // Si la pieza puede moverse, resetear lock delay
                if (this.lockDelayTimer) {
                    clearTimeout(this.lockDelayTimer);
                    this.lockDelayTimer = null;
                }
            }
            
            setTimeout(() => this.gameLoop(), delay);
        }
    }

    movePiece(dx = 0, dy = 0) {
        this.currentPiece.x += dx;
        this.currentPiece.y += dy;

        if (!this.isValidPosition()) {
            this.currentPiece.x -= dx;
            this.currentPiece.y -= dy;
            
            if (dy === 1) {
                this.freezePiece();
                this.clearLines();
                this.currentPiece = this.nextPiece;
                this.nextPiece = this.createPiece();
                
                if (!this.isValidPosition()) {
                    this.gameOver = true;
                    alert('¡Game Over! Puntuación: ' + this.score);
                }
            }
        }

        this.updateBoard();
    }

    rotatePiece() {
        const newShape = this.rotateMatrix(this.currentPiece.shape);
        const oldShape = this.currentPiece.shape;
        this.currentPiece.shape = newShape;

        if (!this.isValidPosition()) {
            this.currentPiece.shape = oldShape;
        }

        this.updateBoard();
    }

    rotateMatrix(matrix) {
        return matrix[0].map((_, colIndex) => 
            matrix.map(row => row[colIndex]).reverse()
        );
    }

    isValidPosition() {
        const piece = this.currentPiece;
        
        for (let i = 0; i < piece.shape.length; i++) {
            for (let j = 0; j < piece.shape[i].length; j++) {
                if (piece.shape[i][j] === 1) {
                    const x = piece.x + j;
                    const y = piece.y + i;
                    
                    if (x < 0 || x >= this.boardWidth || y >= this.boardHeight || 
                        (y >= 0 && this.grid[y][x] !== 0)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    freezePiece() {
        const piece = this.currentPiece;
        
        for (let i = 0; i < piece.shape.length; i++) {
            for (let j = 0; j < piece.shape[i].length; j++) {
                if (piece.shape[i][j] === 1) {
                    const x = piece.x + j;
                    const y = piece.y + i;
                    if (y >= 0) {
                        this.grid[y][x] = 1;
                    }
                }
            }
        }
    }

    clearLines() {
        let linesCleared = 0;
        
        for (let i = this.boardHeight - 1; i >= 0; i--) {
            if (this.grid[i].every(cell => cell === 1)) {
                this.grid.splice(i, 1);
                this.grid.unshift(Array(this.boardWidth).fill(0));
                linesCleared++;
            }
        }

        if (linesCleared > 0) {
            this.playLineClearSound();
            this.score += linesCleared * 100;
            this.lines += linesCleared;
            document.getElementById('score').textContent = this.score;
            document.getElementById('lines').textContent = this.lines;
        }
    }

    updateBoard() {
        // Limpiar el tablero
        this.board.innerHTML = '';
        
        // Dibujar la cuadrícula
        for (let i = 0; i < this.boardHeight; i++) {
            for (let j = 0; j < this.boardWidth; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                
                if (this.grid[i][j] === 1) {
                    cell.classList.add('active');
                }

                // Dibujar la pieza actual
                if (this.currentPiece) {
                    for (let k = 0; k < this.currentPiece.shape.length; k++) {
                        for (let l = 0; l < this.currentPiece.shape[k].length; l++) {
                            if (this.currentPiece.shape[k][l] === 1 && 
                                j === this.currentPiece.x + l && 
                                i === this.currentPiece.y + k) {
                                cell.classList.add('active');
                                cell.style.backgroundColor = this.currentPiece.color;
                            }
                        }
                    }
                }

                this.board.appendChild(cell);
            }
        }
    }
}

// Inicializar el juego
const game = new Tetris();
