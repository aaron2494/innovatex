import { Routes } from '@angular/router';

export const routes: Routes = [
    {
  path: 'pago-exitoso',
  loadComponent: () =>
    import('./components/pago-exitoso/pago-exitoso.component').then(m => m.PagoExitosoComponent)
},

];
