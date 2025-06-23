import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FastApiService } from './services/fast-api.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'

  
})
export class AppComponent {
  title = 'phaser-angular-game';

  response: any;

  constructor(private fastApiService: FastApiService) {}

  send() {
    const testData = { message: 'Alice', difficulty: 42 };
    this.fastApiService.genLevel(testData).subscribe({
      next: (res) => this.response = res,
      error: (err) => console.error(err)
    });
  }
}
