import { Component, HostListener, OnDestroy } from '@angular/core';
import { AuthService } from '../../servicios/AuthServices';
import { User } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { PlanService } from '../../servicios/PlanService';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterLink],
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
    private planService: PlanService
  ) {
    this.subscriptions.add(
      this.authService.user$.subscribe(u => this.user = u)
    );

    this.subscriptions.add(
      this.planService.planActivo$.subscribe(plan => {
        this.planUsuario = plan ? `/planes/${plan.toLowerCase()}` : null;
      })
    );
  }

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
      window.location.reload(); // Forzar recarga completa
    },
    error: () => this.isLoggingOut = false
  });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}