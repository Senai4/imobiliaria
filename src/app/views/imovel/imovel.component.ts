import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ImovelService } from 'src/app/services/imovel.service';
import { Imovel } from 'src/app/models/imovel.model';
import {
  InteresseService,
  Interesse,
} from 'src/app/services/interesse.service';

@Component({
  selector: 'app-imovel',
  templateUrl: './imovel.component.html',
  styleUrls: ['./imovel.component.scss'],
})
export class ImovelComponent implements OnInit {
  // Variáveis
  menuAtivo = false;
  isLoggedIn = false;
  userName = '';
  isAdmin = false;
  filtroAtivo: boolean = false;

  // Imóveis: lista original (limpa) e lista filtrada (visível)
  // Nota: Usamos 'any' temporariamente aqui para contornar o Index Signature do modelo
  imoveisOriginais: any[] = [];
  imoveis: any[] = [];

  interessesCliente: Interesse[] = [];
  userId!: number;

  @ViewChild('menu') menuElement!: ElementRef;
  @ViewChild('menuIcon') menuIcon!: ElementRef;
  router: any;

  //VARIÁVEIS DO FILTRO
  localizacao: string = '';
  tipoNegocio: string = 'Alugar';
  valor: string = 'Valor';
  tipoImovel: string = 'Tipo de Imóvel';

  constructor(
    public authService: AuthService,
    private imovelService: ImovelService,
    private interesseService: InteresseService
  ) {}

  ngOnInit(): void {
    // Lógica de autenticação e carregamento de interesses
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
      if (this.isLoggedIn && user) {
        this.userName = user.nome;
        this.isAdmin = user.perfil === 'admin';
        this.userId = user.id as any;
        this.interesseService
          .getInteressesByCliente(this.userId)
          .subscribe((res) => (this.interessesCliente = res));
      } else {
        this.userName = '';
        this.isAdmin = false;
        this.userId = 0;
        this.interessesCliente = [];
      }
    });

    this.carregarImoveis();
  }

  carregarImoveis(): void {
    this.imovelService.getImovel().subscribe((dados) => {
      // Limpeza de objetos nulos/undefineds
      const dadosLimpos = dados.filter(item => item !== null && item !== undefined);

      this.imoveisOriginais = dadosLimpos;
      this.imoveis = dadosLimpos;
      console.log('Imóveis originais carregados e limpos. Total:', this.imoveisOriginais.length);
    });
  }

  realizarPesquisa(): void {
    const localizacaoAtiva = this.localizacao && this.localizacao.trim() !== '';
    const valorAtivo = this.valor !== 'Valor';
    const tipoImovelAtivo = this.tipoImovel !== 'Tipo de Imóvel';

    this.filtroAtivo = localizacaoAtiva || valorAtivo || tipoImovelAtivo;


    let listaFiltrada = this.imoveisOriginais.filter(imovel => imovel !== null && imovel !== undefined) as any[];

    if (!this.filtroAtivo) {
        this.imoveis = [...this.imoveisOriginais];
        console.log('Nenhum filtro ativo. Exibindo todos os imóveis.');
        return;
    }

    if (tipoImovelAtivo) {
        const tipoTermo = this.tipoImovel.trim().toLowerCase();
        listaFiltrada = listaFiltrada.filter(
            (imovel) => imovel['tipoImovel'] && String(imovel['tipoImovel']).trim().toLowerCase() === tipoTermo
        );
    }

    if (localizacaoAtiva) {
        const termo = this.localizacao.trim().toLowerCase();
        listaFiltrada = listaFiltrada.filter(
            (imovel) =>
                (imovel['endereco'] && String(imovel['endereco']).toLowerCase().includes(termo)) ||
                (imovel['cidade'] && String(imovel['cidade']).toLowerCase().includes(termo))
        );
    }

    if (valorAtivo) {
        if (this.valor === 'Acima de R$ 5.000') {
            listaFiltrada = listaFiltrada.filter(
                (imovel) => imovel['total'] && Number(imovel['total']) > 5000
            );
        } else {
             const limite = this.valor.includes('1.000') ? 1000 : 5000;
             listaFiltrada = listaFiltrada.filter(
                (imovel) => imovel['total'] && Number(imovel['total']) <= limite
            );
        }
    }

    this.imoveis = listaFiltrada;
    console.log(`Filtro concluído. ${this.imoveis.length} imóveis encontrados.`);
}

  // Métodos
  toggleMenu() {
    this.menuAtivo = !this.menuAtivo;
  }

  @HostListener('document:click', ['$event'])
  clickFora(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      this.menuElement &&
      this.menuIcon &&
      !this.menuElement.nativeElement.contains(target) &&
      !this.menuIcon.nativeElement.contains(target)
    ) {
      this.menuAtivo = false;
    }
  }

   // Lógica de favoritos
  isFavorito(imovelId: number): boolean {
    return this.interessesCliente.some((i) => i.imovelId.toString() === imovelId.toString());
  }

  toggleFavorito(imovelId: number) {
    if (!this.userId) return;

    const interesseExistente = this.interessesCliente.find(
      (i) => i.imovelId.toString() === imovelId.toString()
    );

    if (interesseExistente) {
      this.interesseService.removeInteresse(interesseExistente.id!).subscribe({
        next: () => {
          this.interessesCliente = this.interessesCliente.filter(
            (i) => i.imovelId.toString() !== imovelId.toString()
          );
        },
        error: (err) => console.error('Erro ao remover interesse', err),
      });
    } else {
      const novo: Interesse = { clienteId: this.userId, imovelId: imovelId as any };
      this.interesseService.addInteresse(novo).subscribe({
        next: (res) => this.interessesCliente.push(res),
        error: (err) => console.error('Erro ao adicionar interesse', err),
      });
    }
  }

limparFiltros(): void {
    this.localizacao = '';
    this.valor = 'Valor';
    this.tipoImovel = 'Tipo de Imóvel';
    this.tipoNegocio = 'Alugar';

    this.filtroAtivo = false;

    this.imoveis = [...this.imoveisOriginais];

    console.log('Filtros limpos. Exibindo todos os imóveis.');
  }
}
