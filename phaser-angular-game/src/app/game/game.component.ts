import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import Phaser from 'phaser';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

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
  standalone: true,
  imports: [],
  template: `<div id="phaser-game"></div>`,
  styles: [`
    #phaser-game {
      width: 1000px;
      height: 600px;
      margin: 0 auto;
    }
  `]
})
export class GameComponent implements AfterViewInit {
  private game!: Phaser.Game;
  @Input() inputlevel = {
    platforms: [
      { x: 8, y: 5, length: 3 },
      { x: 16, y: 9, length: 2 },
      { x: 25, y: 7, length: 4 },
      { x: 34, y: 11, length: 3 }
    ],
    holes: [
      { x: 12, y: 1, length: 2 },
      { x: 22, y: 1, length: 3 },
      { x: 45, y: 1, length: 2 }
    ],
    key: { x: 10, y: 9 },
    enemies: [
      { x: 8, y: 5 }, // Adjusted to be on a platform
      { x: 25, y: 7 }, // Adjusted to be on a platform
      { x: 34, y: 11 } // Adjusted to be on a platform
    ],
    exitDoor: { x: 48, y: 3 },
    difficulty: 3
  };
  @Output() levelFinished = new EventEmitter<{ score: number; status: string }>();

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1000,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 900 },
          debug: false
        }
      },
      parent: 'phaser-game',
      scene: new GameScene(this.http, this.inputlevel, this.levelFinished)
    };

    this.game = new Phaser.Game(config);
  }
}

class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private enemies!: Phaser.Physics.Arcade.Group;
  private key!: Phaser.Physics.Arcade.Sprite;
  private door!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private gameText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private replayButton!: Phaser.GameObjects.Sprite;
  private replayText!: Phaser.GameObjects.Text;
  private gameOver: boolean = false;
  private hasKey: boolean = false;
  private startTime!: number;
  private holeXValues: number[] = [];
  private platformXValues: Set<number> = new Set();

  constructor(
    private http: HttpClient,
    private inputlevel: any,
    private levelFinished: EventEmitter<{ score: number; status: string }>
  ) {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('sky', 'assets/sky.jpg');
    this.load.image('ground', 'assets/grass.png');
    this.load.image('platform', 'assets/platform.png');
    this.load.image('key', 'assets/key.png');
    this.load.image('door', 'assets/door.png');
    this.load.image('replay', 'assets/replay.png');
    this.load.spritesheet('dude', 'https://labs.phaser.io/assets/sprites/dude.png', {
      frameWidth: 32,
      frameHeight: 48
    });
    this.load.spritesheet('enemy', 'assets/enemy.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  async create() {
    this.startTime = this.time.now;
    const level = this.inputlevel;
    this.holeXValues = level.holes.flatMap((hole: Hole) =>
      Array.from({ length: hole.length }, (_, i) => hole.x + i)
    );

    this.physics.world.setBounds(0, 0, 50 * 32, 15 * 32);
    this.add.image(400, 300, 'sky').setScrollFactor(0);

    this.platforms = this.physics.add.staticGroup();
    for (let x = 0; x < 50; x++) {
      if (!this.holeXValues.includes(x)) {
        this.platforms.create(x * 32 + 16, 15 * 32 - 16, 'ground').setDisplaySize(32, 32).refreshBody();
        this.platforms.create(x * 32 + 16, 16 * 32 - 16, 'ground').setDisplaySize(32, 32).refreshBody();
        this.platforms.create(x * 32 + 16, 17 * 32 - 16, 'ground').setDisplaySize(32, 32).refreshBody();
        this.platformXValues.add(x);
      }
    }

    level.platforms.forEach((platform: Platform) => {
      for (let i = 0; i < platform.length; i++) {
        const tileX = (platform.x + i) * 32 + 16;
        const tileY = (15 - platform.y) * 32 + 16;
        this.platforms.create(tileX, tileY, 'platform').setDisplaySize(32, 32).refreshBody();
        this.platformXValues.add(platform.x + i);
      }
    });

    this.player = this.physics.add.sprite(100, 400, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.cameras.main.setBounds(0, 0, 50 * 32, 15 * 32);
    this.cameras.main.startFollow(this.player);

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

    this.enemies = this.physics.add.group();
    const enemyPositions = level.enemies.map((enemy: Enemy) => ({
      x: enemy.x * 32 + 16,
      y: (15 - enemy.y) * 32 + 16
    }));

    enemyPositions.forEach((pos: Pos, index: number) => {
      if (!this.platformXValues.has(Math.floor(pos.x / 32))) {
        console.warn(`Enemy ${index} at x=${pos.x} is not on a platform or ground. Adjusting position.`);
        pos.x = (level.platforms[0].x * 32 + 16); // Move to first platform
      }
      const enemy = this.enemies.create(pos.x, pos.y, 'enemy');
      enemy.setBounce(0);
      enemy.setCollideWorldBounds(true);
      enemy.setVelocityX(50 * (index % 2 === 0 ? 1 : -1));
      (enemy as any).direction = enemy.body.velocity.x > 0 ? 1 : -1;
      (enemy as any).originalX = pos.x;
      (enemy as any).moveDistance = 100;
    });

    const keyX = level.key.x * 32 + 16;
    const keyY = (15 - level.key.y) * 32 + 16;
    const doorX = level.exitDoor.x * 32 + 16;
    const doorY = (15 - level.exitDoor.y) * 32 + 16;

    this.key = this.physics.add.sprite(keyX, keyY, 'key').setScale(0.1);
    this.key.setBounce(0.2);
    this.key.setCollideWorldBounds(true);

    this.door = this.physics.add.sprite(doorX, doorY, 'door').setScale(0.35);
    this.door.setBounce(0);
    this.door.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.key, this.platforms);
    this.physics.add.collider(this.door, this.platforms);

    this.physics.add.overlap(this.player, this.key, this.collectKey, undefined, this);
    this.physics.add.overlap(this.player, this.door, this.reachDoor, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, undefined, this);

    this.cursors = this.input.keyboard!.createCursorKeys();

    this.gameText = this.add.text(16, 16, 'Find the key and reach the door!', {
      fontSize: '18px',
      color: '#fff'
    }).setScrollFactor(0);

    this.scoreText = this.add.text(16, 40, 'Score: 10000', {
      fontSize: '18px',
      color: '#fff'
    }).setScrollFactor(0);

    this.replayButton = this.add.sprite(500, 300, 'replay').setScale(0.5).setVisible(false).setInteractive().setScrollFactor(0);
    this.replayText = this.add.text(500, 300, '', {
      fontSize: '24px',
      color: '#fff'
    }).setOrigin(0.5).setVisible(false);

    this.replayButton.on('pointerdown', () => {
      this.gameOver = false;
      this.hasKey = false;
      this.scene.restart();
    });

    const tileSize = 32;
    const widthInTiles = 50;
    const heightInTiles = 15;
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.3);
    for (let x = 0; x <= widthInTiles; x++) {
      graphics.moveTo(x * tileSize, 0);
      graphics.lineTo(x * tileSize, heightInTiles * tileSize);
    }
    for (let y = 0; y <= heightInTiles; y++) {
      graphics.moveTo(0, y * tileSize);
      graphics.lineTo(widthInTiles * tileSize, y * tileSize);
    }
  }

  override update(time: number, delta: number) {
    try {
      if (this.gameOver) return;

      this.checkFallInHole();

      const elapsedTime = (this.time.now - this.startTime) / 1000;
      const score = Math.max(0, 10000 - Math.floor(elapsedTime * 100));
      this.scoreText.setText(`Score: ${score}`);

      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);
        this.player.anims.play('left', true);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
        this.player.anims.play('right', true);
      } else {
        this.player.setVelocityX(0);
        this.player.anims.play('turn');
      }

      if (this.cursors.up.isDown && this.player.body!.touching.down) {
        this.player.setVelocityY(-500);
      }

      this.enemies.children.iterate((enemy: any) => {
        if (!enemy) return null;
        const tileX = Math.floor(enemy.x / 32);
        const nextTileX = Math.floor((enemy.x + enemy.body.velocity.x * (delta / 1000)) / 32);
        const isOnPlatform = this.platformXValues.has(tileX);
        if (!isOnPlatform) {
          enemy.setVelocityX(-enemy.body.velocity.x);
          enemy.direction *= -1;
          return null;
        }
        if (enemy.body.velocity.x > 0 && enemy.x > enemy.originalX + enemy.moveDistance) {
          enemy.setVelocityX(-50);
          enemy.direction = -1;
        } else if (enemy.body.velocity.x < 0 && enemy.x < enemy.originalX - enemy.moveDistance) {
          enemy.setVelocityX(50);
          enemy.direction = 1;
        } else if (this.holeXValues.includes(nextTileX) || !this.platformXValues.has(nextTileX)) {
          enemy.setVelocityX(-enemy.body.velocity.x);
          enemy.direction *= -1;
        }
        return null;
      });
    } catch (error) {
      console.error('Error in update', error);
    }
  }

  private collectKey(player: any, key: any) {
    key.disableBody(true, true);
    this.hasKey = true;
    this.gameText.setText('You got the key! Now reach the door!');
  }

  private reachDoor(player: any, door: any) {
    if (this.hasKey) {
      this.gameOver = true;
      player.setVelocity(0, 0);
      this.gameText.setText('You won! Congratulations!');
      this.add.text(1200, 300, 'You Win!', {
        fontSize: '48px',
        color: '#ffffff'
      }).setOrigin(0.5);

      const endTime = this.time.now;
      const timeTaken = (endTime - this.startTime) / 1000;
      const score = Math.max(0, 10000 - Math.floor(timeTaken * 100));
      this.levelFinished.emit({ score, status: 'win' });
    } else {
      this.gameText.setText('You need the key to open the door!');
    }
  }

  private hitEnemy(player: any, enemy: any) {
    if (player.body!.touching.down && enemy.body!.touching.up) {
      enemy.disableBody(true, true);
      player.setVelocityY(-200);
      this.gameText.setText('Enemy defeated!');
    } else {
      this.physics.pause();
      player.setTint(0xff0000);
      player.anims.play('turn');
      this.gameOver = true;
      this.gameText.setText('Game Over! Press Replay to restart');
      this.replayButton.setVisible(true);
      this.replayText.setVisible(true);
    }
  }

  private checkFallInHole() {
    const holeYLimit = 14 * 32;
    if (this.player.y > holeYLimit) {
      this.physics.pause();
      this.player.setTint(0xff0000);
      this.player.anims.play('turn');
      this.gameOver = true;
      this.gameText.setText('You fell in a hole! Press Replay to restart');
      this.replayButton.setVisible(true);
      this.replayText.setVisible(true);
    }
  }

  private getMockLevel() {
    return {
      platforms: [
        { x: 8, y: 5, length: 3 },
        { x: 16, y: 9, length: 2 },
        { x: 25, y: 7, length: 4 },
        { x: 34, y: 11, length: 3 }
      ],
      holes: [
        { x: 12, y: 1, length: 2 },
        { x: 22, y: 1, length: 3 },
        { x: 45, y: 1, length: 2 }
      ],
      key: { x: 18, y: 9 },
      enemies: [
        { x: 8, y: 5 },
        { x: 25, y: 7 },
        { x: 34, y: 11 }
      ],
      exitDoor: { x: 48, y: 3 },
      difficulty: 3
    };
  }
}