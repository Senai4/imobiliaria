import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { InteresseDB, InteressadoTela } from 'src/app/models/interessado.model';
import { Imovel } from '../models/imovel.model';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class InteressadosService {
  private apiUrl = 'http://localhost:3006';

  constructor(private http: HttpClient) { }

  getTituloImovel(imovelId: string): Observable<string> {
    return this.http.get<Imovel>(`${this.apiUrl}/imovel/${imovelId}`).pipe(
      map(imovel => imovel.titulo)
    );
  }

  getInteressadosDoImovel(imovelId: string): Observable<InteressadoTela[]> {
    return this.http.get<InteresseDB[]>(`${this.apiUrl}/interesses?imovelId=${imovelId}`).pipe(
      switchMap((interesses: InteresseDB[]) => {
        if (interesses.length === 0) {
          return new Observable<InteressadoTela[]>(subscriber => {
            subscriber.next([]);
            subscriber.complete();
          });
        }

        const chamadasUsuarios: Observable<Usuario>[] = interesses.map(interesse =>
          this.http.get<Usuario>(`${this.apiUrl}/usuarios/${interesse.clienteId}`)
        );

        return forkJoin(chamadasUsuarios).pipe(
          map((usuarios: Usuario[]) => {
            const interessadosMap = new Map<string, InteressadoTela>();

            usuarios.forEach(usuario => {
              if (!interessadosMap.has(usuario.id)) {
                interessadosMap.set(usuario.id, {
                  nome: usuario.nome,
                  email: usuario.email
                });
              }
            });

            return Array.from(interessadosMap.values());
          })
        );
      })
    );
  }
}
