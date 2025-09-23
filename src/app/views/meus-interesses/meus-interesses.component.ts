import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'meus-interesses',
  templateUrl: './meus-interesses.component.html',
  styleUrls: ['./meus-interesses.component.scss'],
})
export class MeusInteressesComponent implements OnInit {
  menuAtivo = false;
  isLoggedIn = false;
  userName = '';
  isAdmin = false;

  @ViewChild('menu') menuElement!: ElementRef;
  @ViewChild('menuIcon') menuIcon!: ElementRef;

  constructor(public authService: AuthService) {}

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
