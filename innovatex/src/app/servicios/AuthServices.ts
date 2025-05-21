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
import { from, Observable, BehaviorSubject, tap, map, catchError } from 'rxjs';

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
  // Añade estos scopes si necesitas más información del usuario
  provider.addScope('email');
  provider.addScope('profile');

  return from(signInWithPopup(this.auth, provider)).pipe(
    tap((userCredential) => {
      const user = userCredential.user;
      // Guardado optimizado en localStorage
      localStorage.setItem('usuario', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }));
      // Actualiza el BehaviorSubject
      this._user.next(user);
    }),
    map((userCredential) => userCredential.user),
    catchError((error: AuthError) => {
      console.error('Error en login con Google:', error);
      throw this.handleAuthError(error);
    })
  );
}

private handleAuthError(error: AuthError): string {
  switch (error.code) {
    case 'auth/popup-closed-by-user':
      return 'El popup de login fue cerrado antes de completarse';
    case 'auth/account-exists-with-different-credential':
      return 'Ya existe una cuenta con este email';
    default:
      return 'Error al autenticar con Google';
  }
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
