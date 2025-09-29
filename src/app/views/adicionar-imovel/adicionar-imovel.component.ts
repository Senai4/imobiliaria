import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private imovelService: ImovelService,
    public authService: AuthService
  ) {
    this.imovel = this.inicializarImovelVazio();
  }

  ngOnInit(): void {
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
  }

  inicializarImovelVazio(): Imovel {
    const novoImovel = new Imovel(
      0,
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

      this.imovelService.postImovel(this.imovel).subscribe({
        next: (response) => {
          alert('Anúncio salvo e publicado no banco de dados!');
          this.router.navigate(['/corretores']);
        },
        error: (error) => {
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
