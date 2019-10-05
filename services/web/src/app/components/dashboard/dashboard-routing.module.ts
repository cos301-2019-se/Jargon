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

const routes: Routes = [
  { 
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'projects', pathMatch: 'full' },
      { path: 'projects', loadChildren: './projects/projects.module#ProjectsModule' },
      { path: 'create-project', component: CreateProjectComponent },
      { path: 'compare-project', component: ProjectCompareComponent },
      { path: 'project-result', component: ProjectResultComponent, canActivate: [RefreshGuardService] },

      { path: 'manage-projects', component: AdminManageProjectsComponent },
      { path: 'manage-users', component: AdminManageUsersComponent },
      { path: 'neural-network', component: AdminNeuralNetworkComponent },
      { path: 'user-stats', component: AdminUserStatsComponent },

      { path: '**', redirectTo: 'projects' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
