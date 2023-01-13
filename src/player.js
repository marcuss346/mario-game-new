import { canvas, c } from './constants.js';
const SpriteRunLeft = '../assets/spriteRunLeft.png'
const spriteRunRight = '../assets/spriteRunRight.png'
const SpriteStandRight = '../assets/spriteStandRight.png'
const SpriteStandLeft = '../assets/spriteStandLeft.png'
import { createImage } from './constants.js';
import { gravity } from './constants.js';

export class Player {
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
        console.log(this.position.y)
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