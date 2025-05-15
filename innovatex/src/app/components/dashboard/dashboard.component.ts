import { CommonModule, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
    
    this.http.get<any[]>('http://localhost:3000/api/ventas').subscribe({
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

  // Función para formatear la fecha
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-AR');
  }

  // Función para formatear el monto
  formatearMonto(monto: number): string {
    return `$${monto.toFixed(2)} ARS`;
  }
}

