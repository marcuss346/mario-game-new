import { canvas, c } from './constants.js';


export class GenericObject {

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
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
}