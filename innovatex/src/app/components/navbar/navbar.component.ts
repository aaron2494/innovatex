import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../servicios/AuthServices';
import { User } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { PlanService } from '../../servicios/PlanService';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  scrolled = false;
  planUsuario: string | null = null;
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private planService: PlanService
  ) {
    // Escuchar cambios de sesión
    this.authService.authState().subscribe((u) => {
      this.user = u;
    });

    // Escuchar cambios del plan
    this.planService.planActivo.subscribe(plan => {
      if (plan) {
        this.planUsuario = `/planes/${plan.toLowerCase()}`;
      } else {
        this.planUsuario = null;
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
  }

  login() {
    this.authService.loginWithGoogle().subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.user = null;
      this.planUsuario = null;
    });
  }
}
