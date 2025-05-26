import { User } from 'firebase/auth';
import { AuthService } from './../../servicios/AuthServices';
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FirebaseService } from '../../servicios/firebaseService';


@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterLink,NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit{
userPlan: string | null = null;
 planUsuario=''

constructor(private authService:AuthService, private firebaseService: FirebaseService){
}
  ngOnInit() {
  this.authService.user$.subscribe(user => {
    const email = user?.email;
    if (email) {
      this.firebaseService.getUserPlan(email).then(plan => {
        if (plan) {
          this.userPlan = plan;
        }
      });
    }
  });
}
 
}
 