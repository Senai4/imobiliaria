import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Imovel, ImovelService } from 'src/app/services/imovel.service';
import { AuthService } from 'src/app/services/auth.service';
import { InteresseService, Interesse } from 'src/app/services/interesse.service';


type ImovelDetalhado = Imovel & { interesseId?: number };

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.scss'],
})
export class DetalhesComponent implements OnInit, OnDestroy {

  imovelDetalhado: ImovelDetalhado | null = null;
  private routeSubscription!: Subscription;
  private userId!: number;

  interessesIds: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private imovelService: ImovelService,
    public authService: AuthService,
    private interesseService: InteresseService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userId = user.id as number;

        this.interesseService.getInteressesByCliente(this.userId)
          .subscribe((interesses: Interesse[]) => {
              this.interessesIds = interesses.map(i => i.imovelId);
          });

      } else {
        this.userId = 0;
        this.interessesIds = [];
      }
    });

    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const anuncioId: string | null = params.get('id');

      if (anuncioId) {
        this.imovelService.getImovelById(anuncioId).subscribe({
          next: (imovel: Imovel) => {
            this.imovelDetalhado = imovel as ImovelDetalhado;
          },
          error: (err) => console.error('Erro ao carregar imóvel', err)
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  isFavorito(imovelId: number): boolean {
    return this.interessesIds.some(id => id === imovelId);
  }

  toggleFavorito(imovelId: number) {
    if (!this.userId) return;

    const eFavoritoAtual = this.isFavorito(imovelId);

    if (eFavoritoAtual) {
      this.interesseService.getInteressesByCliente(this.userId)
        .subscribe(interesses => {
          const interesseExistente = interesses.find(i => i.imovelId === imovelId);

          if (interesseExistente && interesseExistente.id) {
            this.interesseService.removeInteresse(interesseExistente.id).subscribe({
              next: () => {
                this.interessesIds = this.interessesIds.filter(id => id !== imovelId);
                console.log('Removido dos interesses!');
              },
              error: (err) => console.error('Erro ao remover interesse', err),
            });
          }
        });
    } else {
      const novo: Interesse = { clienteId: this.userId, imovelId: imovelId };

      this.interesseService.addInteresse(novo).subscribe({
        next: (res) => {
          this.interessesIds.push(imovelId);
          console.log('Adicionado aos interesses!');
        },
        error: (err) => console.error('Erro ao adicionar interesse', err),
      });
    }
  }
}
