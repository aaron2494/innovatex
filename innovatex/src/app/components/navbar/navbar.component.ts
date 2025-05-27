import { User } from 'firebase/auth';
import { AuthService } from './../../servicios/AuthServices';
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FirebaseService } from '../../servicios/firebaseService';


@Component({
  selector: 'app-navbar',
  imports: [CommonModule,NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit{
 userPlan: string | null = null;

  constructor(
    public authService: AuthService, // debe ser público para usarlo en el template
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      const email = user?.email;
      if (email) {
        this.firebaseService.getUserPlan(email).then(plan => {
          this.userPlan = plan;
        });
      }
    });
  }
  logout() {
  this.authService.logout();
}
}