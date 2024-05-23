class Dinosaur {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.originalHeight = height;
    this.vy = 0;
    this.gravity = 2;
    this.jumpPower = -10; // Changed jump power to 10
    this.isJumping = false;
    this.isDucking = false;
    this.isHanging = false;
    this.hangTimeLimit = 200; // Hang time limit in milliseconds
    this.hangStartTime = 0;
    this.image = new Image();
    this.image.src = 'img/dino.png'; // Path to standing dinosaur image
    this.duckImage = new Image();
    this.duckImage.src = 'img/dino-duck.png'; // Path to ducking dinosaur image
  }

  jump() {
    if (!this.isJumping && !this.isDucking) {
      this.vy = this.jumpPower;
      this.isJumping = true;
    }
  }

  startHangTime() {
    if (this.isJumping && !this.isHanging) {
      this.isHanging = true;
      this.hangStartTime = Date.now();
    }
  }

  endHangTime() {
    this.isHanging = false;
  }

  duck() {
    if (!this.isJumping) {
      this.isDucking = true;
    }
  }

  standUp() {
    this.isDucking = false;
  }

  update() {
    if (this.isHanging) {
      if (Date.now() - this.hangStartTime > this.hangTimeLimit) {
        this.endHangTime();
      } else {
        this.vy += this.gravity * 0.1; // Reduce gravity effect during hang time
      }
    } else {
      this.vy += this.gravity;
    }

    this.y += this.vy;

    if (this.y > 150) {
      this.y = 150;
      this.vy = 0;
      this.isJumping = false;
      this.isHanging = false;
    }
  }

  draw(ctx) {
    if (this.isDucking) {
      ctx.drawImage(this.duckImage, this.x, this.y + this.originalHeight / 2, this.width, this.originalHeight / 2);
    } else {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }
}



class Obstacle {
  constructor(x, y, width, height, type, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.speed = speed;
    this.image = new Image();
    this.image.src = type === 'cactus' ? 'img/cactus.png' : 'img/bird.png'; // Path to obstacle images
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}


export { Dinosaur, Obstacle };
