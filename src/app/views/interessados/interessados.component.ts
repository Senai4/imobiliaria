import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InteressadosService } from 'src/app/services/interessados.service';
import { InteressadoTela } from 'src/app/models/interessado.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-interessados',
  templateUrl: './interessados.component.html',
  styleUrls: ['./interessados.component.scss']
})
export class InteressadosComponent implements OnInit {

  tituloAnuncio: string = 'Carregando...';
  interessados: InteressadoTela[] = [];
  imovelId: string | null = null;
  carregando: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private interessadosService: InteressadosService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.imovelId = this.route.snapshot.paramMap.get('id');

    if (this.imovelId) {
      this.carregarDados(this.imovelId);
    } else {
      this.tituloAnuncio = 'ID do Imóvel não encontrado na rota.';
      this.carregando = false;
    }
  }

  carregarDados(id: string): void {
    this.carregando = true;

    this.interessadosService.getTituloImovel(id).subscribe({
      next: (titulo) => {
        this.tituloAnuncio = titulo;
      },
      error: () => {
        this.tituloAnuncio = 'Imóvel não encontrado.';
      }
    });

    this.interessadosService.getInteressadosDoImovel(id).subscribe({
      next: (interessadosLista) => {
        this.interessados = interessadosLista;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao buscar interessados:', err);
        this.carregando = false;
      }
    });
  }
}
