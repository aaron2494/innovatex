import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PlanService } from '../../servicios/PlanService';
import { AuthService } from '../../servicios/AuthServices';

@Component({
  selector: 'app-pago-exitoso',
  standalone: true,
  template: `<div class="d-flex justify-content-center align-items-center vh-100">
    <h2>¡Gracias por tu compra!</h2>
    <p>Procesando pago... Redirigiendo a tu plan.</p>
  </div>`,
})
export class PagoExitosoComponent implements OnInit {
  procesando = true;
  error = false;
  constructor(private route: ActivatedRoute, private router: Router,private http : HttpClient,private planService: PlanService, private authService: AuthService,) {}

 ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const reference = params['external_reference'];

      if (!reference) {
        this.router.navigate(['/']);
        return;
      }

      const [email, plan] = reference.split('::');
      this.registrarPlan(email, plan);
    });
  }

  private registrarPlan(email: string, plan: string): void {
    this.http.post('https://backend-mp-sage.vercel.app/api/registrar-plan', { email, plan })
      .subscribe({
        next: () => {
          // Actualizar el estado del plan inmediatamente
          this.planService.actualizarPlan(plan.toLowerCase());
          
          // Redirigir según autenticación
          if (this.authService.estaAutenticado()) {
            this.router.navigate([`/planes/${plan.toLowerCase()}`]);
          } else {
            this.router.navigate(['/auth'], {
              queryParams: { 
                redirect: `/planes/${plan.toLowerCase()}`,
                plan: plan.toLowerCase()
              }
            });
          }
        },
        error: (err) => {
          console.error('Error:', err);
          this.procesando = false;
          this.error = true;
          setTimeout(() => this.router.navigate(['/']), 3000);
        }
      });
  }
}