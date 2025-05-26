import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../enviroments/enviroments';
import { provideFirestore, getFirestore } from '@angular/fire/firestore'; // Importación añadida

export const appConfig: ApplicationConfig = {
  providers: [provideAnimations(),provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),provideHttpClient(),provideCharts(withDefaultRegisterables()),   provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()) ,provideFirestore(() => getFirestore()) ]
};
 