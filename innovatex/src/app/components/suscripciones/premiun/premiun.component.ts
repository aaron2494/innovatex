import { AfterViewInit, Component } from '@angular/core';
import { Chart } from 'chart.js';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-premiun',
  imports: [],
  templateUrl: './premiun.component.html',
  styleUrl: './premiun.component.scss'
})
export class PremiunComponent implements AfterViewInit {
constructor(private router:Router) {}

   goHome() {
    this.router.navigate(['/']);
  }
startCounters() {
  this.animateCounter('counter1', 0, 80, 1500); // Automatización
  this.animateCounter('counter2', 0, 95, 1500); // Seguridad
  this.animateCounter('counter3', 0, 90, 1500); // Escalabilidad
  this.animateCounter('counter4', 0, 7, 1200, 'días'); // Soporte
}

animateCounter(id: string, start: number, end: number, duration: number, suffix = '%') {
  const element = document.getElementById(id);
  if (!element) return;
  let current = start;
  const increment = (end - start) / (duration / 50);
  const interval = setInterval(() => {
    current += increment;
    if (current >= end) {
      current = end;
      clearInterval(interval);
    }
    element.textContent = Math.round(current) + suffix;
  }, 50);
}

ngAfterViewInit() {
  this.startCounters()
  const ctx = document.getElementById('premiumChart') as HTMLCanvasElement;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Automatización', 'Escalabilidad', 'Soporte', 'Seguridad'],
      datasets: [{
        label: 'Nivel alcanzado',
        data: [80, 90, 95, 85],
        backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545']
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

}

