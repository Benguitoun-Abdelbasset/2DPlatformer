import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { GameComponent } from './game/game.component';

export const routes: Routes = [
    {path: '', component: LandingComponent},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    { path: 'game', component: GameComponent },
    { path: '**', redirectTo: '' }
];
