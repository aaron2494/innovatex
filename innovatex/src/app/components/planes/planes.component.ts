import { PlanService } from './../../servicios/PlanService';
import { CommonModule, NgFor } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
declare var MercadoPago: any;
import Swal from 'sweetalert2';
import { AuthService } from '../../servicios/AuthServices';
import { lastValueFrom } from 'rxjs';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-planes',
  imports: [NgFor,CommonModule,FormsModule],
  templateUrl: './planes.component.html',
  styleUrl: './planes.component.scss',
  standalone:true,
})

export class PlanesComponent  implements AfterViewInit {
  [x: string]: any;
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
  constructor(private auth: AuthService,private http: HttpClient,private planService: PlanService,private router : Router){
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
    const body = {
      plan: {
        nombre: plan.nombre.trim(),
        precio: Number(plan.precio)
      },
      origen: this.email.trim(),
      metadata: {
        userId: this.usuarioGoogleId,
        email: this.email.trim(), // 👈 Asegura que el email está en metadata
        plan: plan.nombre.trim(), // 👈 Añade el nombre del plan directamente
        fecha: new Date().toISOString(),
        frontendId: Math.random().toString(36).substring(2, 11)
      }
    };

    console.log('Datos enviados:', body);

    const { preferenceId } = await lastValueFrom(
      this.http.post<{ preferenceId: string }>(
        'https://backend-mp-sage.vercel.app/api/crear-preferencia',
        body
      )
    );

    this.mp.bricks().create('wallet', 'wallet_container', {
      initialization: { preferenceId },
      callbacks: {
        onReady: () => {
          this.cargando = false;
        },
        onError: (error: any) => {
          console.error('Error en Brick:', error);
          this.cargando = false;
          Swal.fire({
            icon: 'error',
            title: 'Error en el pago',
            text: 'Ocurrió un problema al procesar el pago'
          });
        },
       onPayment: async (response: any) => {
  console.log('Estado del pago:', response.status);
  if (response.status === 'approved') {
    // 1. Mostrar confirmación
    await Swal.fire({
      icon: 'success',
      title: '¡Pago exitoso!',
      text: 'Estamos activando tu plan...',
      timer: 2000,
      showConfirmButton: false
    });
    
    // 2. Verificar con el backend
    try {
      await lastValueFrom(
        this.http.get(`https://backend-mp-sage.vercel.app/api/usuario/${this.email}/plan`)
      );
      
      // 3. Redirigir
      this.router.navigate(['/pago-exitoso']);
    } catch (error) {
      console.error('Error verificando plan:', error);
      Swal.fire({
        icon: 'warning',
        title: 'Plan en proceso',
        text: 'Tu pago fue exitoso pero la activación puede demorar unos minutos'
      });
    }
  }
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