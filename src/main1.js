import { Player } from './player.js';
import { Platform } from './platform.js';
import { GenericObject } from './genericObject.js';
import { createImage } from './constants.js';
import { canvas, c } from './constants.js';
import { Enemy } from './enemy.js';

const hills = '../assets/hills.png'
const backgrounds = 'https://wallpapercave.com/wp/UtwFDMx.jpg'
const platform = '../assets/platform.png'
const platformSmall = '../assets/platformSmallTall.png'
const music = '../assets/Overworld Theme - Super Mario World.mp3'
const deathM = '../assets/Mario Death - Sound Effect (HD).mp3'
const windMusic = '../assets/Stage Win (Super Mario) - Sound Effect HD.mp3'

let nOfEnemies = localStorage.getItem('NumberOfEnemies');
if (!nOfEnemies) nOfEnemies = 1;
console.log(nOfEnemies)

//SETTING MUSIC LOUDNESS AND CANVAS PROPERTIES
let volume = localStorage.getItem('volumeslider');
if (!volume) volume = 1;
canvas.width = 1024;
canvas.height = 576;

console.log(volume);
let inits = false;
let isJump = false;
let ends = false;

//MUSIC DEFINITION
const musicPlay = new Audio(music);
musicPlay.volume = volume;
const death = new Audio(deathM);
death.volume = volume;
const wins = new Audio(windMusic);
wins.volume = volume;
//END MUSIC DEFINITION

//DEFINING LOCAL VARIABLES
let platformImage = 0;
let Enemies = [];
let hillsImage = 0;
let backgroundImage = 0;
let platformSmallTallImage = 0;
let player = new Player();
let platforms = [];
let genericObjects = [];
let flyingPlatform = [];
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


//INITIALISING FUNCTION
function init() {
  musicPlay.play();
  inits = false;
  platformImage = createImage(platform);
  hillsImage = createImage(hills);
  backgroundImage = createImage(
    backgrounds
  );
  backgroundImage.width = 6000;
  platformSmallTallImage = createImage(
    platformSmall
  );

  player = new Player();
  flyingPlatform = [
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
    new Platform({
      x:
        300,
      y: 100 + platformSmallTallImage.height,
      image: platformSmallTallImage,
    }),

  ]
  platforms = [
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
    new Platform({
      x: platformImage.width * 6 + 700 - 3,
      y: 470,
      image: platformImage,
    })
  ];
  genericObjects = [
    new GenericObject({ x: -1, y: -1, image: backgroundImage }),
    new GenericObject({ x: -1, y: -1, image: hillsImage }),
  ];

  for (let i = 0; i < nOfEnemies; i++) {
    Enemies[i] =
      new Enemy()

  }



  scrollOffset = 0;
}

//ANIMATING FUNCTION
async function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  flyingPlatform.forEach((flyingPlatform) => {
    flyingPlatform.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });

  Enemies.forEach((enemy) => {
    let b = 0
    console.log('b: ' + b + ' x:' + enemy.position.x + 'y:' + enemy.position.y)
    enemy.update();
    enemy.draw();
  })

  player.update();

  Enemies.forEach(enemies => {
    if (player.position.x > enemies.position.x) {
      enemies.velocity.x = 1;
    } else {
      enemies.velocity.x = -1;
    }
  })

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
      Enemies.forEach((enemy) => {
        enemy.position.x -= player.speed;

      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });
      flyingPlatform.forEach((flyingPlatform) => {
        flyingPlatform.position.x -= player.speed;
      })
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      Enemies.forEach((enemy) => {
        enemy.position.x += player.speed;

      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66;
      });
      flyingPlatform.forEach((flyingPlatform) => {
        flyingPlatform.position.x += player.speed;
      })
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
      isJump = false;
    }

    Enemies.forEach(async (enemy) => {
      if (
        enemy.position.y + enemy.height <= platform.position.y &&
        enemy.position.y + enemy.height + enemy.velocity.y >=
        platform.position.y &&
        enemy.position.x + enemy.width >= platform.position.x &&
        enemy.position.x <= platform.position.x + platform.width
      ) {
        enemy.velocity.y = 0;
      }
      if (
        collision(enemy, player) && !inits
      ) {
        player.speed = 0;
        inits = true;
        musicPlay.pause();
        musicPlay.currentTime = 0;
        death.play();

        const timeout = () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              death.pause();
              death.currentTime = 0;
              musicPlay.play();
              console.log('resolved')
              resolve(true);
            }, 2600);
          });
        }

        await timeout();

        init();
        console.log('init')

      }

    });
  });


  flyingPlatform.forEach((flyingPlatform) => {
    if (
      player.position.y + player.height <= flyingPlatform.position.y &&
      player.position.y + player.height + player.velocity.y >=
      flyingPlatform.position.y &&
      player.position.x + player.width >= flyingPlatform.position.x &&
      player.position.x <= flyingPlatform.position.x + flyingPlatform.width
    ) {
      player.velocity.y = 0;
      isJump = false;
    }
    if (flyingPlatform.position.x <= player.position.x + player.width
      && player.position.y + player.height >= flyingPlatform.position.y
      && player.position.x < flyingPlatform.position.x + flyingPlatform.width
    ) {
      player.position.x = flyingPlatform.position.x - player.width;
    }

    if (
      flyingPlatform.position.x + flyingPlatform.width >= player.position.x &&
      player.position.y + player.height >= flyingPlatform.position.y &&
      player.position.x > flyingPlatform.position.x
    ) {
      console.log('right collision')
      player.position.x = flyingPlatform.position.x + flyingPlatform.width
    }
  })



  // sprite switchingd
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
    let newI = new Image();
    newI.src = 'https://www.wired.com/images_blogs/photos/uncategorized/2008/04/30/mkwin.jpg'
    c.drawImage(newI, 0, 0, canvas.width, canvas.height);
    if (!ends) {
      ends = true;
      console.log("you win");
      player.velocity.x = 0;
      musicPlay.pause();
      wins.play();
      c.fillStyle = "white";
      c.fillRect(0, 0, canvas.width, canvas.height);
      let newI = new Image();
      newI.src = 'https://www.wired.com/images_blogs/photos/uncategorized/2008/04/30/mkwin.jpg'
      c.drawImage(newI, 0, 0, canvas.width, canvas.height);
      const timeout = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            c.drawImage(newI, 0, 0, canvas.width, canvas.height);
            wins.pause();
            console.log('resolved')
            resolve(true);
          }, 3600);
        });
      }


      await timeout();
      window.location.replace('./mainpage.html');
      return 0;
    }
  }

  // lose condition
  if (player.position.y > canvas.height && !inits) {
    inits = true;
    musicPlay.pause();
    musicPlay.currentTime = 0;
    death.play();

    const timeout = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          death.pause();
          death.currentTime = 0;
          musicPlay.play();
          console.log('resolved')
          resolve(true);
        }, 2600);
      });
    }

    await timeout();

    init();
    console.log('init')

  }
}

init();
animate();

addEventListener("keydown", ({ code }) => {
  switch (code) {
    case "KeyW":
      if (!isJump) {
        player.velocity.y -= 25;
      }
      lastKey = "up";
      isJump = true;
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

function collision(r1, r2) {
  if (r1.position.x + r1.width >= r2.position.x &&
    r1.position.x <= r2.position.x + r2.width &&
    r1.position.y + r1.height >= r2.position.y &&
    r1.position.y <= r2.position.y + r2.height) {
    return true;
  }

  return false;
}



