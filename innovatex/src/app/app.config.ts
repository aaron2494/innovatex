import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';


export const appConfig: ApplicationConfig = {
  providers: [provideAnimations(),provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),provideHttpClient(),provideCharts(withDefaultRegisterables())]
};
