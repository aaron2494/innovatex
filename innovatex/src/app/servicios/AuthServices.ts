import { Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User, 
  onAuthStateChanged,
  AuthError 
} from '@angular/fire/auth';
import { from, Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
   private _user = new BehaviorSubject<User | null>(null);
  user$ = this._user.asObservable();

  constructor(private auth: Auth) {
    this.setupAuthStateListener();
  }

  loginWithGoogle(): Observable<User> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider).then(result => result.user));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  private setupAuthStateListener(): void {
    onAuthStateChanged(this.auth, (user) => {
      this._user.next(user);
    });
  }
}