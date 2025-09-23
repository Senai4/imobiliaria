import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { ImovelComponent } from './views/imovel/imovel.component';
import { CadastroComponent } from './views/cadastro/cadastro.component';
import { LoginComponent } from './views/login/login.component';
import { MeusInteressesComponent } from './views/meus-interesses/meus-interesses.component';
import { CorretoresComponent } from './views/corretores/corretores.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'imovel', component: ImovelComponent },
  { path: 'meus-interesses', component: MeusInteressesComponent },
  { path: 'corretores', component: CorretoresComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'home', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
