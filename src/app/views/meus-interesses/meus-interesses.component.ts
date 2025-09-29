import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { InteresseService } from 'src/app/services/interesse.service';
import { ImovelService } from 'src/app/services/imovel.service';

@Component({
  selector: 'meus-interesses',
  templateUrl: './meus-interesses.component.html',
  styleUrls: ['./meus-interesses.component.scss'],
})
export class MeusInteressesComponent implements OnInit {
  // Menu
  menuAtivo = false;
  @ViewChild('menu') menuElement!: ElementRef;
  @ViewChild('menuIcon') menuIcon!: ElementRef;

  // Login
  isLoggedIn = false;
  userName = '';
  isAdmin = false;
  userId!: number;

  // Interesses e imóveis
  interessesCliente: any[] = [];
  imoveisFavoritos: any[] = [];
  
  constructor(
    public authService: AuthService,
    private interesseService: InteresseService,
    private imovelService: ImovelService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
      if (this.isLoggedIn && user) {
        this.userName = user.nome;
        this.isAdmin = user.perfil === 'admin';
        this.userId = user.id as any;

        // Carrega interesses do cliente
        this.loadInteresses();
      } else {
        this.userName = '';
        this.isAdmin = false;
        this.userId = 0;
        this.interessesCliente = [];
        this.imoveisFavoritos = [];
      }
    });
  }

  // Função para abrir/fechar menu
  toggleMenu() {
    this.menuAtivo = !this.menuAtivo;
  }

  // Fecha menu ao clicar fora
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

  removerFavorito(imovelId: number) {
    if (!this.userId) return;

    const interesseExistente = this.interessesCliente.find(
      (i: any) => i.imovelId === imovelId
    );

    if (!interesseExistente || !interesseExistente.id) {
      console.error('Interesse não encontrado ou sem ID para remoção.');
      return;
    }

    this.interesseService.removeInteresse(interesseExistente.id).subscribe({
      next: () => {
        console.log(
          `Interesse ID ${interesseExistente.id} removido com sucesso.`
        );

        this.loadInteresses();
      },
      error: (err) => console.error('Erro ao remover interesse:', err),
    });
  }

  loadInteresses() {
    if (!this.userId) return;

    this.interesseService.getInteressesByCliente(this.userId).subscribe({
      next: (res) => {
        this.interessesCliente = res;
        console.log('Interesses recebidos:', this.interessesCliente);

        this.imovelService.getImovel().subscribe({
          next: (imoveis) => {
            const idsFavoritos = this.interessesCliente.map((i) =>
              Number(i.imovelId)
            );
            this.imoveisFavoritos = imoveis.filter((i) =>
              idsFavoritos.includes(Number(i.id))
            );
            console.log('Interesses que vieram da API (IDs):', idsFavoritos);
            console.log('Imóveis que foram carregados:', this.imoveisFavoritos);
          },
          error: (err) => console.error('Erro ao carregar imóveis', err),
        });
      },
      error: (err) => console.error('Erro ao carregar interesses', err),
    });
  }
}
