import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Phaser from 'phaser';
import {Boot} from './scenes/Boot';
//import {Play} from './scenes/Play';

@Component({
  selector: 'app-testgame',
  imports: [],
  templateUrl: './testgame.component.html',
  styleUrl: './testgame.component.scss'
})
export class TestgameComponent implements AfterViewInit{




  async ngAfterViewInit(): Promise<void> {
    if (typeof window !== 'undefined') {
      const Phaser = await import('phaser');

 // Custom Phaser scene class
 class TestGameScene extends Phaser.Scene {
  private platforms!: Phaser.Physics.Arcade.StaticGroup;  // Declare platforms here


  constructor() {
    super('TestGameScene');  // Name the scene
  }

  preload() {
    this.load.image('sky', 'assets/sky.jpg');
    this.load.image('ground', 'assets/platform.png');
  }

  create() {
    this.add.image(400, 300, 'sky');
    
    // Initialize platforms group
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, 'ground').setScale(0.5).refreshBody();  // Create a platform
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');
  }
}

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
          default: 'arcade',
          arcade: {
              gravity: { x:0, y: 300 },
              debug: false
          }},
        parent: 'game-container',
        scene: TestGameScene  
        
      };

      new Phaser.Game(config);
    }
  }
}
