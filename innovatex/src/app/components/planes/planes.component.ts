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
  

    usuarioGoogleId: string = '';
  email: string = '';
  mp: any;
  planSeleccionado: any = null;
  cargando = false;

  ngOnInit() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.usuarioGoogleId = usuario.sub || ''; // o la clave correcta
    this.email = usuario.email || '';
  }

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

  ngAfterViewInit(): void {
    this.mp = new MercadoPago('APP_USR-2d076423-1a9e-4bb6-852d-b43808b975d2', {
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

  const origen = localStorage.getItem('usuario') || 'anonimo';

  const preference = {
    plan: plan,
    origen: origen
  };

  this.http.post<any>('https://backend-mp-sage.vercel.app/api/crear-preferencia', preference).subscribe({
    next: (res) => {
      this.cargando = false;
      const preferenciaId = res.preferenceId;

      this.mp.bricks().create('wallet', 'wallet_container', {
        initialization: {
          preferenceId: preferenciaId
        },
        customization: {
          texts: {
            valueProp: 'smart_option'
          }
        },
        callbacks: {
          onReady: () => {
            console.log('✅ Brick listo');
            this.cargando = false;
          },
          onError: (error: any) => {
            console.error('❌ Error con Brick:', error);
            this.cargando = false;
          },
          // 🔽 Agregás tu callback para guardar la compra
          onSubmit: async () => {
            const compra = {
              userId: this.usuarioGoogleId,
              email: this.email,
              plan: plan.nombre
            };

            this.http.post('https://backend-mp-sage.vercel.app/api/guardar-compra', compra).subscribe({
              next: (res) => {
                console.log('✅ Compra guardada correctamente');
              },
              error: (err) => {
                console.error('❌ Error al guardar la compra:', err);
              }
            });
          }
        }
      });
    },
    error: (err) => {
      console.error('❌ Error al obtener preferenceId:', err);
      this.cargando = false;
    }
  });
}

}