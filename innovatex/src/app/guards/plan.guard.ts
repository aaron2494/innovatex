import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PlanService } from '../servicios/PlanService';



export const planGuard: CanActivateFn = (route, state) => {
 const planService = inject(PlanService);
  const router = inject(Router);
  const expectedPlan = route.routeConfig?.path?.split('/')[1]; // 'planes/basico' → 'basico'

  return new Promise<boolean>((resolve) => {
    planService.planActivo$.subscribe((plan) => {
      const userPlan = plan?.toLowerCase();
      const expected = route.routeConfig?.path?.split('/')[1]; // e.g., 'basico'

      if (userPlan === expected) {
        resolve(true);
      } else {
        router.navigate(['/']); // Redirige al home o donde prefieras
        resolve(false);
      }
    });
  });
};  