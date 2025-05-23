import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanService } from '../../servicios/PlanService';
import { AuthService } from '../../servicios/AuthServices';

@Component({
  selector: 'app-pago-exitoso',
  standalone: true,
  template: `<div class="d-flex justify-content-center align-items-center vh-100">
    @if (procesando) {
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <h2 class="mt-3">¡Gracias por tu compra!</h2>
        <p>Verificando estado de pago...</p>
      </div>
    }
    @if (error) {
      <div class="alert alert-danger">
        Error al procesar tu pago. Serás redirigido a la página principal.
      </div>
    }
  </div>`,
})
export class PagoExitosoComponent implements OnInit {
  procesando = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private planService: PlanService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const paymentId = params['payment_id'] || params['preference_id'];
      const externalReference = params['external_reference'];

      if (!externalReference) {
        this.router.navigate(['/']);
        return;
      }

      // Extraer el plan de la referencia (formato: user::email::plan)
      const parts = externalReference.split('::');
      const plan = parts[2] || 'desconocido';
      
      this.procesarPagoExitoso(plan.toLowerCase());
    });
  }

  private procesarPagoExitoso(plan: string): void {
    // 1. Actualizar el estado local del plan
    this.planService.actualizarPlan(plan);
    
    // 2. Redirigir según autenticación
    if (this.authService.estaAutenticado()) {
      this.router.navigate([`/planes/${plan}`], {
        queryParams: { 
          pagoExitoso: true 
        }
      });
    } else {
      this.router.navigate(['/auth'], {
        queryParams: { 
          redirect: `/planes/${plan}`,
          plan: plan,
          pagoExitoso: true
        }
      });
    }
    
    this.procesando = false;
  }
}