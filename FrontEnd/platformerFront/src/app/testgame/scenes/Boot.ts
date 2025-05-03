import Phaser from "phaser";

export class Boot extends Phaser.Scene {
  constructor() {
    super({
      key: "Boot"
    });
  }

  preload() {
    this.load.tilemapTiledJSON("SpringLevel", "../assets/BaseMap.json");
    this.load.image("springTiles", "../assets/tiles.png");

    this.load.spritesheet("Tommy", "../assets/boy.png", {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.image("springBackground", "../assets/background.png");
  }

  create() {
    this.scene.start("Play");
  }
}

export default Boot;
