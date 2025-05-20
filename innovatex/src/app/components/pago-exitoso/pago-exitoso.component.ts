import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pago-exitoso',
  standalone: true,
  template: `<div class="d-flex justify-content-center align-items-center vh-100">
    <h2>¡Gracias por tu compra!</h2>
    <p>Procesando pago... Redirigiendo a tu plan.</p>
  </div>`,
})
export class PagoExitosoComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router,private http : HttpClient) {}

  ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    const reference = params['external_reference'];

    if (reference) {
      const [email, plan] = reference.split('::');

      // Llamar a tu backend para registrar el plan
      this.http.post('https://backend-mp-sage.vercel.app/api/registrar-plan', { email, plan }).subscribe({
        next: () => {
          // Ir al plan correspondiente
          this.router.navigate([`/planes/${plan}`]);
        },
        error: (err) => {
          console.error('Error al registrar el plan:', err);
          this.router.navigate(['/']);
        }
      });
    } else {
      this.router.navigate(['/']);
    }
  });
}
}