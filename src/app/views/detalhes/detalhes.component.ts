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
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
