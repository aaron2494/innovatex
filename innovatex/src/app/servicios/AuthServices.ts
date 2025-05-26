import { inject, Injectable } from '@angular/core';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  getAuth,
  User,
  Auth,
} from '@angular/fire/auth';
import {  BehaviorSubject} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
 private auth: Auth;
  user$ = new BehaviorSubject<User | null>(null);

  constructor() {
    this.auth = inject(Auth); // ✅ usa Angular DI
    onAuthStateChanged(this.auth, user => this.user$.next(user));
  }

  get userLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  logout() {
    return signOut(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}