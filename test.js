describe('Tetris Game', () => {
    let tetris;
    let board;
    
    beforeEach(() => {
        // Crear un mock del tablero
        board = document.createElement('div');
        board.id = 'game-board';
        document.body.appendChild(board);
        
        // Crear un mock de los elementos de puntuación
        document.body.innerHTML += `
            <span id="score">0</span>
            <span id="lines">0</span>
            <button id="start-button">Iniciar Juego</button>
        `;
        
        // Crear una nueva instancia del juego
        tetris = new Tetris();
    });

    afterEach(() => {
        // Limpiar el DOM después de cada prueba
        document.body.innerHTML = '';
    });

    test('should initialize game properly', () => {
        expect(tetris.board).toBeDefined();
        expect(tetris.board.id).toBe('game-board');
        expect(tetris.score).toBe(0);
        expect(tetris.lines).toBe(0);
        expect(tetris.gameOver).toBe(false);
        expect(tetris.boardWidth).toBe(10);
        expect(tetris.boardHeight).toBe(20);
    });

    test('should create piece with valid position', () => {
        const piece = tetris.createPiece();
        expect(piece).toBeDefined();
        expect(piece.type).toBeDefined();
        expect(piece.matrix).toBeDefined();
        expect(piece.row).toBe(0);
        expect(piece.col).toBeGreaterThanOrEqual(0);
        expect(piece.col).toBeLessThan(10);
    });

    test('should move piece left and right', () => {
        tetris.currentPiece = tetris.createPiece();
        const initialCol = tetris.currentPiece.col;
        
        // Mover a la derecha
        tetris.movePiece(1, 0);
        expect(tetris.currentPiece.col).toBe(initialCol + 1);
        
        // Mover a la izquierda
        tetris.movePiece(-1, 0);
        expect(tetris.currentPiece.col).toBe(initialCol);
    });

    test('should rotate piece', () => {
        tetris.currentPiece = tetris.createPiece();
        const initialMatrix = [...tetris.currentPiece.matrix];
        
        tetris.rotatePiece();
        expect(tetris.currentPiece.matrix).not.toEqual(initialMatrix);
    });

    test('should update score when lines are cleared', () => {
        tetris.score = 0;
        tetris.lines = 0;
        
        tetris.clearLines(); // No hay líneas para limpiar
        expect(tetris.score).toBe(0);
        expect(tetris.lines).toBe(0);
        
        // Simular una línea completa
        tetris.grid[0] = Array(10).fill('I');
        tetris.clearLines();
        
        expect(tetris.score).toBe(100);
        expect(tetris.lines).toBe(1);
    });
});
