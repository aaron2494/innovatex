import { CommonModule, NgFor } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
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
  standalone: true,
  imports: [CommonModule, NgFor, HttpClientModule, BaseChartDirective],
  animations: [
    trigger('expansion', [
      state('oculto', style({
        height: '0',
        opacity: 0,
        padding: '0',
        margin: '0',
        overflow: 'hidden'
      })),
      state('visible', style({
        height: '*',
        opacity: 1,
        padding: '*',
        margin: '*'
      })),
      transition('oculto <=> visible', [
        animate('500ms ease-in-out')
      ])
    ])
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  paginaActual = 1;
  itemsPorPagina = 5;
  mostrarDashboard = true
  ventas: any[] = [];
  cargando = false;
  error = '';
  totalIngresos = 0;

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

    this.http.get<any[]>('https://backend-mp-49xu.onrender.com/api/ventas').subscribe({
      next: (ventas) => {
        console.log('Ventas recibidas:', ventas); // 👈 esto
        this.ventas = ventas.reverse();
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

  get ventasPaginadas(): any[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.ventas.slice(inicio, fin);
  }

  totalPaginas(): number {
    return Math.ceil(this.ventas.length / this.itemsPorPagina);
  }

  totalPaginasArray(): number[] {
    return Array.from({ length: this.totalPaginas() }, (_, i) => i + 1);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual = pagina;
    }
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

  formatearMonto(monto: number): string {
    return `$${monto.toFixed(2)} ARS`;
  }
}
