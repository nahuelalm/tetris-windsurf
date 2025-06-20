export class Player {
    constructor() {
        this.position = { x: 0, y: 0 };
        this.speed = 5;
        this.health = 100;
        this.weapon = 'pistol';
        this.ammo = {
            pistol: 50,
            shotgun: 10,
            chaingun: 20
        };
    }

    move(direction) {
        switch(direction) {
            case 'up':
                this.position.y += this.speed;
                break;
            case 'down':
                this.position.y -= this.speed;
                break;
            case 'left':
                this.position.x -= this.speed;
                break;
            case 'right':
                this.position.x += this.speed;
                break;
        }
    }

    shoot() {
        if (this.ammo[this.weapon] > 0) {
            this.ammo[this.weapon]--;
            return true;
        }
        return false;
    }

    takeDamage(amount) {
        this.health -= amount;
        return this.health > 0;
    }
}
