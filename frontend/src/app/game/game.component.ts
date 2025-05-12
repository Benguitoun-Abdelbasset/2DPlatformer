import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Phaser from 'phaser';
import { MainScene } from './scenes/main.scene';

@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './game.component.html',
})
export class GameComponent implements OnInit {
  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef;

  phaserGame!: Phaser.Game;

  ngOnInit() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: this.gameContainer.nativeElement, 
      scene: [MainScene],
    };

    this.phaserGame = new Phaser.Game(config);
  }
}
