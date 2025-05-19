import { CommonModule, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {  ChartData, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
@Component({
  selector: 'app-dashboard',
  imports: [NgFor,CommonModule,BaseChartDirective],
  standalone:true,
  animations:[
    trigger('expansion', [
      state('oculto', style({
        height: '0',
        opacity: 0,
        padding: '0',
        margin: '0',
      })),
      state('visible', style({
        height: '*',
        opacity: 1,
        padding: '*',
        margin: '*',
      })),
      transition('oculto <=> visible', [
        animate('500ms ease-in-out')
      ])
    ])
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent  implements OnInit {
  mostrarDashboard = false;

   ventas: any[] = [];
  cargando = false;
  error = '';
  totalIngresos = 0;

  // 🎯 Datos para el gráfico
 chartData: ChartData<'pie', number[], string> = {
    labels: ['Básico', 'Profesional', 'Premium'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#3498db', '#2ecc71', '#e74c3c']
    }]
  };

  chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  chartType: ChartType = 'pie';

  constructor(private http: HttpClient) {}
 ngOnInit(): void {
    this.obtenerVentas();
  }

   obtenerVentas() {
    this.cargando = true;
    this.error = '';
    
    this.http.get<any[]>('https://backend-mp-sage.vercel.app/api/ventas').subscribe({
      next: (ventas) => {
        this.ventas = ventas;
        this.calcularTotalIngresos();
        this.generarDatosGrafico();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener ventas:', err);
        this.error = 'Error al cargar las ventas';
        this.cargando = false;
      }
    });
  }

   calcularTotalIngresos() {
    this.totalIngresos = this.ventas.reduce((total, venta) => total + venta.monto, 0);
  }
generarDatosGrafico() {
      const conteo: { [key: string]: number } = { Básico: 0, Profesional: 0, Premium: 0 };

    for (const venta of this.ventas) {
      conteo[venta.plan] = (conteo[venta.plan] || 0) + 1;
    }

    this.chartData = {
      labels: Object.keys(conteo),
      datasets: [{
        data: Object.values(conteo),
        backgroundColor: ['#3498db', '#2ecc71', '#e74c3c']
      }]
    };
  }

  formatearFecha(fecha: string | null): string {
  if (!fecha) return 'Fecha no disponible';

  const fechaObj = new Date(fecha);
  if (isNaN(fechaObj.getTime())) {
    return 'Fecha inválida';
  }

  return fechaObj.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
}

  // Función para formatear el monto
  formatearMonto(monto: number): string {
    return `$${monto.toFixed(2)} ARS`;
  }
}

