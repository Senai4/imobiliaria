import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { CorretorGuard } from './guard/corretor.guard';
import { HomeComponent } from './views/home/home.component';
import { ImovelComponent } from './views/imovel/imovel.component';
import { CadastroComponent } from './views/cadastro/cadastro.component';
import { LoginComponent } from './views/login/login.component';
import { MeusInteressesComponent } from './views/meus-interesses/meus-interesses.component';
import { CorretoresComponent } from './views/corretores/corretores.component';
import { DetalhesComponent } from './views/detalhes/detalhes.component';
import { AdicionarImovelComponent } from './views/adicionar-imovel/adicionar-imovel.component';
import { InteressadosComponent } from './views/interessados/interessados.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'imovel', component: ImovelComponent },
  { path: 'meus-interesses', component: MeusInteressesComponent, canActivate: [AuthGuard] },
  { path: 'corretores', component: CorretoresComponent, canActivate: [CorretorGuard] },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'home', component: HomeComponent },
  { path: 'detalhes/:id', component: DetalhesComponent },
  { path: 'imovel/:id', component: ImovelComponent,  canActivate: [CorretorGuard] },
  { path: 'adicionar-imovel', component: AdicionarImovelComponent },
  { path: 'adicionar-imovel/:id', component: AdicionarImovelComponent },
  { path: 'interessados', component: InteressadosComponent},
  { path: 'interessados/:id', component: InteressadosComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
