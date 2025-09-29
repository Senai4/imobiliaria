import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; 
import { Imovel, CaracteristicasImovel } from 'src/app/models/imovel.model';

import { ImovelService } from 'src/app/services/imovel.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-adicionar-imovel',
  templateUrl: './adicionar-imovel.component.html',
  styleUrls: ['./adicionar-imovel.component.scss']
})
export class AdicionarImovelComponent implements OnInit {

  imovel: Imovel;
  isEditing: boolean = false;

  corretorNome: string = 'Corretor';
  isLoggedIn = false;
  isAdmin = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private imovelService: ImovelService,
    public authService: AuthService
  ) {
    this.imovel = this.inicializarImovelVazio();
  }

  ngOnInit(): void {
    // Lógica do Usuário
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
      if (this.isLoggedIn && user) {
        this.corretorNome = user.nome;
        this.isAdmin = user.perfil === 'admin';
      } else {
        this.corretorNome = 'Corretor';
        this.isAdmin = false;
      }
    });

    this.route.paramMap.subscribe(params => {
      const imovelId = params.get('id');
      if (imovelId) {
        this.isEditing = true;
        this.loadImovelParaEdicao(imovelId);
      }
    });
  }

  loadImovelParaEdicao(id: string): void {
    this.imovelService.getImovelById(id).subscribe({
      next: (imovel: Imovel) => {
        this.imovel = imovel;
      },
      error: (err) => {
        console.error('Erro ao carregar imóvel para edição:', err);
        alert('Erro ao carregar os dados do imóvel. Verifique a URL.');
        this.router.navigate(['/corretores']);
      }
    });
  }

  inicializarImovelVazio(): Imovel {
    const novoImovel = new Imovel(
      undefined as any,
      '',
      '',
      '',
      '',
      undefined as any,
      undefined as any,
      '',
      '',
      '',
      undefined as any,
      undefined as any,
      undefined as any,
      undefined as any,
      {
        quartos: undefined as any,
        banheiros: undefined as any,
        tamanho: undefined as any,
        vagas: undefined as any,
        mobilia: '',
        pet: '',
      } as CaracteristicasImovel
    );

    novoImovel.total = undefined;

    return novoImovel;
  }

  onSubmit(form: any): void {
    if (form.valid) {
      this.imovel.aluguel = Number(this.imovel.aluguel) || 0;
      this.imovel.total = Number(this.imovel.total) || 0;

      const observable = this.isEditing
        ? this.imovelService.putImovel(this.imovel.id, this.imovel)
        : this.imovelService.postImovel(this.imovel);

      observable.subscribe({
        next: (response) => {
          const mensagem = this.isEditing ? 'alterado' : 'criado';
          alert(`Anúncio ${mensagem} com sucesso!`);
          this.router.navigate(['/corretores']);
        },
        error: (error) => {
          console.error('Erro ao salvar o anúncio:', error);
          alert('Erro ao salvar o anúncio. Verifique o console para detalhes.');
        }
      });
    } else {
      alert('Por favor, preencha todos os campos obrigatórios do formulário.');
    }
  }

  onCancel(): void {
    this.router.navigate(['/corretores']);
  }
}
