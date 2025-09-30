import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs'; // Adicionando imports necessários para a função de destaque
import { map, switchMap, catchError } from 'rxjs/operators'; // Adicionando imports necessários para a função de destaque
import { Imovel } from '../models/imovel.model';
import { AuthService } from './auth.service';
import { InteresseDB } from '../models/interessado.model'; // Adicionando import para o model de interesse

@Injectable({
  providedIn: 'root',
})
export class ImovelService {
  // Ajustando apiUrl para ser apenas a base, já que os métodos a completam (ex: /imovel)
  private apiUrl = 'http://localhost:3006';

  // O endpoint de imóveis é agora uma constante para clareza
  private imovelEndpoint = `${this.apiUrl}/imovel`;
  private interesseEndpoint = `${this.apiUrl}/interesses`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getCorretorId(): string {
    return this.authService.usuarioAtual()?.id || '';
  }

  getMeusImoveis(): Observable<Imovel[]> {
    const corretorId = this.getCorretorId();
    return this.http.get<Imovel[]>(`${this.imovelEndpoint}?corretorId=${corretorId}`);
  }

  getImovel(): Observable<Imovel[]> {
    return this.http.get<Imovel[]>(this.imovelEndpoint);
  }

  getImovelById(id: string): Observable<Imovel> {
    const apiUrlFinal = `${this.imovelEndpoint}/${id}`;
    return this.http.get<Imovel>(apiUrlFinal);
  }

  postImovel(imovel: Imovel): Observable<Imovel[]> {
    const corretorId = this.getCorretorId();
    const imovelComCorretor = { ...imovel, corretorId: corretorId };
    return this.http.post<Imovel[]>(this.imovelEndpoint, imovelComCorretor);
  }

  putImovel(id: any, imovel: Imovel): Observable<Imovel[]> {
    const apiUrlFinal = `${this.imovelEndpoint}/${id}`;
    return this.http.put<Imovel[]>(apiUrlFinal, imovel);
  }

  deleteImovel(id: any): Observable<Imovel[]> {
    const apiUrlFinal = `${this.imovelEndpoint}/${id}`;
    return this.http.delete<Imovel[]>(apiUrlFinal);
  }

  /**
   * Busca os N imóveis mais favoritados.
   * A lógica permanece a mesma para a busca dos destaques.
   * @param limit O número máximo de imóveis para retornar (padrão: 5).
   */
  getFeaturedImoveis(limit: number = 6): Observable<Imovel[]> {
    // 1. Busca todos os registros de interesse
    return this.http.get<InteresseDB[]>(this.interesseEndpoint).pipe(
      // 2. Processa os interesses para encontrar os top Imovel IDs
      switchMap((interesses: InteresseDB[]) => {
        const counts = new Map<string, number>();

        // Contagem de ocorrências de cada Imovel ID
        interesses.forEach(interesse => {
          const id = interesse.imovelId;
          counts.set(id, (counts.get(id) || 0) + 1);
        });

        const sortedIds = Array.from(counts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, limit)
          .map(([id]) => id);

        if (sortedIds.length === 0) {
          return of([]);
        }

        const imovelCalls: Observable<Imovel>[] = sortedIds.map(id =>
          this.http.get<Imovel>(`${this.imovelEndpoint}/${id}`).pipe(
            catchError(err => {
              console.warn(`Imóvel ID ${id} não encontrado na busca de destaques.`, err);
              return of(null as any);
            })
          )
        );

        return forkJoin(imovelCalls).pipe(
          map(imoveis => imoveis.filter(imovel => imovel !== null))
        );
      }),
      catchError(err => {
        console.error('Erro ao buscar destaques via interesses:', err);
        return of([]);
      })
    );
  }
}
export { Imovel };
