import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Interesse {
  id?: number;
  clienteId: number;
  imovelId: number;
}

@Injectable({
  providedIn: 'root',
})
export class InteresseService {
  private baseUrl = 'http://localhost:3006/interesses';

  constructor(private http: HttpClient) {}

  getInteressesByCliente(clienteId: number) {
    return this.http.get<Interesse[]>(`${this.baseUrl}?clienteId=${clienteId}`);
  }

  addInteresse(interesse: Interesse) {
    return this.http.post<Interesse>(this.baseUrl, interesse);
  }

  removeInteresse(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}

