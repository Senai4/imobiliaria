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

@Component({
  selector: 'app-imovel',
  templateUrl: './imovel.component.html',
  styleUrls: ['./imovel.component.scss']
})
export class ImovelComponent implements OnInit {
  menuAtivo = false;
  isLoggedIn = false;
  userName = '';
  isAdmin = false;

  imoveis: Imovel[] = [];

  @ViewChild('menu') menuElement!: ElementRef;
  @ViewChild('menuIcon') menuIcon!: ElementRef;
isInteresse: any;
toggleInteresse: any;

  constructor(
    public authService: AuthService,
    private imovelService: ImovelService
  ) {}

  ngOnInit(): void {
    // Observa mudanças de login
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
      if (this.isLoggedIn) {
        this.userName = user.nome;
        this.isAdmin = user.perfil === 'admin';
      } else {
        this.userName = '';
        this.isAdmin = false;
      }
    });
    // Carrega imóveis
    this.imovelService.getImovel().subscribe((dados) => {
      this.imoveis = dados;
    });
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
}
