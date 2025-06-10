// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // Assuming you have app.config.ts
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));