// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 900 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Game variables
let player;
let platforms;
let enemies;
let key;
let door;
let cursors;
let gameOver = false;
let hasKey = false;
let gameText;

// Initialize game
const game = new Phaser.Game(config);

function preload() {
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

async function create() {






    const level = await callGPT();
    console.log(JSON.stringify(level));


    //const  level = JSON.parse(`{"platforms":[{"x":8,"y":5,"length":3},{"x":16,"y":9,"length":2},{"x":25,"y":7,"length":4},{"x":34,"y":11,"length":3}],"holes":[{"x":12,"y":1,"length":2},{"x":22,"y":1,"length":3},{"x":45,"y":1,"length":2}],"key":{"x":18,"y":9},"enemies":[{"x":10,"y":3},{"x":27,"y":7},{"x":40,"y":4}],"exitDoor":{"x":48,"y":3},"difficulty":3}`)
    const holes = level["holes"];

    const holeXValues = holes.flatMap(hole =>
        Array.from({ length: hole.length }, (_, i) => hole.x + i)
    );



    console.log(holeXValues);


    // Set world bounds (15 height x 50 width in game units)
    this.physics.world.setBounds(0, 0, 50 * 32, 15 * 32);

    // Add background
    this.add.image(400, 300, 'sky').setScrollFactor(0);

    // Create platforms group
    platforms = this.physics.add.staticGroup();

    // Create ground (bottom row)
    for (let x = 0; x < 50; x++) {

        if (!holeXValues.includes(x)) { // Gap in the ground
            platforms.create(x * 32 + 16, 15 * 32 - 16, 'ground').setDisplaySize(32, 32).refreshBody();
            platforms.create(x * 32 + 16, 16 * 32 - 16, 'ground').setDisplaySize(32, 32).refreshBody();
            platforms.create(x * 32 + 16, 17 * 32 - 16, 'ground').setDisplaySize(32, 32).refreshBody();
        }
    }
    // Create some platforms
    level.platforms.forEach(platform => {
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
    player = this.physics.add.sprite(100, 400, 'dude');
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
    enemies = this.physics.add.group();

    // Add some enemies
    const enemyPositions = level.enemies.map(enemy => ({
        x: enemy.x * 32 + 16,  // tile to pixel X (centered)
        y: enemy.y * 32 + 16   // tile to pixel Y (centered)
    }));

    enemyPositions.forEach(pos => {
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
    key = this.physics.add.sprite(keyX, keyY, 'key');
    key.setBounce(0.2);
    key.setCollideWorldBounds(true);
    key.setScale(0.1)

    // Create the exit door
    door = this.physics.add.sprite(doorX, doorY, 'door');
    door.setBounce(0);
    door.setCollideWorldBounds(true);
    door.setScale(0.35)

    // Set up collisions
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemies, platforms);
    this.physics.add.collider(key, platforms);
    this.physics.add.collider(door, platforms);

    // Check overlaps
    this.physics.add.overlap(player, key, collectKey, null, this);
    this.physics.add.overlap(player, door, reachDoor, null, this);
    this.physics.add.overlap(player, enemies, hitEnemy, null, this);

    // Set up controls
    cursors = this.input.keyboard.createCursorKeys();

    // Add game text
    gameText = this.add.text(16, 16, 'Find the key and reach the door!', {
        fontSize: '18px',
        fill: '#fff'
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

function update() {

    try {
        if (gameOver) {
            return;
        }

        checkFallInHole.call(this, player, enemies);

        // Player controls
        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);
            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-500);
        }

        // Enemy AI - move back and forth
        enemies.children.iterate(function (enemy) {
            if (!enemy) return;

            // Change direction at platform edges or after moving a certain distance
            if (enemy.body.velocity.x > 0 && enemy.x > enemy.originalX + enemy.moveDistance) {
                enemy.setVelocityX(-50);
            } else if (enemy.body.velocity.x < 0 && enemy.x < enemy.originalX - enemy.moveDistance) {
                enemy.setVelocityX(50);
            }

            // If stuck, change direction
            if (enemy.body.velocity.x === 0) {
                enemy.setVelocityX(enemy.direction * -50);
                enemy.direction *= -1;
            }
        });
    }
    catch (error) {
        console.error('Error in update', error);

    }
}

function collectKey(player, key) {
    key.disableBody(true, true);
    hasKey = true;
    gameText.setText('You got the key! Now reach the door!');
}

function reachDoor(player, door) {
    if (hasKey) {
        gameOver = true;
        player.setVelocity(0, 0);
        gameText.setText('You won! Congratulations!');
        this.add.text(1200, 300, 'You Win!', {
        fontSize: '48px',
        fill: '#ffffff'
    }).setOrigin(0.5);
    } else {
        gameText.setText('You need the key to open the door!');
    }
}

function hitEnemy(player, enemy) {
    // Check if player is jumping on enemy from above
    if (player.body.touching.down && enemy.body.touching.up) {
        enemy.disableBody(true, true);
        player.setVelocityY(-200);
        gameText.setText('Enemy defeated!');
    } else {
        // Game over if player gets hit from the side
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        gameOver = true;
        gameText.setText('Game Over! Click to restart');

        // Allow restarting the game
        this.input.on('pointerdown', () => {
            gameOver = false;
            hasKey = false;
            this.scene.restart();
        });
    }
}


function checkFallInHole(player, enemiesGroup) {
    // Convert tile limit to pixel limit (assuming tile size 32)
    const holeYLimit = 14 * 32;

    // Check if player fell in the hole
    if (player.y > holeYLimit) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        gameOver = true;
        gameText.setText('You fell in a hole! Game Over! Click to restart');

        this.input.once('pointerdown', () => {
            gameOver = false;
            hasKey = false;
            this.scene.restart();
        });
    }

    // Check if any enemy fell in the hole and disable them
    enemiesGroup.children.iterate(enemy => {
        if (enemy.y > holeYLimit) {
            enemy.disableBody(true, true);
            // Optional: you can add score or feedback here
        }
    });
}


async function callGPT() {
    const prompt = `Generate a JSON object representing a level for a 2D platformer game with these properties:

- Level size: 50 tiles wide, 15 tiles high.
- Bottom 3 tiles (y=1 to y=3) are ground.
- Holes only in ground, up to 4 tiles wide, avoid holes near player start (x=0 to x=4).
- Platforms between y=4 and y=12, not overlapping ground, reachable by player (max 4 tiles jump height and distance).
- Platforms spread across level; some clustering allowed for challenge.
- Between 2 and 6 platforms.
- Between 0 and 3 holes.
- Player starts at x=0, so no holes or enemies near there.
- Place a 'key', 'exitDoor', and up to 4 'enemies' on ground or platforms, not floating.
- Enemies spaced out.
- Exit door near right edge (x > 40).
- Difficulty: integer 1 (easy) to 5 (hard).
- for the platforms you seem to be making them too long
VERY IMPORTANT: Imagine the player jumping through the platforms.

Each generated level should be unique, creative, and varied in layout, avoiding repetitive patterns.

Return only the JSON object without explanation or extra text.

Example format:

{
  "platforms": [
    { "x": 6, "y": 6, "length": 5 },
    { "x": 20, "y": 8, "length": 4 },
    { "x": 35, "y": 7, "length": 3 }
  ],
  "holes": [
    { "x": 15, "y": 0, "length": 3 }
  ],
  "key": { "x": 36, "y": 8 },
  "enemies": [
    { "x": 10, "y": 3 },
    { "x": 25, "y": 9 }
  ],
  "exitDoor": { "x": 47, "y": 3 },
  "difficulty": 3
}
`

    // Your API info
    const api_key = '64e6c1d9457626a89e2d1eeea04ff27f';
    const default_model = 'gpt-3.5-turbo';
    const model = default_model;

    // URL encode the parameters
    const encodedPrompt = encodeURIComponent(prompt);
    const encodedApiKey = encodeURIComponent(api_key);
    const encodedModel = encodeURIComponent(model);

    // Build full API URL
    const temperature = 0.85;
    const api_url = `http://195.179.229.119/gpt/api.php?prompt=${encodedPrompt}&api_key=${encodedApiKey}&model=${encodedModel}&temperature=${temperature}`;


    try {
        const response = await fetch(api_url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        level = JSON.parse(data.content)

        return level;

    } catch (error) {
        console.error('Failed to fetch level data:', error);
    }




}

