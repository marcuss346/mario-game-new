const hills = '../assets/hills.png'
const backgrounds = 'https://www.shutterstock.com/image-vector/old-video-game-retro-style-600w-1052567756.jpg'
const platform = '../assets/platform.png'
const platformSmall = '../assets/platformSmallTall.png'
const SpriteRunLeft = '../assets/spriteRunLeft.png'
const spriteRunRight = '../assets/spriteRunRight.png'
const SpriteStandRight = '../assets/spriteStandRight.png'
const SpriteStandLeft = '../assets/spriteStandLeft.png'
const music = '../assets/Overworld Theme - Super Mario World.mp3'
const deathM = '../assets/Mario Death - Sound Effect (HD).mp3'
const windMusic = '../assets/Stage Win (Super Mario) - Sound Effect HD.mp3'
let volume = sessionStorage.getItem('volumeslider');
if (!volume) volume = 1;

console.log(volume);

const canvas = document.getElementById('canvas');
const c = canvas.getContext("2d");
const musicPlay = new Audio(music);
musicPlay.volume = volume;
const death = new Audio(deathM);
death.volume = volume;
const wins = new Audio(windMusic);
wins.volume = volume;

canvas.width = 1024;
canvas.height = 576;

const gravity = 1.5;

class Player {
  constructor() {
    this.speed = 10;
    this.position = {
      x: 110,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 66;
    this.height = 150;

    this.frames = 0;
    this.sprites = {
      stand: {
        left: createImage(
          SpriteStandLeft
        ),
        right: createImage(
          SpriteStandRight
        ),
        cropWidth: 177,
        width: 66,
      },
      run: {
        left: createImage(
          SpriteRunLeft
        ),
        right: createImage(
          spriteRunRight

        ),
        cropWidth: 341,
        width: 127.875,
      },
    };
    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 177;
  }

  draw() {
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.frames++;
    if (
      this.frames > 59 &&
      (this.currentSprite === this.sprites.stand.right ||
        this.currentSprite === this.sprites.stand.left)
    ) {
      this.frames = 0;
    } else if (
      this.frames > 29 &&
      (this.currentSprite === this.sprites.run.right ||
        this.currentSprite === this.sprites.run.left)
    ) {
      this.frames = 0;
    }
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }
  }
}

class Platform {
  constructor({
    x,
    y,
    image,
  }) {
    this.position = { x, y };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class GenericObject {

  constructor({
    x,
    y,
    image,
  }) {
    this.position = { x, y };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

function createImage(sprite) {
  const image = document.createElement('img');
  image.src = sprite;
  return image;
}

let platformImage = createImage(platform);
let hillsImage = createImage(hills);
let backgroundImage = createImage(
  backgrounds
);
backgroundImage.width = 2000;
backgroundImage.height = 576;
let platformSmallTallImage = createImage(
  platformSmall
);

let player = new Player();
let platforms = [];
let genericObjects = [];

let lastKey;
let keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};
let scrollOffset = 0;

function init() {

  platformImage = createImage(platform);
  hillsImage = createImage(hills);
  backgroundImage = createImage(
    backgrounds
  );
  platformSmallTallImage = createImage(
    platformSmall
  );

  player = new Player();
  platforms = [
    new Platform({
      x:
        platformImage.width * 4 +
        300 -
        2 +
        platformImage.width -
        platformSmallTallImage.width,
      y: 270,
      image: platformSmallTallImage,
    }),
    new Platform({ x: -1, y: 470, image: platformImage }),
    new Platform({ x: platformImage.width - 3, y: 470, image: platformImage }),
    new Platform({
      x: platformImage.width * 2 + 100,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 3 + 300,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 4 + 300 - 2,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 5 + 700 - 2,
      y: 470,
      image: platformImage,
    }),
  ];
  genericObjects = [
    new GenericObject({ x: -1, y: -1, image: backgroundImage }),
    new GenericObject({ x: -1, y: -1, image: hillsImage }),
  ];

  scrollOffset = 0;
}

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c?.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66;
      });
    }
  }

  // platform collision detection
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
      platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  // sprite switching
  if (
    keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    !keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.stand.left
  ) {
    player.currentSprite = player.sprites.stand.left;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  } else if (
    !keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.stand.right
  ) {
    player.currentSprite = player.sprites.stand.right;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  }

  // win condition
  if (scrollOffset > platformImage.width * 5 + 700 - 2) {
    console.log("you win");
    if (keys.right.pressed) {
      player.velocity.x = 0;
    }
    musicPlay.pause();
    wins.play();
    return;
  }

  // lose condition
  if (player.position.y > canvas.height) {
    musicPlay.pause();
    musicPlay.currentTime = 0;
    death.play();
    setTimeout(() => {
      death.pause();
      death.currentTime = 0;
      musicPlay.play();
    }, 2600);

    setTimeout(() => {
      init();
    }, 1500)

  }
}

init();
musicPlay.play();
animate();

addEventListener("keydown", ({ code }) => {
  switch (code) {
    case "KeyW":
      player.velocity.y -= 25;
      lastKey = "up";
      break;
    case "KeyA":
      keys.left.pressed = true;
      lastKey = "left";
      break;
    case "KeyS":
      lastKey = "down";
      break;
    case "KeyD":
      keys.right.pressed = true;
      lastKey = "right";
      break;
  }
});

addEventListener("keyup", ({ code }) => {
  switch (code) {
    case "KeyW":
      lastKey = "up";
      break;
    case "KeyA":
      keys.left.pressed = false;
      lastKey = "left";
      break;
    case "KeyS":
      lastKey = "down";
      break;
    case "KeyD":
      keys.right.pressed = false;
      lastKey = "right";
      break;
  }
});



