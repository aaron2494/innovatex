import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { planGuard } from './guards/plan.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
  },
    {
  path: 'pago-exitoso',
  loadComponent: () =>
    import('./components/pago-exitoso/pago-exitoso.component').then(m => m.PagoExitosoComponent)
},
{
  path: 'planes/basico',
  canActivate: [planGuard],
  loadComponent: () => import('./components/suscripciones/basico/basico.component').then(m => m.BasicoComponent)
},
{
  path: 'planes/profesional',
  canActivate: [planGuard],
  loadComponent: () => import('./components/suscripciones/profesional/profesional.component').then(m => m.ProfesionalComponent)
},
{
  path: 'planes/premiun',
  canActivate: [planGuard],
  loadComponent: () => import('./components/suscripciones/premiun/premiun.component').then(m => m.PremiunComponent)
}

];
