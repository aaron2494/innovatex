import { CommonModule, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [NgFor,CommonModule],
  standalone:true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent  implements OnInit {
   ventas: any[] = [];
  cargando = false;
  error = '';
  totalIngresos = 0;

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

