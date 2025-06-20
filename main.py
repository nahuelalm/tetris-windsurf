import pygame
import math
import random

# Initialize Pygame
pygame.init()

# Constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
PLAYER_SPEED = 3
PLAYER_ROTATION_SPEED = 3
BULLET_SPEED = 8
ENEMY_SPEED = 1

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)

# Set up the display
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Doom-like Game")
clock = pygame.time.Clock()

# Player class
class Player:
    def __init__(self):
        self.x = SCREEN_WIDTH // 2
        self.y = SCREEN_HEIGHT // 2
        self.angle = 0
        self.radius = 15
        self.health = 100

    def move(self, keys):
        if keys[pygame.K_w]:
            self.x += math.cos(math.radians(self.angle)) * PLAYER_SPEED
            self.y += math.sin(math.radians(self.angle)) * PLAYER_SPEED
        if keys[pygame.K_s]:
            self.x -= math.cos(math.radians(self.angle)) * PLAYER_SPEED
            self.y -= math.sin(math.radians(self.angle)) * PLAYER_SPEED
        if keys[pygame.K_a]:
            self.x -= math.cos(math.radians(self.angle + 90)) * PLAYER_SPEED
            self.y -= math.sin(math.radians(self.angle + 90)) * PLAYER_SPEED
        if keys[pygame.K_d]:
            self.x += math.cos(math.radians(self.angle + 90)) * PLAYER_SPEED
            self.y += math.sin(math.radians(self.angle + 90)) * PLAYER_SPEED

    def rotate(self, mouse_pos):
        dx = mouse_pos[0] - self.x
        dy = mouse_pos[1] - self.y
        self.angle = math.degrees(math.atan2(-dy, dx))

    def draw(self):
        pygame.draw.circle(screen, GREEN, (int(self.x), int(self.y)), self.radius)
        # Draw player's aim direction
        aim_x = self.x + math.cos(math.radians(self.angle)) * 50
        aim_y = self.y + math.sin(math.radians(self.angle)) * 50
        pygame.draw.line(screen, WHITE, (self.x, self.y), (aim_x, aim_y), 2)

class Bullet:
    def __init__(self, x, y, angle):
        self.x = x
        self.y = y
        self.angle = angle
        self.speed = BULLET_SPEED

    def update(self):
        self.x += math.cos(math.radians(self.angle)) * self.speed
        self.y += math.sin(math.radians(self.angle)) * self.speed

    def draw(self):
        pygame.draw.circle(screen, RED, (int(self.x), int(self.y)), 3)

class Enemy:
    def __init__(self):
        self.x = random.randint(50, SCREEN_WIDTH - 50)
        self.y = random.randint(50, SCREEN_HEIGHT - 50)
        self.radius = 10
        self.health = 100

    def move_towards_player(self, player):
        dx = player.x - self.x
        dy = player.y - self.y
        distance = math.sqrt(dx ** 2 + dy ** 2)
        if distance > 0:
            self.x += dx / distance * ENEMY_SPEED
            self.y += dy / distance * ENEMY_SPEED

    def draw(self):
        pygame.draw.circle(screen, RED, (int(self.x), int(self.y)), self.radius)

# Game initialization
player = Player()
bullets = []
enemies = [Enemy() for _ in range(5)]
running = True

while running:
    # Event handling
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1:  # Left mouse button
                bullets.append(Bullet(player.x, player.y, player.angle))

    # Get keys
    keys = pygame.key.get_pressed()
    
    # Update
    player.move(keys)
    player.rotate(pygame.mouse.get_pos())
    
    # Update bullets
    for bullet in bullets[:]:
        bullet.update()
        # Remove bullets that go off screen
        if (bullet.x < 0 or bullet.x > SCREEN_WIDTH or 
            bullet.y < 0 or bullet.y > SCREEN_HEIGHT):
            bullets.remove(bullet)
    
    # Update enemies
    for enemy in enemies[:]:
        enemy.move_towards_player(player)
        # Check collision with bullets
        for bullet in bullets[:]:
            distance = math.sqrt((enemy.x - bullet.x) ** 2 + 
                               (enemy.y - bullet.y) ** 2)
            if distance < enemy.radius:
                bullets.remove(bullet)
                enemy.health -= 20
                if enemy.health <= 0:
                    enemies.remove(enemy)
                    enemies.append(Enemy())  # Spawn new enemy

    # Draw
    screen.fill(BLACK)
    player.draw()
    
    for bullet in bullets:
        bullet.draw()
    
    for enemy in enemies:
        enemy.draw()

    pygame.display.flip()
    clock.tick(60)

pygame.quit()
