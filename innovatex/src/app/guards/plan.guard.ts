import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../servicios/AuthServices';
import { map, catchError, of, switchMap } from 'rxjs';

export const planGuard: CanActivateFn = (route, state) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  const auth = inject(AuthService);

  const user = auth.getCurrentUser();
  const email = user?.email;

  if (!email) {
    router.navigate(['/login']);
    return of(false);
  }

  return http.get<{ active: boolean; plan: string | null }>(
    `https://backend-mp-49xu.onrender.com/api/user-plan-status?email=${email}`
  ).pipe(
    map(response => {
      if (response.active) {
        return true;
      } else {
        router.navigate(['/planes']);
        return false;
      }
    }),
    catchError(error => {
      console.error('❌ Error al validar el plan:', error);
      router.navigate(['/error']); // o donde prefieras
      return of(false);
    })
  );
};
