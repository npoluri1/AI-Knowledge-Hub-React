"""pip install pygame"""
try:
    import pygame
except ImportError:
    raise SystemExit("Install first:  pip install pygame")
import random, sys

W, H = 800, 500
pygame.init()
screen = pygame.display.set_mode((W, H))
clock = pygame.time.Clock()
FPS = 60

class Ball:
    def __init__(self):
        self.r = random.randint(12, 26)
        self.x, self.y = random.randint(self.r, W-self.r), random.randint(self.r, H-self.r)
        ang = random.uniform(0, 6.283)
        speed = random.uniform(120, 260)              # pixels per SECOND
        self.vx, self.vy = speed*random.cos(ang), speed*random.sin(ang)
        self.color = pygame.Color(random.randint(60,255),
                                  random.randint(60,255), random.randint(60,255))
    def step(self, dt: float):                        # dt = seconds since last frame
        self.x += self.vx * dt; self.y += self.vy * dt
        if not self.r <= self.x <= W-self.r: self.vx *= -1
        if not self.r <= self.y <= H-self.r: self.vy *= -1
    def draw(self, surf):
        pygame.draw.circle(surf, self.color, (int(self.x), int(self.y)), self.r)

balls = [Ball() for _ in range(14)]
while True:
    dt = clock.tick(FPS) / 1000.0                     # frame-time in seconds
    for e in pygame.event.get():
        if e.type == pygame.QUIT or (
           e.type == pygame.KEYDOWN and e.key == pygame.K_ESCAPE): sys.exit()
    screen.fill((15, 18, 32))
    for b in balls:
        b.step(dt); b.draw(screen)                    # physics scaled by real dt
    pygame.display.flip()