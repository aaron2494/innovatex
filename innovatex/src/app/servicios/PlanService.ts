import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PlanService {
  planActivo = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  cargarPlanDelUsuario(email: string) {
    return this.http.get<string>(`https://backend-mp-sage.vercel.app/api/usuario/${email}/plan`)
      .subscribe(plan => this.planActivo.next(plan));
  }
}