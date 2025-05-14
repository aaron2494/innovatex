import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-projects',
  imports: [NgFor,MatIconModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
 stories = [
    {
      icon: 'factory',
      title: 'Optimización en Planta Industrial',
      description: 'Automatizamos procesos de ensamblaje reduciendo tiempos de producción en un 35%.',
      results: [
        'Reducción de errores en línea',
        'Integración con sensores IoT',
        'Ahorro energético del 20%'
      ]
    },
    {
      icon: 'store',
      title: 'Transformación Digital en Retail',
      description: 'Digitalizamos el inventario y los puntos de venta para una cadena con más de 50 sucursales.',
      results: [
        'Control de stock en tiempo real',
        'Reportes automáticos diarios',
        'Mejora en experiencia del cliente'
      ]
    },
    {
      icon: 'public',
      title: 'Escalamiento en Plataforma SaaS',
      description: 'Reestructuramos una plataforma cloud para que pueda escalar de 500 a 10.000 usuarios concurrentes.',
      results: [
        'Implementación de microservicios',
        'Optimización del rendimiento',
        'Alta disponibilidad asegurada'
      ]
    }
  ];
}
