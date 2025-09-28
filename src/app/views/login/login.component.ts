import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  credenciais = {
    email: '',
    senha: '',
  };

  mensagemErro: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  exibirMensagemDeErro(mensagem: string, duracao = 2000) {
    this.mensagemErro = mensagem;

    //temporizador para limpar a mensagem após a duração especificada
    setTimeout(() => {
      this.mensagemErro = '';
    }, duracao);
  }

  fazerLogin() {
    if (!this.credenciais.email || !this.credenciais.senha) {
      this.exibirMensagemDeErro('Por favor, preencha todos os campos.');
      return;
    }

    this.authService.login(this.credenciais).subscribe({
      next: (loginSuccess: boolean) => {
        if (loginSuccess) {
          console.log('Login bem-sucedido!');
          const usuarioAtual = this.authService.usuarioAtual();
          if (usuarioAtual && usuarioAtual.perfil === 'admin') {
            this.router.navigate(['/pagina-adm']);
          } else {
            this.router.navigate(['/imovel']);
          }
        } else {
          this.exibirMensagemDeErro('Credenciais inválidas. Tente novamente.');
        }
      },
      error: (err: any) => {
        this.exibirMensagemDeErro(
          'Ocorreu um erro ao conectar com o servidor. Tente mais tarde.'
        );
        console.error('Ocorreu um erro no login:', err);
      },
    });
  }

  irParaImovel() {
    this.router.navigate(['/imovel']);
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro']);
  }
}
