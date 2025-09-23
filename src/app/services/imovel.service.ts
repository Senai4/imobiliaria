import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //solicitações http (GET/POST/PUT/DELETE)
import { Observable } from 'rxjs'; //classe que traduz a API <=> OBJ
import { Imovel } from '../models/imovel.model';

@Injectable({
  providedIn: 'root',
})
export class ImovelService {
  //atributos - endereço da api
  private apiUrl = 'http://localhost:3006/imovel'; //caminho para API

  constructor(private http: HttpClient) {}
  // ao instanciar o obj da classe , cria-se a conexão com o httpClient

  //métodos de Conexão
  //GET -> obtem a Lista de Imoveis a partir da API
  //nomeDométodo
  getImovel(): Observable<Imovel[]> {
    //biblioteca da rxjs -> traduz os dados da API <=> obj
    return this.http.get<Imovel[]>(this.apiUrl);
  }

  //POST -> Cadastra uma Imovel na API
  postImovel(imovel: Imovel): Observable<Imovel[]> {
    return this.http.post<Imovel[]>(this.apiUrl, imovel);
  }

  // PUT -> Atualizar Imovel Existente na API
  putImovel(id: any, imovel: Imovel): Observable<Imovel[]> {
    const apiUrlFinal = `${this.apiUrl}/${id}`;
    return this.http.put<Imovel[]>(apiUrlFinal, imovel);
  }

  //DELETE -> Deleta imovel Existente na API
  deleteImovel(id: any): Observable<Imovel[]> {
    //const apiUrlFinal = this.apiUrl+"/"+id;
    const apiUrlFinal = `${this.apiUrl}/${id}`;
    return this.http.delete<Imovel[]>(apiUrlFinal);
  }
}
