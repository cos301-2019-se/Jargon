import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectResultComponent } from './projects/project-result/project-result.component';
import { RefreshGuardService } from '../../services/refresh-guard/refresh-guard.service';
import { ProjectCompareComponent } from './project-compare/project-compare.component';
import { AdminUserStatsComponent } from './admin-user-stats/admin-user-stats.component';
import { AdminNeuralNetworkComponent } from './admin-neural-network/admin-neural-network.component';
import { AdminManageUsersComponent } from './admin-manage-users/admin-manage-users.component';
import { AdminManageProjectsComponent } from './admin-manage-projects/admin-manage-projects.component';
import { AuthGuardService } from '../../services/auth-guard/auth-guard.service';

const routes: Routes = [
  { 
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'projects', pathMatch: 'full' },
      { path: 'projects', loadChildren: './projects/projects.module#ProjectsModule', canActivate: [AuthGuardService] },
      { path: 'create-project', component: CreateProjectComponent, canActivate: [AuthGuardService] },
      { path: 'compare-project', component: ProjectCompareComponent, canActivate: [AuthGuardService] },
      { path: 'project-result', component: ProjectResultComponent, canActivate: [AuthGuardService] },

      { path: 'manage-projects', component: AdminManageProjectsComponent, canActivate: [AuthGuardService] },
      { path: 'manage-users', component: AdminManageUsersComponent, canActivate: [AuthGuardService] },
      { path: 'neural-network', component: AdminNeuralNetworkComponent, canActivate: [AuthGuardService] },
      { path: 'user-stats', component: AdminUserStatsComponent, canActivate: [AuthGuardService] },

      { path: '**', redirectTo: 'projects' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
