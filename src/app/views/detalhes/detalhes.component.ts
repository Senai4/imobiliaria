import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Imovel, ImovelService } from 'src/app/services/imovel.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.scss'],
})
export class DetalhesComponent implements OnInit, OnDestroy {

  imovelDetalhado: Imovel | null = null;
  private routeSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private imovelService: ImovelService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // A lógica de carregamento do imóvel detalhado permanece a mesma.
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const anuncioId: string | null = params.get('id');

      if (anuncioId) {
        this.imovelService.getImovelById(anuncioId).subscribe({
          next: (imovel) => {
            this.imovelDetalhado = imovel;
          },
          error: (err) => console.error('Erro ao carregar imóvel', err)
        });
      }
    });

    // Você não precisa repetir a lógica de subscrição do usuário (isLoggedIn, userName, etc.)
    // que estava no outro componente, pois a navegação já acessa o `authService.currentUser$`
    // DIRETAMENTE no seu template HTML, como você fez:
    // <div class="user" *ngIf="authService.currentUser$ | async as user">
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  // Se você precisa de outras lógicas (ex: toggleFavorito) no futuro, adicione-as aqui.
}
