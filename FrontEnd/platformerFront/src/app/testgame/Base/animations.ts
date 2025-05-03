import Phaser from 'phaser';

interface FrameConfig {
  start: number;
  end: number;
}

interface AnimationConfig {
  animationName: string;
  generateFrames?: boolean;
  framesConfig?: FrameConfig;
  frames?: { frame: number }[];
  frameRate?: number;
  repeat?: number;
  delay?: number;
  repeatDelay?: number;
}

interface AnimationsOptions {
  scene: Phaser.Scene;
  name: string;
  config: AnimationConfig[];
  texture: string;
}

export class Animations {
  private scene: Phaser.Scene;
  private name: string;
  private texture: string;
  public sprite!: Phaser.GameObjects.Sprite;

  constructor({ scene, name, config, texture }: AnimationsOptions) {
    this.scene = scene;
    this.name = name;
    this.texture = texture;
    this.createAnimations(config);
  }

  public sequence(name: string): Promise<string> {
    return new Promise((resolve) => {
      this.sprite.anims.play(name, true);
      this.sprite.on(
        'animationcomplete',
        () => {
          resolve(name);
        },
        this.sprite
      );
    });
  }

  private createAnimations(config: AnimationConfig[]) {
    if (this.scene.anims.exists(this.name + 'idle')) {
      return;
    }

    config.forEach((cfg) => this.createAnimation(cfg));
  }

  private createAnimation(config: AnimationConfig) {
    if (config.generateFrames && config.framesConfig) {
      this.scene.anims.create({
        key: this.name + config.animationName,
        frames: this.scene.anims.generateFrameNumbers(this.texture, config.framesConfig),
        frameRate: config.frameRate ?? 24,
        repeat: config.repeat ?? 0,
        delay: config.delay ?? 0,
        repeatDelay: config.repeatDelay ?? 0
      });
    } else if (config.frames) {
      const frames = config.frames.map((x) => ({ key: this.texture, frame: x.frame }));
      this.scene.anims.create({
        key: this.name + config.animationName,
        frames,
        frameRate: config.frameRate ?? 24
      });
    }
  }
}
