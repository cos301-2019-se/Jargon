import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectResultComponent } from './projects/project-result/project-result.component';
import { ProjectCompareComponent } from './project-compare/project-compare.component';
import { AdminUserStatsComponent } from './admin-user-stats/admin-user-stats.component';
import { AdminNeuralNetworkComponent } from './admin-neural-network/admin-neural-network.component';
import { AdminManageUsersComponent } from './admin-manage-users/admin-manage-users.component';
import { AuthGuardService } from '../../services/auth-guard/auth-guard.service';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { HomeComponent } from './home/home/home.component';
import { StreamComponent } from './stream/stream/stream.component';

const routes: Routes = [
  { 
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
      { path: 'projects', loadChildren: './projects/projects.module#ProjectsModule', canActivate: [AuthGuardService] },
      { path: 'create-project', component: CreateProjectComponent, canActivate: [AuthGuardService] },
      { path: 'compare-project', component: ProjectCompareComponent, canActivate: [AuthGuardService] },
      { path: 'project-result', component: ProjectResultComponent, canActivate: [AuthGuardService] },
      { path: 'view-profile', component: ViewProfileComponent, canActivate: [AuthGuardService] },

      { path: 'stream', component: StreamComponent },

      { path: 'manage-projects', loadChildren: './admin-manage-projects/admin-manage-projects.module#AdminManageProjectsModule', canActivate: [AuthGuardService] },
      { path: 'manage-users', component: AdminManageUsersComponent, canActivate: [AuthGuardService] },
      { path: 'neural-network', component: AdminNeuralNetworkComponent, canActivate: [AuthGuardService] },
      { path: 'user-stats', component: AdminUserStatsComponent, canActivate: [AuthGuardService] },

      { path: '**', redirectTo: 'home' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
