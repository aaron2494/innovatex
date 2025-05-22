import { CommonModule, NgFor } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
declare var MercadoPago: any;
import Swal from 'sweetalert2';
import { AuthService } from '../../servicios/AuthServices';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-planes',
  imports: [NgFor,CommonModule,FormsModule],
  templateUrl: './planes.component.html',
  styleUrl: './planes.component.scss',
  standalone:true,
})

export class PlanesComponent  implements AfterViewInit {
  planes = [
  { 
    nombre: 'Básico', 
    descripcion: 'Ideal para pequeñas y medianas empresas que esten en busca de optimizar sus procesos de manera más eficiente. Incluye herramientas esenciales para el manejo de tu negocio, con soporte técnico básico pero eficiente. Perfecto para quienes están comenzando a dar sus primeros pasos en el mundo digital.', 
    precio: 1
  },
  { 
    nombre: 'Profesional', 
    descripcion: 'Solución avanzada para las empresas que necesitan herramientas más potentes para crecer y poder gestionar operaciones de mayor escala. Con acceso a funciones premium y soporte técnico prioritario, este plan está diseñado para optimizar la productividad y ofrecer soluciones personalizadas.', 
    precio: 2 
  },
  { 
    nombre: 'Premium', 
    descripcion: 'Automatización total para empresas grandes y proyectos ambiciosos. Incluye las funcionalidades del plan Profesional y herramientas avanzadas de análisis, seguridad y gestión. Acceso a soporte personalizado 24/7, optimización de procesos a medida y características avanzadas para maximizar la eficiencia.', 
    precio: 3
  }
];
  constructor(private auth: AuthService,private http: HttpClient){
  }
  

 usuarioGoogleId: string = '';
  email: string = '';
  mp: any;
  planSeleccionado: any = null;
  cargando = false;
  isLogging = false;
  ngOnInit() {
    
   this.auth.user$.subscribe(user => {
    if (user) {
      this.usuarioGoogleId = user.uid;
      this.email = user.email ?? '';
      console.log('✅ Usuario cargado desde AuthService:', this.email);
    } else {
      console.log('⚠️ Usuario no logueado');
    }
  });
  }



  ngAfterViewInit(): void {
    this.mp = new MercadoPago('APP_USR-b90e2b2a-5f94-4cab-bbc1-2b894b993ebe', {
      locale: 'es-AR'
    });
  }

async prepararPago(plan: any): Promise<void> {
  // Validar usuario logueado
 if (!this.email) {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Acceso requerido',
      text: 'Debes iniciar sesión con Google para realizar pagos',
      confirmButtonText: 'Iniciar sesión',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      this.isLogging = true;
      this.auth.loginWithGoogle().subscribe({
        next: () => {
          this.isLogging = false;

          // 🔁 Volver a intentar el flujo de pago
          this.prepararPago(plan);
        },
        error: () => {
          this.isLogging = false;
          Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: 'No se pudo iniciar sesión. Inténtalo nuevamente.'
          });
        }
      });
    }

    return;
  }

  // Validar plan
  if (!plan?.nombre || !plan?.precio) {
    await Swal.fire({
      icon: 'error',
      title: 'Plan inválido',
      text: 'El plan seleccionado no tiene la información necesaria',
      confirmButtonText: 'OK'
    });
    return;
  }

  this.cargando = true;

  try {
    // Crear cuerpo de la petición con estructura exacta que espera el backend
    const body = {
      plan: {
        nombre: plan.nombre.trim(),
        precio: Number(plan.precio) // Asegurar que es número
      },
      origen: this.email.trim(),
      // Opcional: agregar metadata adicional
      metadata: {
        userId: this.usuarioGoogleId,
        fecha: new Date().toISOString()
      }
    };

    // Verificar estructura antes de enviar
    console.log('Enviando a /api/crear-preferencia:', JSON.stringify(body, null, 2));

    const { preferenceId } = await lastValueFrom(
      this.http.post<{ preferenceId: string }>(
        'https://backend-mp-sage.vercel.app/api/crear-preferencia',
        body
      )
    );

    // Configurar brick de pago
    this.mp.bricks().create('wallet', 'wallet_container', {
      initialization: { preferenceId },
      callbacks: {
        onReady: () => {
          this.cargando = false;
          console.log('Brick de pago listo');
        },
        onError: (error: Error) => {
          console.error('Error en Brick de MercadoPago:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error en pasarela de pago',
            text: 'No se pudo cargar el método de pago. Por favor intenta nuevamente.',
            confirmButtonText: 'Entendido'
          });
          this.cargando = false;
        },
        onSubmit: () => {
          console.log('Pago iniciado para plan:', plan.nombre);
        }
      }
    });

  } catch (error: any) {
    console.error('Error completo:', error);
    
    let errorMessage = 'Error al procesar el pago';
    if (error.status === 400) {
      errorMessage = 'Datos inválidos para procesar el pago';
    } else if (error.status === 500) {
      errorMessage = 'Error interno del servidor';
    }

    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      footer: error.error?.message ? `<small>${error.error.message}</small>` : '',
      confirmButtonText: 'Entendido'
    });
    
    this.cargando = false;
  }
}
}