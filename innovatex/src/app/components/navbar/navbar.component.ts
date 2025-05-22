import { Component, HostListener, OnDestroy } from '@angular/core';
import { AuthService } from '../../servicios/AuthServices';
import { User } from 'firebase/auth';
import { CommonModule, NgIf } from '@angular/common';
import { PlanService } from '../../servicios/PlanService';
import { Router, RouterLink } from '@angular/router';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterLink,NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnDestroy {
 scrolled = false;
  planUsuario: string | null = null;
  user: User | null = null;
  isMenuCollapsed = true;
  isLogging = false;
  isLoggingOut = false;
  
  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private planService: PlanService,
    private router: Router
  ) {
    // Escuchar cambios en el usuario autenticado
    this.subscriptions.add(
      this.authService.user$.pipe(
        tap(user => {
          this.user = user;
          // Si hay usuario, verificar su plan
          if (user?.email) {
            this.verificarPlanUsuario(user.email);
          }
        })
      ).subscribe()
    );

    // Escuchar cambios en el plan activo
    this.subscriptions.add(
      this.planService.planActivo$.subscribe(plan => {
        this.actualizarPlanNavbar(plan);
      })
    );
  }

  private verificarPlanUsuario(email: string): void {
    this.planService.cargarPlan(email).subscribe();
  }

  private actualizarPlanNavbar(plan: string | null): void {
    this.planUsuario = plan ? `/planes/${plan.toLowerCase()}` : null;
    
    // Actualizar el tooltip del botón
    if (plan) {
      setTimeout(() => {
        const tooltipElements = document.querySelectorAll('[matTooltip]');
        tooltipElements.forEach(el => {
          // Reiniciar tooltips para que detecten el nuevo texto
          if (el.getAttribute('matTooltip') === 'Ver detalles de tu plan') {
            el.setAttribute('matTooltip', `Plan ${plan}`);
          }
        });
      }, 100);
    }
  }

  // Resto de los métodos permanecen igual...
  @HostListener('window:scroll')
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
  }

  login() {
    this.isLogging = true;
    this.authService.loginWithGoogle().subscribe({
      next: () => this.isLogging = false,
      error: () => this.isLogging = false
    });
  }

  logout() {
    this.isLoggingOut = true;
    this.authService.logout().subscribe({
      next: () => {
        this.isLoggingOut = false;
        window.location.reload();
      },
      error: () => this.isLoggingOut = false
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}