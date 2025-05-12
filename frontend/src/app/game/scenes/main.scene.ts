import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  constructor() {
    super('main');
  }

  preload() {
    this.load.image('sky', 'assets/sky.jpeg');
  }

  create() {
    this.add.image(400, 300, 'sky');
  }

  
}
