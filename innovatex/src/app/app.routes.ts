import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { planGuard } from './guards/plan.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
  },
  {
    path: 'error',
    component: LayoutComponent
  },
 {
    path: 'plan-basico',
    canActivate: [planGuard],
    loadComponent: () =>
      import('./components/suscripciones/basico/basico.component').then(m => m.BasicoComponent),
  },
  {
    path: 'plan-profesional',
    canActivate: [planGuard],
    loadComponent: () =>
      import('./components/suscripciones/profesional/profesional.component').then(m => m.ProfesionalComponent),
  },
  {
    path: 'plan-premiun',
    canActivate: [planGuard],
    loadComponent: () =>
      import('./components/suscripciones/premiun/premiun.component').then(m => m.PremiunComponent),
  }

];
