import { AfterViewInit, Component } from '@angular/core';
import { Chart } from 'chart.js';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-basico',
  imports: [],
  templateUrl: './basico.component.html',
  styleUrl: './basico.component.scss'
})
export class BasicoComponent implements AfterViewInit {
constructor(private router:Router) {}

  goHome() {
    this.router.navigate(['/']);
  }

 animateCounter(id: string, start: number, end: number, suffix: string = ''): void {
    const el = document.getElementById(id);
    if (!el) return;

    let current = start;
    const stepTime = Math.abs(Math.floor(2000 / (end - start)));
    const increment = end > start ? 1 : -1;

    const timer = setInterval(() => {
      current += increment;
      el.innerText = current.toString() + suffix;
      if (current === end) clearInterval(timer);
    }, stepTime);
  }

  ngAfterViewInit(): void { 
  // Contadores animados
  this.animateCounter('counter1', 0, 45, '%');
  this.animateCounter('counter2', 0, 30, '%');
  this.animateCounter('counter3', 0, 50, '%');
  this.animateCounter('counter4', 0, 1200, '');

  // Gráfico: Impacto mensual
  new Chart('statsChart', {
    type: 'bar',
    data: {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
      datasets: [
        {
          label: 'Horas Ahorradas',
          data: [150, 220, 340, 410, 550],
          backgroundColor: '#17a2b8'
        },
        {
          label: 'Costo Ahorrado ($)',
          data: [1200, 2100, 3100, 4200, 5100],
          backgroundColor: '#28a745'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

}


