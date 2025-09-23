import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  esconderHeaderFooter = false;
  isHomePage: any;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Adicione todas as rotas que NÃO devem mostrar header/footer
        this.esconderHeaderFooter = ['/login', '/cadastro', '/vagas'].includes(
          event.urlAfterRedirects
        );
      }
    });
  }
}
