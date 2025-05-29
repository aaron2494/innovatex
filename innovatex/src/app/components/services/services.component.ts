import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-services',
  imports: [MatCardModule, MatIconModule,MatButtonModule, NgFor],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
 services = [
    {
      icon: 'precision_manufacturing',
      title: 'Automatización de Procesos',
      description: 'Optimizamos tus operaciones con soluciones automatizadas que reducen errores y mejoran la productividad.',
      details: [
        'Robótica industrial e IoT',
        'Sistemas SCADA personalizados',
        'Integración con ERPs'
      ]
    },
    {
      icon: 'memory',
      title: 'Desarrollo integral de Software',
      description: 'Creamos plataformas adaptadas a tus procesos para que trabajes más rápido y con mayor control.',
      details: [
        'Sistemas web y móviles',
        'Dashboards y BI',
        'Integración API y microservicios'
      ]
    },
    {
      icon: 'support_agent',
      title: 'Soporte Técnico y Mantenimiento',
      description: 'Aseguramos continuidad operativa con un equipo disponible 24/7 y mantenimiento preventivo.',
      details: [
        'Atención remota y presencial',
        'Planes mensuales escalables',
        'Monitoreo de infraestructura'
      ]
    }
  ];
}