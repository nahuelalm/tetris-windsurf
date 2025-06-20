import { Player } from './src/Player.js';
import { Monster } from './src/Monster.js';

// Game configuration
const GAME_CONFIG = {
    canvasWidth: 800,
    canvasHeight: 600,
    playerSpeed: 5,
    monsterSpeed: 3,
    monsterCount: 5
};

// Game state
let player;
let monsters = [];
let gameRunning = true;

// Initialize the game
function initGame() {
    player = new Player();
    
    // Create monsters
    for (let i = 0; i < GAME_CONFIG.monsterCount; i++) {
        monsters.push(new Monster(
            Math.random() * GAME_CONFIG.canvasWidth,
            Math.random() * GAME_CONFIG.canvasHeight
        ));
    }

    const canvas = document.createElement('canvas');
    canvas.width = GAME_CONFIG.canvasWidth;
    canvas.height = GAME_CONFIG.canvasHeight;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Setup keyboard controls
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp':
                player.move('up');
                break;
            case 'ArrowDown':
                player.move('down');
                break;
            case 'ArrowLeft':
                player.move('left');
                break;
            case 'ArrowRight':
                player.move('right');
                break;
            case ' ':
                player.shoot();
                break;
        }
    });

    // Game loop
    function gameLoop() {
        if (!gameRunning) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update game state
        update();
        
        // Draw game
        draw(ctx);
        
        // Request next frame
        requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
}

// Game state update
function update() {
    // Update monsters
    monsters.forEach(monster => {
        monster.update(player.position);
        monster.attack(player);
    });

    // Check game over conditions
    if (player.health <= 0) {
        gameRunning = false;
        alert('Game Over!');
    }
}

// Game rendering
function draw(ctx) {
    // Draw player
    ctx.fillStyle = '#fff';
    ctx.fillRect(player.position.x - 10, player.position.y - 10, 20, 20);

    // Draw monsters
    ctx.fillStyle = '#ff0000';
    monsters.forEach(monster => {
        ctx.fillRect(monster.position.x - 10, monster.position.y - 10, 20, 20);
    });

    // Draw health
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(10, 10, player.health * 2, 10);
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);
