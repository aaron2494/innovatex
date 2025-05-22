import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, distinctUntilChanged, filter, map, of, switchMap, tap } from "rxjs";
import { AuthService } from "./AuthServices";

@Injectable({ providedIn: 'root' })

export class PlanService {
 private _planActivo = new BehaviorSubject<string | null>(null);
  planActivo$ = this._planActivo.asObservable();

  constructor(private http: HttpClient, private auth: AuthService) {
     this.auth.user$.pipe(
      filter(user => !!user?.email),
      distinctUntilChanged((prev, curr) => prev?.email === curr?.email),
      switchMap(user => this.cargarPlan(user!.email!))
    ).subscribe();
  }

  cargarPlan(email: string) {
    return this.http.get<{planAdquirido: string}>(`https://backend-mp-sage.vercel.app/api/usuario/${email}/plan`).pipe(
      map(res => res.planAdquirido),
      catchError(() => of(null)),
      tap(plan => this._planActivo.next(plan))
    );
  }
actualizarPlan(plan: string): void {
  this._planActivo.next(plan.toLowerCase());
}
  registrarPlan(email: string, plan: string) {
    return this.http.post('https://backend-mp-sage.vercel.app/api/registrar-plan', {email, plan}).pipe(
      tap(() => this._planActivo.next(plan)),
      catchError(error => {
        console.error('Error al registrar plan:', error);
        throw error;
      })
    );
  }
}