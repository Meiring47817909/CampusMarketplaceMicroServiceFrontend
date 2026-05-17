import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:4000/api'; // Pointing to Gateway

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // Public/Auth
  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  // Products
  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/products`);
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/products`, product, { headers: this.getHeaders() });
  }

  // Buy
  buyProduct(orderData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/buy`, orderData, { headers: this.getHeaders() });
  }
}
