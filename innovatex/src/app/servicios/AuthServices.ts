import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
  onAuthStateChanged,
  AuthError,
} from '@angular/fire/auth';
import { from, Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = new BehaviorSubject<User | null>(null);
  user$ = this._user.asObservable();

  constructor(private auth: Auth) {
    const usuario = localStorage.getItem('usuario');
    if (usuario) this._user.next(JSON.parse(usuario));
    this.setupAuthStateListener();
  }
  estaAutenticado(): boolean {
    return !!this._user.value; // O tu lógica de autenticación
  }
  loginWithGoogle(): Observable<User> {
    const provider = new GoogleAuthProvider();
    return from(
      signInWithPopup(this.auth, provider).then((result) => {
        const user = result.user;

        // 👉 Guardamos en localStorage
        localStorage.setItem(
          'usuario',
          JSON.stringify({
            sub: user.uid,
            email: user.email,
          })
        );

        return user;
      })
    );
  }

  logout(): Observable<void> {
    localStorage.removeItem('usuario'); // 👈 importante
    return from(signOut(this.auth));
  }

  private setupAuthStateListener(): void {
    onAuthStateChanged(this.auth, (user) => {
      this._user.next(user);
    });
  }
}
