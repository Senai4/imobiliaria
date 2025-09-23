// src/app/views/cadastro/cadastro.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent {
  dadosCadastro = {
    nome: '',
    email: '',
    senha: '',
    perfil: 'usuario',
  };

  // Variáveis para exibir mensagens de status
  mensagemStatus: string = '';
  isErro: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  // Função para exibir a mensagem e fazê-la desaparecer
  exibirMensagem(mensagem: string, isErro: boolean = false, duracao = 3000) {
    this.mensagemStatus = mensagem;
    this.isErro = isErro;
    setTimeout(() => {
      this.mensagemStatus = '';
    }, duracao);
  }

  fazerCadastro() {
    this.mensagemStatus = ''; // Limpa a mensagem anterior

    if (
      !this.dadosCadastro.nome ||
      !this.dadosCadastro.email ||
      !this.dadosCadastro.senha
    ) {
      // Mensagem de erro para campos vazios
      this.exibirMensagem('Por favor, preencha todos os campos.', true);
      return;
    }

    this.authService.registrar(this.dadosCadastro).subscribe({
      next: (res) => {
        // Mensagem de sucesso
        console.log('Usuário registrado com sucesso!', res);
        this.exibirMensagem('Cadastro realizado com sucesso!', false, 5000);

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err: any) => {
        // Mensagem de erro para falha na API (ex: e-mail já cadastrado)
        console.error('Erro no cadastro:', err);
        this.exibirMensagem(`Erro no cadastro: ${err.message}`, true);
      },
    });
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }
}
