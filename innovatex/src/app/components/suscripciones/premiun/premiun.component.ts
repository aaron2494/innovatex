import { AfterViewInit, Component } from '@angular/core';
import { Chart } from 'chart.js';
import { Location } from '@angular/common';
@Component({
  selector: 'app-premiun',
  imports: [],
  templateUrl: './premiun.component.html',
  styleUrl: './premiun.component.scss'
})
export class PremiunComponent implements AfterViewInit {
constructor(private location: Location) {}

  volver() {
    this.location.back();
  }

  ngAfterViewInit(): void {
    const ctx = document.getElementById('statsChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Eficiencia', 'Costos', 'Respuesta Cliente'],
        datasets: [{
          label: 'Mejoras promedio (%)',
          data: [45, 30, 50],
          backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc']
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }
}

