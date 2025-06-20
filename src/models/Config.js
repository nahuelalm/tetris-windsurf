export const GAME_CONFIG = {
    // Dimensiones del tablero
    BOARD_WIDTH: 10,
    BOARD_HEIGHT: 20,
    
    // Colores de las piezas
    COLORS: {
        I: '#00FFFF',
        J: '#0000FF',
        L: '#FFA500',
        O: '#FFFF00',
        S: '#00FF00',
        T: '#9400D3',
        Z: '#FF0000'
    },
    
    // Definición de las piezas
    TETROMINOS: {
        I: [[1, 1, 1, 1]],
        J: [[1, 0, 0], [1, 1, 1]],
        L: [[0, 0, 1], [1, 1, 1]],
        O: [[1, 1], [1, 1]],
        S: [[0, 1, 1], [1, 1, 0]],
        T: [[0, 1, 0], [1, 1, 1]],
        Z: [[1, 1, 0], [0, 1, 1]]
    },
    
    // Configuración de tiempos
    DROP_SPEED: 1000,
    SOFT_DROP_SPEED: 100,
    
    // Configuración de puntuación
    POINTS_PER_LINE: 100,
    
    // Configuración de teclas
    KEY_DEBOUNCE: 100
};
