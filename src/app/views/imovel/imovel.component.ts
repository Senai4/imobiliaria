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
  menuAtivo = false;
  isLoggedIn = false;
  userName = '';
  isAdmin = false;

  imoveis: Imovel[] = [];
  interessesCliente: Interesse[] = [];
  userId!: number;

  @ViewChild('menu') menuElement!: ElementRef;
  @ViewChild('menuIcon') menuIcon!: ElementRef;
  router: any;

  constructor(
    public authService: AuthService,
    private imovelService: ImovelService,
    private interesseService: InteresseService
  ) {}

  ngOnInit(): void {
    // Observa login do usuário
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
      if (this.isLoggedIn && user) {
        this.userName = user.nome;
        this.isAdmin = user.perfil === 'admin';
        this.userId = user.id as any;

        // Carrega interesses do cliente
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

    // Carrega imóveis
    this.imovelService.getImovel().subscribe((dados) => (this.imoveis = dados));
  }

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

  // Verifica se imóvel já é favorito
  isFavorito(imovelId: number): boolean {
    return this.interessesCliente.some((i) => i.imovelId === imovelId);
  }

  // Adiciona ou remove interesse
  toggleFavorito(imovelId: number) {
    console.log('Clicou no favorito:', imovelId);
    if (!this.userId) return;

    const interesseExistente = this.interessesCliente.find(
      (i) => i.imovelId === imovelId
    );

    if (interesseExistente) {
      this.interesseService.removeInteresse(interesseExistente.id!).subscribe({
        next: () => {
          this.interessesCliente = this.interessesCliente.filter(
            (i) => i.imovelId !== imovelId
          );
        },
        error: (err) => console.error('Erro ao remover interesse', err),
      });
    } else {
      const novo: Interesse = { clienteId: this.userId, imovelId };
      this.interesseService.addInteresse(novo).subscribe({
        next: (res) => this.interessesCliente.push(res),
        error: (err) => console.error('Erro ao adicionar interesse', err),
      });
    }
  }
}
