export class Monster {
    constructor(x, y) {
        this.position = { x, y };
        this.health = 100;
        this.speed = 3;
        this.damage = 10;
        this.state = 'idle'; // idle, attack, dead
        this.type = 'zombie'; // zombie, demon, cyberdemon
    }

    update(playerPosition) {
        // Simple AI to chase the player
        const dx = playerPosition.x - this.position.x;
        const dy = playerPosition.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
            this.state = 'attack';
        } else {
            this.state = 'chase';
        }

        // Move towards player
        if (distance > 10) {
            const angle = Math.atan2(dy, dx);
            this.position.x += Math.cos(angle) * this.speed;
            this.position.y += Math.sin(angle) * this.speed;
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        return this.health > 0;
    }

    attack(player) {
        if (this.state === 'attack') {
            return player.takeDamage(this.damage);
        }
        return true;
    }
}
