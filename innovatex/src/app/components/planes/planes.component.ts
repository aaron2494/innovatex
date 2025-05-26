import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../servicios/AuthServices';
import { PaymentService } from '../../servicios/paymentService'; // Asegúrate de tenerlo
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-planes',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor, HttpClientModule],
  templateUrl: './planes.component.html',
  styleUrl: './planes.component.scss',
})
export class PlanesComponent {
  planes = [
    {
      nombre: 'basico',
      descripcion:
        'Ideal para pequeñas y medianas empresas que estén en busca de optimizar sus procesos de manera más eficiente. Incluye herramientas esenciales para el manejo de tu negocio, con soporte técnico básico pero eficiente.',
      precio: 1,
    },
    {
      nombre: 'profesional',
      descripcion:
        'Solución avanzada para empresas que necesitan herramientas más potentes para crecer. Incluye funciones premium y soporte técnico prioritario.',
      precio: 2,
    },
    {
      nombre: 'premium',
      descripcion:
        'Automatización total para empresas grandes. Funcionalidades avanzadas de análisis, seguridad, gestión y soporte personalizado 24/7.',
      precio: 3,
    },
  ];

  constructor(
    public auth: AuthService,
    private paymentService: PaymentService
  ) {}

  showLoginAlert() {
    Swal.fire({
      title: '¡Inicia sesión!',
      text: 'Debes iniciar sesión para adquirir un plan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Iniciar sesión',
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.loginWithGoogle();
      }
    });
  }

  buy(plan: any) {
    if (!this.auth.userLoggedIn) {
      this.showLoginAlert();
      return;
    }

    const userEmail = this.auth.getCurrentUser()?.email;
    if (!userEmail) {
      Swal.fire('Error', 'No se encontró el correo del usuario.', 'error');
      return;
    }

    this.paymentService.createPreference(plan.nombre, userEmail).subscribe({
      next: (res) => {
        if (res.init_point) {
          window.location.href = res.init_point;
        } else {
          Swal.fire('Error', 'No se recibió el link de pago.', 'error');
        }
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo iniciar el pago.', 'error');
      },
    });
  }
}
