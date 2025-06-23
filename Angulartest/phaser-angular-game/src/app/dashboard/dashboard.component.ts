import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { CommonModule } from '@angular/common';
import { GameComponent } from '../game/game.component';
import { FastApiService } from '../services/fast-api.service';
import { Observable } from 'rxjs';
import { ManagerComponent } from '../manager/manager.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ManagerComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  inputlevel: any;
  userLevels:any;
  levels: any;
  scores: any;
  user: User | null = null;
  errorMessage: string | null = null;
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private router: Router, private fastApiService: FastApiService) { }

  ngOnInit(): void {
    this.fetchUserData();
    //this.genLevel();
    this.getScores();
  }

  fetchUserData(): void {

    const username = localStorage.getItem('username');
    console.log(username)

    this.http.get<User>(`${this.apiUrl}/game/user/${username}`, { withCredentials: true }).subscribe({
      next: (user) => this.user = user,
      error: () => {
        this.errorMessage = 'Failed to load user data. Please log in again.';
        this.router.navigate(['/login']);
      }
    });
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }

  genLevel() {
    const testData = { message: 'Alice', difficulty: '2' };
    let response = {};
    this.fastApiService.genLevel(testData).subscribe({
      next: (res) => {
        this.inputlevel = res;
        console.log(this.inputlevel);
      },
      error: (err) => console.error(err)
    });
  }



  getScores() {
    const username = localStorage.getItem('username');
    let response = {};
    this.fastApiService.getScores(username!).subscribe({
      next: (res) => {
        this.scores = res;
        this.getUserLevels();
      },
      error: (err) => console.error(err)
    });
  }

  getUserLevels() {

    const username = localStorage.getItem('username');
    let response = {};
    this.fastApiService.getLevels(username!).subscribe({
      next: (res) => {
        this.userLevels = res;
        console.log(this.userLevels);
      },
      error: (err) => console.error(err)
    });
  }

}