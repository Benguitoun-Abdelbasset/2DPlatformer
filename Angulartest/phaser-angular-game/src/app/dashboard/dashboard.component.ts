import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { CommonModule } from '@angular/common';
import { GameComponent } from '../game/game.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, GameComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  errorMessage: string | null = null;
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchUserData();
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
}