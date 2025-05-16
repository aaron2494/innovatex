import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pago-exitoso',
  standalone: true,
  template: `<div class="d-flex justify-content-center align-items-center vh-100">
    <h2>¡Gracias por tu compra!</h2>
  </div>`,
})
export class PagoExitosoComponent implements OnInit {
  ngOnInit() {
    Swal.fire({
      icon: 'success',
      title: '¡Pago realizado con éxito!',
      text: 'Gracias por tu compra. Te hemos enviado un correo con los detalles.',
      confirmButtonText: 'Aceptar',
      timer: 6000,
      timerProgressBar: true
    });
  }
}