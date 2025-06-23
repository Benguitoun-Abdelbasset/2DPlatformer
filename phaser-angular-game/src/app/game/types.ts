import { Component, AfterViewInit } from '@angular/core';
import Phaser from 'phaser';

interface Platform {
  x: number;
  y: number;
  length: number;
}

interface Hole {
  x: number;
  y: number;
  length: number;
}

interface Key {
  x: number;
  y: number;
}

interface Enemy {
  x: number;
  y: number;
}

interface ExitDoor {
  x: number;
  y: number;
}

interface GameData {
  platforms: Platform[];
  holes: Hole[];
  key: Key;
  enemies: Enemy[];
  exitDoor: ExitDoor;
  difficulty: number;
}

interface Pos {
  x: number;
  y: number;
}


@Component({
  selector: 'app-game',
  template: `<div id="phaser-game"></div>`,
  styles: [`
    #phaser-game {
      width: 800px;
      height: 600px;
      margin: 0 auto;
    }
  `]
})


export class GameComponent implements AfterViewInit {
  private game!: Phaser.Game;

  

  ngAfterViewInit(): void {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1000,
      height: 600,
      parent: 'phaser-game',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 900 },
          debug: false
        }
      },
      scene: new GameScene()
    };

    this.game = new Phaser.Game(config);
  }
}

class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private enemies!: Phaser.Physics.Arcade.Sprite;
  private key!: Phaser.Physics.Arcade.Sprite;
  private door!: Phaser.Physics.Arcade.Sprite;
  private gameover = false;
  private haskey = false;



  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Load assets
    this.load.image('sky', 'sky.jpg');
    this.load.image('ground', 'grass.png');
    this.load.image('platform', 'platform.png');
    this.load.image('key', 'key.png');
    this.load.image('door', 'door.png');
    this.load.spritesheet('dude',
      'https://labs.phaser.io/assets/sprites/dude.png',
      { frameWidth: 32, frameHeight: 48 }
    );
    this.load.spritesheet('enemy',
      'https://labs.phaser.io/assets/sprites/slime.png',
      { frameWidth: 32, frameHeight: 32 }
    );

  }

  async create() {
    //  const level = await callGPT();


    //const Tlevel = await callRemoteGemini();

    const Tlevel='{"platforms":[{"x":8,"y":8,"length":2},{"x":15,"y":5,"length":3},{"x":25,"y":10,"length":2},{"x":33,"y":7,"length":3}],"holes":[{"x":10,"y":0,"length":2},{"x":40,"y":0,"length":3}],"key":{"x":16,"y":6},"enemies":[{"x":20,"y":3},{"x":30,"y":11},{"x":45,"y":3}],"exitDoor":{"x":46,"y":3},"difficulty":4}'

    let level = JSON.parse(Tlevel);
    console.log(JSON.stringify(level));


    //const  level = JSON.parse(`{"platforms":[{"x":8,"y":5,"length":3},{"x":16,"y":9,"length":2},{"x":25,"y":7,"length":4},{"x":34,"y":11,"length":3}],"holes":[{"x":12,"y":1,"length":2},{"x":22,"y":1,"length":3},{"x":45,"y":1,"length":2}],"key":{"x":18,"y":9},"enemies":[{"x":10,"y":3},{"x":27,"y":7},{"x":40,"y":4}],"exitDoor":{"x":48,"y":3},"difficulty":3}`)
    const holes : Hole[] = level["holes"];

    const holeXValues = holes.flatMap(hole =>
      Array.from({ length: hole.length }, (_, i) => hole.x + i)
    );



    console.log(holeXValues);


    // Set world bounds (15 height x 50 width in game units)
    this.physics.world.setBounds(0, 0, 50 * 32, 15 * 32);

    // Add background
    this.add.image(400, 300, 'sky').setScrollFactor(0);

    // Create platforms group
    let platforms = this.physics.add.staticGroup();

    // Create ground (bottom row)
    for (let x = 0; x < 50; x++) {

      if (!holeXValues.includes(x)) { // Gap in the ground
        platforms.create(x * 32 + 16, 15 * 32 - 16, 'ground').setDisplaySize(32, 32).refreshBody();
        platforms.create(x * 32 + 16, 16 * 32 - 16, 'ground').setDisplaySize(32, 32).refreshBody();
        platforms.create(x * 32 + 16, 17 * 32 - 16, 'ground').setDisplaySize(32, 32).refreshBody();
      }
    }
    // Create some platforms
    level.platforms.forEach((platform :Platform) => {
      for (let i = 0; i < platform.length; i++) {
        // Calculate pixel position of each tile
        const tileX = ((platform.x) + i) * 32 + 16; // +16 centers the tile (if origin is center)
        const tileY = (15 - platform.y) * 32 + 16;


        platforms.create(tileX, tileY, 'platform')
          .setDisplaySize(32, 32)
          .refreshBody();
      }
    });

    // Create the player
    let player = this.physics.add.sprite(100, 400, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // Camera follows the player
    this.cameras.main.setBounds(0, 0, 50 * 32, 15 * 32);
    this.cameras.main.startFollow(player);

    // Player animations
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    // Create enemies
    let enemies = this.physics.add.group();

    // Add some enemies
    const enemyPositions = level.enemies.map((enemy:Enemy) => ({
      x: enemy.x * 32 + 16,  // tile to pixel X (centered)
      y: enemy.y * 32 + 16   // tile to pixel Y (centered)
    }));

    enemyPositions.forEach((pos:Pos) => {
      const enemy = enemies.create(pos.x, pos.y, 'enemy');
      enemy.setBounce(0.2);
      enemy.setCollideWorldBounds(true);
      enemy.setVelocityX(Phaser.Math.Between(-50, 50));

      // Make enemies turn around at platform edges
      enemy.direction = enemy.body.velocity.x > 0 ? 1 : -1;
      enemy.originalX = pos.x;
      enemy.moveDistance = 100;
    });

    const keyX = level.key.x * 32 + 16;
    const keyY = level.key.y * 32 + 16;

    const doorX = level.exitDoor.x * 32 + 16;
    const doorY = level.exitDoor.y * 32 + 16;


    // Create a key to collect
    let key = this.physics.add.sprite(keyX, keyY, 'key');
    key.setBounce(0.2);
    key.setCollideWorldBounds(true);
    key.setScale(0.1)

    // Create the exit door
    let door = this.physics.add.sprite(doorX, doorY, 'door');
    door.setBounce(0);
    door.setCollideWorldBounds(true);
    door.setScale(0.35)

    // Set up collisions
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemies, platforms);
    this.physics.add.collider(key, platforms);
    this.physics.add.collider(door, platforms);

    // Check overlaps
    // this.physics.add.overlap(player, key, collectKey, null, this);
    // this.physics.add.overlap(player, door, reachDoor, null, this);
    // this.physics.add.overlap(player, enemies, hitEnemy, null, this);

    // Set up controls
    let cursors = this.input.keyboard!.createCursorKeys();

    // Add game text
    let gameText = this.add.text(16, 16, 'Find the key and reach the door!', {
      fontSize: '18px'
    }).setScrollFactor(0);

    //// GRID //////

    const tileSize = 32;
    const widthInTiles = 50;
    const heightInTiles = 15;

    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.3); // white lines, 30% opacity

    // Draw vertical grid lines
    for (let x = 0; x <= widthInTiles; x++) {
      graphics.moveTo(x * tileSize, 0);
      graphics.lineTo(x * tileSize, heightInTiles * tileSize);
    }

    // Draw horizontal grid lines
    for (let y = 0; y <= heightInTiles; y++) {
      graphics.moveTo(0, y * tileSize);
      graphics.lineTo(widthInTiles * tileSize, y * tileSize);
    }

    graphics.strokePath();

    ///////////////////////////
  }

  override update(time: number, delta: number) {
    const speed = 200;
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
    }
  }
}


