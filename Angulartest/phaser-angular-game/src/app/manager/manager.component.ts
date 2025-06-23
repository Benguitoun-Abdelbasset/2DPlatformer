import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from '../game/game.component';
import { FastApiService } from '../services/fast-api.service';
@Component({
  selector: 'app-manager',
  imports: [CommonModule, GameComponent],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ManagerComponent {
  constructor(private fastApiService: FastApiService) { }


  @Input() scores: any[] = [];
  @Input() userLevels: any[] = [];


  @Output() levelSelected = new EventEmitter<any>();


  currentLevelIndex: number | null = null;
  inputlevel: any;
  isLoading = false;
  selectedDifficulty: number = 3;
  bestScore = 0;
  ngOnInit(): void {

    this.userLevels = this.userLevels.map((level, index) => {
      const levelScores = this.scores.filter(score => score.levelId === level.id);

      const bestScore = levelScores.reduce(
        (max, s) => (s.score > max.score ? s : max),
        { score: -Infinity }
      );

      return {
        ...level,
        displayId: (index + 1).toString().padStart(3, '0'), // e.g. "001", "002", "003"
        bestScore: bestScore.score === -Infinity ? null : bestScore.score,
        attempts: levelScores.length
      };
    });


    console.log("after bestscore" + JSON.stringify(this.userLevels));
  }

  loadLevel(userLevel: any) {
    // this.levelSelected.emit(score);

    this.isLoading = true;

    // Simulate loading time or perform actual async logic
    setTimeout(() => {
      // navigate or load the game
      console.log("Level loaded:", userLevel);
      this.isLoading = false;
    }, 1500);
    this.inputlevel = userLevel.leveldata;
  }

  generateLevel() {
    console.log('Generating level with difficulty:', this.selectedDifficulty);

    const testData = { message: 'Alice', difficulty: this.selectedDifficulty };
    let response = {};
    this.fastApiService.genLevel(testData).subscribe({
      next: (res) => {
        this.inputlevel = res.leveldata;
        console.log(this.inputlevel);
      },
      error: (err) => console.error(err)
    });
    this.isLoading = true;

    // Simulate async operation (e.g. API call)
    setTimeout(() => {
      // your real logic to generate the level here
      this.isLoading = false;
    }, 2000);

  }

  onSliderChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedDifficulty = Number(input.value);
  }

  onChildFinished(event: { score: number, status: string }) {
    this.inputlevel = null;

    // handle result (e.g. save score, switch view)
  }

  loadNextLevel() {


    this.generateLevel();
  }
}
