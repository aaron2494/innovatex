import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private backendUrl = 'https://backend-mp-49xu.onrender.com'; 

  constructor(private http: HttpClient) {}

  createPreference(plan: string, userEmail: string) {
    return this.http.post<{ init_point: string }>(
      `${this.backendUrl}/api/create-preference`,
      { plan, userEmail },
      {
         withCredentials: true
      }
    );
  }
}
