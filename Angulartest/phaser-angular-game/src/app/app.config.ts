// app/app.config.ts (This is the file you'll most likely modify)
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // <--- Import provideHttpClient

import { routes } from './app.routes'; // Your application routes

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient() // <--- Add this line to provide HttpClient
  ]
};