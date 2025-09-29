import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImovelService } from 'src/app/services/imovel.service';
import { Imovel } from 'src/app/models/imovel.model'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  imoveisDestaque: Imovel[] = [];

  constructor(
    private router: Router,
    private imovelService: ImovelService
  ) {}

  ngOnInit(): void {
    this.carregarDestaquesSimulados();
  }

  carregarDestaquesSimulados(): void {
    this.imovelService.getImovel().subscribe({
      next: (data) => {
        this.imoveisDestaque = data.slice(0, 6);
      },
      error: (err) => {
        console.error('Erro ao carregar imóveis:', err);
      }
    });
  }

  irParaLogin(): void {
    this.router.navigate(['/login']);
  }
}
