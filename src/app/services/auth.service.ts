import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3006/usuarios';
  private readonly CHAVE_AUTH = 'usuarioLogado';

  private _currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;

  constructor(private router: Router, private http: HttpClient) {
    const storedUser = localStorage.getItem(this.CHAVE_AUTH);
    const user = storedUser ? JSON.parse(storedUser) : null;
    this._currentUserSubject = new BehaviorSubject<any>(user);
    this.currentUser$ = this._currentUserSubject.asObservable();
  }

  registrar(usuario: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?email=${usuario.email}`).pipe(
      switchMap((res) => {
        if (res.length > 0) {
          return throwError(() => new Error('Email Já Cadastrado'));
        } else {
          return this.http.post<any>(this.apiUrl, usuario);
        }
      })
    );
  }

  login(credenciais: any): Observable<boolean> {
    return this.http
      .get<any[]>(
        `${this.apiUrl}?email=${credenciais.email}&senha=${credenciais.senha}`
      )
      .pipe(
        map((usuarios) => {
          if (usuarios.length > 0) {
            const usuario = usuarios[0];
            localStorage.setItem(this.CHAVE_AUTH, JSON.stringify(usuario));
            this._currentUserSubject.next(usuario);
            return true;
          } else {
            return false;
          }
        })
      );
  }

  logout() {
  localStorage.removeItem(this.CHAVE_AUTH);
  this._currentUserSubject.next(null);
  this.router.navigate(['/home']);
  }

  estaLogado(): boolean {
    return !!localStorage.getItem(this.CHAVE_AUTH);
  }

  usuarioAtual(): any {
    const storedUser = localStorage.getItem(this.CHAVE_AUTH);
    return storedUser ? JSON.parse(storedUser) : null;
  }

    public getPerfilUsuario(): 'admin' | 'usuario' | null {
    const user = this.usuarioAtual();
    return user ? user.perfil : null;
}

    public isCorretor(): boolean {
    return this.estaLogado() && this.getPerfilUsuario() === 'admin';
}
}
