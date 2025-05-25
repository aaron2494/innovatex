import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanService } from '../../servicios/PlanService';
import { AuthService } from '../../servicios/AuthServices';
import Swal from 'sweetalert2';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-pago-exitoso',
  standalone: true,
  template: `<div class="d-flex justify-content-center align-items-center vh-100">
    @if (loading) {
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <h2 class="mt-3">¡Gracias por tu compra!</h2>
        <p>Verificando estado de pago...</p>
      </div>
    }
    @if (error) {
      <div class="alert alert-danger text-center">
        <h4>Error al procesar tu pago</h4>
        <p>{{errorMessage}}</p>
        <button class="btn btn-primary" (click)="reintentar()">Reintentar</button>
      </div>
    }
  </div>`,
})
export class PagoExitosoComponent implements OnInit {
  loading = true;
  error = false;
  errorMessage = '';
  emailUsuario = '';
  planAdquirido = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private planService: PlanService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.verificarPago();
  }

  async verificarPago(): Promise<void> {
    try {
      // Mostrar loading
      await Swal.fire({
        title: 'Verificando tu pago...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => Swal.showLoading()
      });

      // Obtener parámetros de la URL de forma segura
      const params = this.route.snapshot.queryParams as {
        payment_id?: string;
        preference_id?: string;
        external_reference?: string;
        [key: string]: any;
      };
      
      // Validar parámetros esenciales usando notación segura
      if (!params['external_reference']) {
        throw new Error('No se pudo obtener la información del pago');
      }

      // Decodificar y extraer datos (manejo de caracteres especiales)
      const externalRef = decodeURIComponent(params['external_reference']);
      const parts = externalRef.split('::');
      
      if (parts.length < 3) {
        throw new Error('Formato de referencia externa inválido');
      }

      this.emailUsuario = parts[1];
      this.planAdquirido = parts[2].toLowerCase();

      // Verificar con el backend
      const response = await lastValueFrom(
        this.planService.verificarPlanUsuario(this.emailUsuario)
      );

      if (!response?.planAdquirido) {
        throw new Error('El plan aún no ha sido activado');
      }

      // Actualizar estado local
      this.planService.actualizarPlan(response.planAdquirido);

      // Redirigir según autenticación
      await this.redirigirUsuario(params);

    } catch (error) {
      console.error('Error en verificación de pago:', error);
      this.error = true;
      this.errorMessage = this.obtenerMensajeError(error);
      
      await Swal.fire({
        icon: 'error',
        title: 'Error al verificar',
        text: this.errorMessage,
        confirmButtonText: 'Entendido'
      });

    } finally {
      this.loading = false;
      if (Swal.isVisible()) {
        Swal.close();
      }
    }
  }

  async redirigirUsuario(params: { [key: string]: any }): Promise<void> {
    const isAuthenticated = await this.authService.estaAutenticado();
    const queryParams = {
      pagoExitoso: true,
      payment_id: params['payment_id'] || params['preference_id']
    };

    if (isAuthenticated) {
      this.router.navigate([`/planes/${this.planAdquirido}`], { queryParams });
    } else {
      this.router.navigate(['/auth'], {
        queryParams: {
          ...queryParams,
          redirect: `/planes/${this.planAdquirido}`,
          plan: this.planAdquirido,
          email: this.emailUsuario
        }
      });
    }
  }

  obtenerMensajeError(error: any): string {
    if (error.message.includes('No se pudo obtener')) {
      return 'No se encontraron datos del pago. Por favor verifica tu correo electrónico.';
    }
    if (error.message.includes('no ha sido activado')) {
      return 'El pago fue exitoso pero la activación está demorando más de lo esperado. Por favor verifica en unos minutos.';
    }
    return 'Ocurrió un problema al verificar tu pago. Por favor contacta a soporte técnico.';
  }

  reintentar(): void {
    this.error = false;
    this.loading = true;
    this.verificarPago();
  }
}