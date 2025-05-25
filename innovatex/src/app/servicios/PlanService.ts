import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, distinctUntilChanged, filter, map, Observable, of, switchMap, tap } from "rxjs";
import { AuthService } from "./AuthServices";

@Injectable({ providedIn: 'root' })

  export class PlanService {
  private _planActivo = new BehaviorSubject<string | null>(null);
    planActivo$ = this._planActivo.asObservable();

    constructor(private http: HttpClient, private auth: AuthService) {
      this.initPlanSubscription();
    }

    private initPlanSubscription(): void {
      this.auth.user$.pipe(
        filter(user => !!user?.email),
        distinctUntilChanged((prev, curr) => prev?.email === curr?.email),
        switchMap(user => this.cargarPlan(user!.email!))
      ).subscribe();
    }

    cargarPlan(email: string): Observable<{planAdquirido: string | null, active: boolean}> {
      return this.http.get<{planAdquirido: string | null, active: boolean}>(
        `https://backend-mp-sage.vercel.app/api/usuario/${encodeURIComponent(email)}/plan`
      ).pipe(
        catchError(() => of({planAdquirido: null, active: false})),
        tap(response => this._planActivo.next(response.planAdquirido))
      );
    }
    verificarPlan(email: string): Observable<{planAdquirido: string | null}> {
      return this.http.get<{planAdquirido: string}>(
        `https://backend-mp-sage.vercel.app/api/usuario/${encodeURIComponent(email)}/plan`
      ).pipe(
        map(response => ({
          planAdquirido: response?.planAdquirido || null
        })),
        catchError(() => of({planAdquirido: null}))
      );
    }
    verificarPlanUsuario(email: string): Observable<{planAdquirido: string}> {
      return this.http.get<{planAdquirido: string}>(
        `https://backend-mp-sage.vercel.app/api/usuario/${encodeURIComponent(email)}/plan`
      ).pipe(
        catchError(() => {
          throw new Error('Error al verificar el plan');
        })
      );
    }
    actualizarPlan(plan: string): void {
    this._planActivo.next(plan.toLowerCase());
  }
  }