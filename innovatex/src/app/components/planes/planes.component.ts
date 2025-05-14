import { CommonModule, NgFor } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
declare var MercadoPago: any;

@Component({
  selector: 'app-planes',
  imports: [NgFor,CommonModule,FormsModule],
  templateUrl: './planes.component.html',
  styleUrl: './planes.component.scss',
  standalone:true,
})
export class PlanesComponent  implements AfterViewInit {
  constructor(private http: HttpClient){
  }
  mp: any;
  planSeleccionado: any = null;
  cargando = false;

planes = [
  { 
    nombre: 'Básico', 
    descripcion: 'Ideal para pequeñas y medianas empresas que buscan optimizar sus procesos de manera eficiente. Incluye herramientas esenciales para el manejo de tu negocio, con soporte técnico básico. Perfecto para quienes están comenzando a dar sus primeros pasos en el mundo digital.', 
    precio: 4999 
  },
  { 
    nombre: 'Profesional', 
    descripcion: 'Solución avanzada para empresas que necesitan herramientas potentes para crecer y gestionar operaciones de mayor escala. Con acceso a funciones premium y soporte técnico prioritario, este plan está diseñado para optimizar la productividad y ofrecer soluciones personalizadas.', 
    precio: 11999 
  },
  { 
    nombre: 'Premium', 
    descripcion: 'Automatización total para empresas grandes y proyectos ambiciosos. Incluye todas las funcionalidades del plan Profesional y herramientas avanzadas de análisis, seguridad y gestión. Acceso exclusivo a soporte personalizado 24/7, optimización de procesos a medida y características avanzadas para maximizar la eficiencia.', 
    precio: 24999 
  }
];

  ngAfterViewInit(): void {
    this.mp = new MercadoPago('TEST-de2444b5-8024-4a7d-8db5-5d824676a5ed', {
      locale: 'es-AR'
    });
  }

prepararPago(plan: any) {
  this.planSeleccionado = plan;
  this.cargando = true;
  const container = document.getElementById('wallet_container');
  if (container) {
    container.innerHTML = '';
    
  }

  this.http.post<any>('https://backend-mp-sage.vercel.app/api/crear-preferencia', { plan }).subscribe({
    next: (res) => {
      const preferenciaId = res.preferenceId;
      this.cargando = false;
      this.mp.bricks().create('wallet', 'wallet_container', {
        initialization: {
          preferenceId: preferenciaId
        },
        customization: {
          texts: {
            valueProp: 'smart_option',
          },
        },
        callbacks: {
          onReady: () => {
            console.log('✅ Brick listo');
            this.cargando = false; // Ocultar spinner cuando esté listo
          },
        
          onError: (error: any) => {
            console.error('❌ Error con Brick:', error);
            this.cargando = false; // Ocultar spinner también en caso de error
          }
        }
      });
    },
    error: (err) => {
      console.error('❌ Error al obtener preferenceId:', err);
      this.cargando = false; // Ocultar spinner también en caso de error
    }
  });
}
}