import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Imovel } from '../models/imovel.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ImovelService {
  // Atributos
  private apiUrl = 'http://localhost:3006/imovel';
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getCorretorId(): string {
    return this.authService.usuarioAtual()?.id || '';
  }

  getMeusImoveis(): Observable<Imovel[]> {
    const corretorId = this.getCorretorId();
    return this.http.get<Imovel[]>(`${this.apiUrl}?corretorId=${corretorId}`);
  }

  getImovel(): Observable<Imovel[]> {
    return this.http.get<Imovel[]>(this.apiUrl);
  }

  getImovelById(id: string): Observable<Imovel> {
    const apiUrlFinal = `${this.apiUrl}/${id}`;
    return this.http.get<Imovel>(apiUrlFinal);
  }

  postImovel(imovel: Imovel): Observable<Imovel[]> {
    const corretorId = this.getCorretorId();
    const imovelComCorretor = { ...imovel, corretorId: corretorId };
    return this.http.post<Imovel[]>(this.apiUrl, imovelComCorretor);
  }

  putImovel(id: any, imovel: Imovel): Observable<Imovel[]> {
    const apiUrlFinal = `${this.apiUrl}/${id}`;
    return this.http.put<Imovel[]>(apiUrlFinal, imovel);
  }

  deleteImovel(id: any): Observable<Imovel[]> {
    const apiUrlFinal = `${this.apiUrl}/${id}`;
    return this.http.delete<Imovel[]>(apiUrlFinal);
  }
}
export { Imovel };

