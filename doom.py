import pygame
import math
from random import randint

# Initialize Pygame
pygame.init()

# Constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
PLAYER_SPEED = 5
ENEMY_SPEED = 2
BULLET_SPEED = 10

# Colors
BLACK = (0, 0, 0)
RED = (255, 0, 0)
WHITE = (255, 255, 255)

# Player class
class Player:
    def __init__(self):
        self.x = SCREEN_WIDTH // 2
        self.y = SCREEN_HEIGHT // 2
        self.angle = 0
        self.health = 100

    def move(self, keys):
        if keys[pygame.K_w]:
            self.x += PLAYER_SPEED * math.cos(math.radians(self.angle))
            self.y -= PLAYER_SPEED * math.sin(math.radians(self.angle))
        if keys[pygame.K_s]:
            self.x -= PLAYER_SPEED * math.cos(math.radians(self.angle))
            self.y += PLAYER_SPEED * math.sin(math.radians(self.angle))
        if keys[pygame.K_a]:
            self.angle = (self.angle - 3) % 360
        if keys[pygame.K_d]:
            self.angle = (self.angle + 3) % 360

    def shoot(self):
        return Bullet(self.x, self.y, self.angle)

class Bullet:
    def __init__(self, x, y, angle):
        self.x = x
        self.y = y
        self.angle = angle
        self.alive = True

    def update(self):
        self.x += BULLET_SPEED * math.cos(math.radians(self.angle))
        self.y -= BULLET_SPEED * math.sin(math.radians(self.angle))
        
        # Check if bullet is off screen
        if (self.x < 0 or self.x > SCREEN_WIDTH or 
            self.y < 0 or self.y > SCREEN_HEIGHT):
            self.alive = False

class Enemy:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.health = 100
        self.alive = True

    def update(self, player):
        # Simple AI - move towards player
        dx = player.x - self.x
        dy = player.y - self.y
        angle = math.atan2(-dy, dx)
        
        self.x += ENEMY_SPEED * math.cos(angle)
        self.y += ENEMY_SPEED * math.sin(angle)

    def hit(self):
        self.health -= 20
        if self.health <= 0:
            self.alive = False

def main():
    # Set up the screen
    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
    pygame.display.set_caption("Doom-like Game")
    clock = pygame.time.Clock()

    # Create player
    player = Player()
    
    # Create enemies
    enemies = []
    for _ in range(5):
        x = randint(50, SCREEN_WIDTH - 50)
        y = randint(50, SCREEN_HEIGHT - 50)
        enemies.append(Enemy(x, y))

    # Game loop
    running = True
    bullets = []
    while running:
        # Handle events
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.MOUSEBUTTONDOWN:
                bullets.append(player.shoot())

        # Get keys
        keys = pygame.key.get_pressed()
        player.move(keys)

        # Update game objects
        for bullet in bullets[:]:
            bullet.update()
            if not bullet.alive:
                bullets.remove(bullet)

        for enemy in enemies[:]:
            enemy.update(player)
            # Check collision with bullets
            for bullet in bullets[:]:
                dx = enemy.x - bullet.x
                dy = enemy.y - bullet.y
                distance = math.sqrt(dx**2 + dy**2)
                if distance < 20:
                    enemy.hit()
                    bullets.remove(bullet)
                    if not enemy.alive:
                        enemies.remove(enemy)

        # Draw everything
        screen.fill(BLACK)
        
        # Draw player
        pygame.draw.circle(screen, WHITE, (int(player.x), int(player.y)), 15)
        
        # Draw enemies
        for enemy in enemies:
            pygame.draw.circle(screen, RED, (int(enemy.x), int(enemy.y)), 20)
        
        # Draw bullets
        for bullet in bullets:
            pygame.draw.circle(screen, WHITE, (int(bullet.x), int(bullet.y)), 3)

        pygame.display.flip()
        clock.tick(60)

    pygame.quit()

if __name__ == "__main__":
    main()
