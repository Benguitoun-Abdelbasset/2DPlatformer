import { Component, AfterViewInit } from '@angular/core';
import Phaser from 'phaser';
import { HttpClient} from '@angular/common/http';
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
      scene: new GameScene(this.http)
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
  private gameOver: boolean = false;
  private hasKey: boolean = false;

  constructor(private http: HttpClient) {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('sky', 'assets/sky.jpg');
    this.load.image('ground', 'assets/grass.png');
    this.load.image('platform', 'assets/platform.png');
    this.load.image('key', 'assets/key.png');
    this.load.image('door', 'assets/door.png');
    this.load.spritesheet('dude', 'https://labs.phaser.io/assets/sprites/dude.png', {
      frameWidth: 32,
      frameHeight: 48
    });
    this.load.spritesheet('enemy', 'https://labs.phaser.io/assets/sprites/slime.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  async create() {
    //const level = await this.callRemoteGemini();
    const level=this.getMockLevel();
    console.log(JSON.stringify(level));

    const holes = level.holes;
    const holeXValues = holes.flatMap((hole: Hole) =>
      Array.from({ length: hole.length }, (_, i) => hole.x + i)
    );

    this.physics.world.setBounds(0, 0, 50 * 32, 15 * 32);
    this.add.image(400, 300, 'sky').setScrollFactor(0);

    this.platforms = this.physics.add.staticGroup();
    for (let x = 0; x < 50; x++) {
      if (!holeXValues.includes(x)) {
        this.platforms.create(x * 32 + 16, 15 * 32 - 16, 'ground').setDisplaySize(32, 32).refreshBody();
        this.platforms.create(x * 32 + 16, 16 * 32 - 16, 'ground').setDisplaySize(32, 32).refreshBody();
        this.platforms.create(x * 32 + 16, 17 * 32 - 16, 'ground').setDisplaySize(32, 32).refreshBody();
      }
    }

    level.platforms.forEach((platform: Platform) => {
      for (let i = 0; i < platform.length; i++) {
        const tileX = (platform.x + i) * 32 + 16;
        const tileY = (15 - platform.y) * 32 + 16;
        this.platforms.create(tileX, tileY, 'platform').setDisplaySize(32, 32).refreshBody();
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
      y: enemy.y * 32 + 16
    }));

    enemyPositions.forEach((pos: Pos) => {
      const enemy = this.enemies.create(pos.x, pos.y, 'enemy');
      enemy.setBounce(0.2);
      enemy.setCollideWorldBounds(true);
      enemy.setVelocityX(Phaser.Math.Between(-50, 50));
      (enemy as any).direction = enemy.body.velocity.x > 0 ? 1 : -1;
      (enemy as any).originalX = pos.x;
      (enemy as any).moveDistance = 100;
    });

    const keyX = level.key.x * 32 + 16;
    const keyY = level.key.y * 32 + 16;
    const doorX = level.exitDoor.x * 32 + 16;
    const doorY = level.exitDoor.y * 32 + 16;

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
    graphics.strokePath();
  }

  override update(time: number, delta: number) {
    try {
      if (this.gameOver) return;

      this.checkFallInHole();

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
        if (enemy.body.velocity.x > 0 && enemy.x > enemy.originalX + enemy.moveDistance) {
          enemy.setVelocityX(-50);
        } else if (enemy.body.velocity.x < 0 && enemy.x < enemy.originalX - enemy.moveDistance) {
          enemy.setVelocityX(50);
        }
        if (enemy.body.velocity.x === 0) {
          enemy.setVelocityX(enemy.direction * -50);
          enemy.direction *= -1;
        }
        return null;
      });


    } catch (error) {
      console.error('Error in update', error);
    }
  }


  private collectKey(
    player: any,
     key: any
  ) {
    key.disableBody(true, true);
    this.hasKey = true;
    this.gameText.setText('You got the key! Now reach the door!');

  }

  private reachDoor(player: any, door: any) {
    if (this.hasKey) {
      this.gameOver = true;
      player.setVelocity(0, '');
      this.gameText.setText('You won! Congratulations!');
      this.add.text(1200, 300, 'You Win!', {
        fontSize: '48px',
        color: '#ffffff'
      }).setOrigin(0.5);
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
      this.gameText.setText('Game Over! Click to restart');
      this.input.once('pointerdown', () => {
        this.gameOver = false;
        this.hasKey = false;
        this.scene.restart();
      });
    }
  }

  private checkFallInHole() {
    const holeYLimit = 14 * 32;
    if (this.player.y > holeYLimit) {
      this.physics.pause();
      this.player.setTint(0xff0000);
      this.player.anims.play('turn');
      this.gameOver = true;
      this.gameText.setText('You fell in a hole! Game Over! Click to restart');
      this.input.once('pointerdown', () => {
        this.gameOver = false;
        this.hasKey = false;
        this.scene.restart();
      });
    }
   this.enemies.children.iterate((enemyGameObject: Phaser.GameObjects.GameObject) => {

  if (!(enemyGameObject instanceof Phaser.Physics.Arcade.Sprite) || !enemyGameObject.body) {

    return null;
  }

  const enemy = enemyGameObject as Phaser.Physics.Arcade.Sprite;

  if (enemy.y > holeYLimit) {
    enemy.disableBody(true, true);
  }

  return null;
});
  }


  // private async callRemoteGemini(): Promise<any> {
  //   const response = await lastValueFrom(
  //     this.http.post<{ reply: string }>('http://localhost:5000/api/echo', { message: 'gimme level' })
  //   );
  //   const data = await response.json();
  //   return JSON.parse(data.reply);
  // };

  // private async callGPT(): Promise<any> {
  //   const prompt = `Generate a JSON object representing a level for a 2D platformer game with these properties:

  //   - Level size: 50 tiles wide, 15 tiles high.
  //   - Bottom 3 tiles (y=1 to y=3) are ground.
  //   - Holes only in ground, up to 4 tiles wide, avoid holes near player start (x=0 to x=4).
  //   - Platforms between y=4 and y=12, not overlapping ground, reachable by player (max 4 tiles jump height and distance).
  //   - Platforms spread across level; some clustering allowed for challenge.
  //   - Between 2 and 6 platforms.
  //   - Between 0 and 3 holes.
  //   - Player starts at x=0, so no holes or enemies near there.
  //   - Place a 'key', 'exitDoor', and up to 4 'enemies' on ground or platforms, not floating.
  //   - Enemies spaced out.
  //   - Exit door near right edge (x > 40).
  //   - Difficulty: integer 1 (easy) to 5 (hard).
  //   - for the platforms you seem to be making them too long
  //   VERY IMPORTANT: Imagine the player jumping through the platforms.

  //   Each generated level should be unique, creative, and varied in layout, avoiding repetitive patterns.

  //   Return only the JSON object without explanation or extra text.

  //   Example format:

  //   {
  //     "platforms": [
  //       { "x": 6, "y": 6, "length": 5 },
  //       { "x": 20, "y": 8, "length": 4 },
  //       { "x": 35, "y": 7, "length": 3 }
  //     ],
  //     "holes": [
  //       { "x": 15, "y": 0, "length": 3 }
  //     ],
  //     "key": { "x": 36, "y": 8 },
  //     "enemies": [
  //       { "x": 10, "y": 3 },
  //       { "x": 25, "y": 9 }
  //     ],
  //     "exitDoor": { "x": 47, "y": 3 },
  //     "difficulty": 3
  //   }
  //   `;
  //   try {
  //     const apiKey = '64e6c1d9457626a89e2d1eeea04ff27f';
  //     const model = 'gpt-3.5-turbo';
  //     const temperature = 0.85;
  //     const apiUrl = `http://195.179.229.119/gpt/api.php?prompt=${encodeURIComponent(prompt)}&api_key=${apiKey}&model=${model}&temperature=${temperature}`;
  //     const response = await lastValueFrom(this.http.get<{ content: string }>(apiUrl));
  //     return JSON.parse(response.content);
  //   } catch (error) {
  //     console.error('Failed to fetch level from GPT:', error);
  //     return this.getMockLevel();
  //   }
  // }

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
        { x: 10, y: 3 },
        { x: 27, y: 7 },
        { x: 40, y: 4 }
      ],
      exitDoor: { x: 48, y: 3 },
      difficulty: 3
    };
  }
}