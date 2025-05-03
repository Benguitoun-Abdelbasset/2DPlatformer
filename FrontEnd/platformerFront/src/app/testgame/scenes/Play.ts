// import Phaser from "phaser";

// import Player from "./sprites/Player";

// import DebuggerHelper from "./utils/DebuggerHelper";

// export class Play extends Phaser.Scene {
//   constructor() {
//     super({
//       key: "Play"
//     });
//   }

//   create() {
//     var sceneWidth = this.scale.width;
//     var sceneHeight = this.scale.height;

//     this.make.tileSprite({
//       x: sceneWidth / 2,
//       y: sceneHeight / 2,
//       width: sceneWidth * 2 * 4,
//       height: sceneHeight * 2,
//       key: "springBackground",
//       scale: {
//         x: 1 / 2,
//         y: 1 / 2
//       }
//     });

//     this.map = this.make.tilemap({ key: "SpringLevel" });
//     this.tiles = this.map.addTilesetImage("grassLandTiles", "springTiles");
//     this.collideLayer = this.map.createStaticLayer(
//       "CollideLayer",
//       this.tiles,
//       0,
//       0
//     );
//     this.collideLayer.setCollisionByProperty({ collides: true });

//     var spawnPoint = new Phaser.Math.Vector2(sceneWidth / 2, sceneHeight / 2);
//     this.map.getObjectLayer("Points").objects.forEach(object => {
//       switch (object.name) {
//         case `spawnPoint`:
//           spawnPoint.set(object.x, object.y);
//           break;
//         default:
//           break;
//       }
//     });

//     this.player = new Player({
//       scene: this,
//       key: "Tommy",
//       x: spawnPoint.x,
//       y: spawnPoint.y,
//       input: this.input
//     });

//     this.physics.add.collider(this.player.sprite, this.collideLayer);

//     this.cameras.main.setBounds(
//       0,
//       0,
//       this.map.widthInPixels,
//       this.map.heightInPixels
//     );
//     this.cameras.main.startFollow(this.player.sprite);

//     this.cameras.main.roundPixels = true;

//     this.physics.world.setBounds(
//       0,
//       0,
//       this.map.widthInPixels,
//       this.map.heightInPixels
//     );

//     if (this.game.config.physics.arcade.debug) {
//       this.debugger = new DebuggerHelper(this, this.player.sprite, this.map);
//     }

//     this.input.keyboard.once("keyup-R", this.restartScene, this);
//   }

//   update(time, delta) {
//     this.player.update();
//   }

//   restartScene() {
//     this.cleanUp();
//     this.scene.restart();
//   }

//   cleanUp() {
//     this.player.destroy();

//     if (this.game.config.physics.arcade.debug) {
//       this.debugger.cleanUp();
//       delete this.debugger;
//     }
//   }
// }

// export default Play;
