import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { CadastroComponent } from './views/cadastro/cadastro.component';
import { ImovelComponent } from './views/imovel/imovel.component';
import { MeusInteressesComponent } from './views/meus-interesses/meus-interesses.component';
import { CorretoresComponent } from './views/corretores/corretores.component';
import { FooterComponent } from './templates/footer/footer.component';
import { HeaderComponent } from './templates/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DetalhesComponent } from './views/detalhes/detalhes.component';
import { AdicionarImovelComponent } from './views/adicionar-imovel/adicionar-imovel.component';
import { InteressadosComponent } from './views/interessados/interessados.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    CadastroComponent,
    ImovelComponent,
    MeusInteressesComponent,
    CorretoresComponent,
    FooterComponent,
    HeaderComponent,
    DetalhesComponent,
    AdicionarImovelComponent,
    InteressadosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule, 
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
