import { Dinosaur, Obstacle } from './objects.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let dino = new Dinosaur(50, 150, 50, 50);
let obstacles = [];
let frameCount = 0;
let score = 0;
let gameOver = false;
let highScore = 0;

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    if (gameOver) {
      resetGame();
    } else {
      dino.jump();
      dino.startHangTime();
    }
  } else if (e.code === 'KeyS') {
    dino.duck();
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    dino.endHangTime();
  } else if (e.code === 'KeyS') {
    dino.standUp();
  }
});

canvas.addEventListener('click', () => {
  if (gameOver) {
    resetGame();
  }
});

function resetGame() {
  if (score > highScore) {
    highScore = score;
  }
  dino = new Dinosaur(50, 150, 50, 50);
  obstacles = [];
  frameCount = 0;
  score = 0;
  gameOver = false;
  update();
}

function generateObstacle() {
  let obstacleType = Math.random() < 0.5 ? 'cactus' : 'bird';
  let speed = 5 + Math.floor(score / 5); // Increase speed based on score
  let obstacle = new Obstacle(
    canvas.width,
    obstacleType === 'cactus' ? 150 : 110,
    obstacleType === 'cactus' ? 25 : 50,
    obstacleType === 'cactus' ? 50 : 50,
    obstacleType,
    speed
  );
  obstacles.push(obstacle);
}

function update() {
  if (gameOver) return;

  dino.update();

  frameCount++;
  if (frameCount % Math.max(100 - Math.floor(score / 10), 30) === 0) { // Adjust obstacle generation rate
    generateObstacle();
  }

  obstacles.forEach((obstacle, index) => {
    obstacle.update();

    /*
    if (
      dino.x < obstacle.x + obstacle.width &&
      dino.x + dino.width > obstacle.x &&
      dino.y < obstacle.y + obstacle.height &&
      dino.y + dino.height > obstacle.y
    ) {
      gameOver = true;
      if (score > highScore) {
        highScore = score;
      }
    }
    */
    
    if (
      dino.y < obstacle.y + obstacle.height &&
      dino.y + dino.height > obstacle.y &&
      !(dino.isDucking && obstacle.type === 'bird') // Check if ducking under a bird
    ) {
      // Check for horizontal collision only if not ducking under a bird
      if (
        dino.x < obstacle.x + obstacle.width &&
        dino.x + dino.width > obstacle.x
      ) {
        gameOver = true;
        if (score > highScore) {
          highScore = score;
        }
      }
    }

    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1);
      score++;
      if (score > highScore) {
        highScore = score;
      }
    }
  });

  draw();
  requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Dino
  dino.draw(ctx);

  // Draw obstacles
  obstacles.forEach(obstacle => obstacle.draw(ctx));

  // Draw score
  ctx.fillStyle = 'black';
  ctx.font = '20px "Press Start 2P"';
  ctx.fillText(`Score: ${score * 100}`, 10, 20);

  // Draw high score
  ctx.fillText(`High Score: ${highScore * 100}`, 10, 50);

  if (gameOver) {
    ctx.fillStyle = 'black';
    ctx.font = '30px "Press Start 2P"';
    ctx.fillText(`GAME OVER`, canvas.width / 2 - 80, canvas.height / 2);
    ctx.fillText(`Final Score: ${score * 100}`, canvas.width / 2 - 100, canvas.height / 2 + 40);
    ctx.fillText(`Click to Restart`, canvas.width / 2 - 100, canvas.height / 2 + 80);
  }
}

update();
