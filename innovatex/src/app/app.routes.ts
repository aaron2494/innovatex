import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';


export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
  },
{
  path: 'plan-basico',
  
  loadComponent: () => import('./components/suscripciones/basico/basico.component').then(m => m.BasicoComponent)
},
{
  path: 'plan-profesional',
 
  loadComponent: () => import('./components/suscripciones/profesional/profesional.component').then(m => m.ProfesionalComponent)
},
{
  path: 'plan-premiun',
  loadComponent: () => import('./components/suscripciones/premiun/premiun.component').then(m => m.PremiunComponent)
}

];
