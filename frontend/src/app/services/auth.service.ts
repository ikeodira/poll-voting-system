import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiUrl;
  private userSubject = new BehaviorSubject<any>(this.storedUser());
  currentUser$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  signup(data: any) {
    return this.http.post(`${this.api}/auth/signup`, data);
  }

  login(data: any) {
    return this.http.post<any>(`${this.api}/auth/login`, data).pipe(
      tap((res) => {
        localStorage.setItem('pvs_token', res.token);
        localStorage.setItem('pvs_user', JSON.stringify(res.user));
        this.userSubject.next(res.user);
      }),
    );
  }

  logout() {
    localStorage.removeItem('pvs_token');
    localStorage.removeItem('pvs_user');
    this.userSubject.next(null);
  }

  get token(): string | null {
    return localStorage.getItem('pvs_token');
  }

  get currentUser(): any {
    return this.userSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  private storedUser(): any {
    try {
      const u = localStorage.getItem('pvs_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }
}
