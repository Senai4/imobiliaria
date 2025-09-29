import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener
} from '@angular/core';
import { Router } from '@angular/router';
import { ImovelService } from 'src/app/services/imovel.service';
import { AuthService } from 'src/app/services/auth.service';
import { Imovel } from 'src/app/models/imovel.model';

@Component({
  selector: 'app-corretores',
  templateUrl: './corretores.component.html',
  styleUrls: ['./corretores.component.scss']
})
export class CorretoresComponent implements OnInit {

  meusImoveis: Imovel[] = [];
  corretorNome: string = 'Corretor';
  menuAtivo = false;
  isLoggedIn = false;
  isAdmin = false;

  @ViewChild('menu') menuElement!: ElementRef;
  @ViewChild('menuIcon') menuIcon!: ElementRef;

  constructor(
    private imovelService: ImovelService,
    public authService: AuthService,
    private router: Router
  ) { }

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

    this.carregarImoveis();
  }

  // --- Métodos de Menu ---
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

  // Método de Logout
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

 carregarImoveis(): void {
  this.imovelService.getMeusImoveis().subscribe({
    next: (imoveis) => {
      this.meusImoveis = imoveis;
    },
    error: (err) => {
      console.error('Erro ao carregar imóveis:', err);
    }
  });
}

  cadastrarNovo(): void {
  }

  editarImovel(imovelId: string | number): void {
  this.router.navigate([`/editar-imovel/${imovelId}`]);
}

excluirImovel(imovelId: string | number): void {
  if (confirm('Tem certeza que deseja excluir este imóvel?')) {
    this.imovelService.deleteImovel(imovelId).subscribe({
      next: () => {
        this.meusImoveis = this.meusImoveis.filter(i => i.id !== imovelId);
      },
      error: (err) => {
        console.error('Erro ao excluir imóvel:', err);
      }
    });
  }
}

  iradicionarImovel() {
    this.router.navigate(['/adicionar-imovel']);
  }

  interessados() {
    this.router.navigate(['/interessados']);
  }
}
