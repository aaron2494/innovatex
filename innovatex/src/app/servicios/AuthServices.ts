import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, User, onAuthStateChanged } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth) {}

  loginWithGoogle(): Observable<User> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider).then(result => result.user));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  authState(): Observable<User | null> {
    return new Observable((observer) => {
      return onAuthStateChanged(this.auth, observer);
    });
  }
}
