import { canvas, c } from './constants.js';
const SpriteStandLeft = '../assets/pngegg.png'
import { createImage } from './constants.js';
import { gravity } from './constants.js';

export class Enemy {
    constructor() {
        this.speed = 10;
        this.position = {
            x: Math.floor(Math.random() * 2000 + 200),
            y: 100,
        };
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.width = 40;
        this.height = 70;

        this.sprite = createImage(SpriteStandLeft);
    }

    draw() {
        c.drawImage(
            this.sprite,
            0,
            40,
            400,
            296,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    update() {

        if (this.position.y > canvas.height) {
            this.position.y = 100;
            this.position.x = Math.floor(Math.random() * 2000 + 200);
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        }
    }
}