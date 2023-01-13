export const hills = '../assets/hills.png'
export const backgrounds = 'https://www.shutterstock.com/image-vector/old-video-game-retro-style-600w-1052567756.jpg'
export const platform = '../assets/platform.png'
export const platformSmall = '../assets/platformSmallTall.png'
export const SpriteRunLeft = '../assets/spriteRunLeft.png'
export const spriteRunRight = '../assets/spriteRunRight.png'
export const SpriteStandRight = '../assets/spriteStandRight.png'
export const SpriteStandLeft = '../assets/spriteStandLeft.png'
export const music = '../assets/Overworld Theme - Super Mario World.mp3'
export const deathM = '../assets/Mario Death - Sound Effect (HD).mp3'
export const windMusic = '../assets/Stage Win (Super Mario) - Sound Effect HD.mp3'
export const gravity = 1.5;


export const canvas = document.getElementById('canvas');
export const c = canvas.getContext("2d");


export function createImage(sprite) {
    const image = document.createElement('img');
    image.src = sprite;
    return image;
}