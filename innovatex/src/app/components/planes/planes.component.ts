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
    this.mp = new MercadoPago('APP_USR-2d076423-1a9e-4bb6-852d-b43808b975d2', {
      locale: 'es-AR'
    });
  }

async prepararPago(plan: any): Promise<void> {
  if (!this.email) {
    await Swal.fire('Error', 'Debes iniciar sesión primero', 'warning');
    return;
  }

  this.cargando = true;
  
  try {
    const { preferenceId } = await lastValueFrom(
      this.http.post<{ preferenceId: string }>(
        'https://backend-mp-sage.vercel.app/api/crear-preferencia',
        { 
          plan: { 
            nombre: plan.nombre, 
            precio: plan.precio 
          },
          origen: this.email
        }
      )
    );

    this.mp.bricks().create('wallet', 'wallet_container', {
      initialization: { preferenceId },
      callbacks: {
        onReady: () => {
          this.cargando = false;
        },
        onError: (error: Error) => {
          console.error('Error en Brick de MercadoPago:', error);
          Swal.fire('Error', 'No se pudo cargar el método de pago', 'error');
          this.cargando = false;
        }
      }
    });
  } catch (error: unknown) {
    console.error('Error al procesar pago:', error);
    await Swal.fire('Error', 'Error al procesar el pago', 'error');
    this.cargando = false;
  }
}
}