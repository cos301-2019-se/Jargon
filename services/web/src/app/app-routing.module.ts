import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RefreshGuardService } from './services/refresh-guard/refresh-guard.service';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },                                  
  { path: 'register', component: RegisterComponent },                            
  { path: 'dashboard', loadChildren: './components/dashboard/dashboard.module#DashboardModule'}, 
      // canActivate: [AuthGuardService] },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
