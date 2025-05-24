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

  cargarPlan(email: string): Observable<string | null> {
    return this.http.get<{planAdquirido: string}>(
      `https://backend-mp-sage.vercel.app/api/usuario/${email}/plan`
    ).pipe(
      map(res => res.planAdquirido),
      catchError(() => of(null)),
      tap(plan => this._planActivo.next(plan))
    );
  }

  actualizarPlan(plan: string): void {
    this._planActivo.next(plan.toLowerCase());
  }
}