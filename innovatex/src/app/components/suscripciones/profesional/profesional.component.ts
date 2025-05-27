import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profesional',
  imports: [CommonModule],
  templateUrl: './profesional.component.html',
  styleUrl: './profesional.component.scss'
})
export class ProfesionalComponent implements AfterViewInit{
 constructor(private router:Router) {}

   goHome() {
    this.router.navigate(['/']);
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


