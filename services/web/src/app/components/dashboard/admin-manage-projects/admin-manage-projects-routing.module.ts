import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RefreshGuardService } from '../../../services/refresh-guard/refresh-guard.service';
import { AuthGuardService } from '../../../services/auth-guard/auth-guard.service';
import { AdminManageProjectsComponent } from './admin-manage-projects.component';
import { AdminManageProjectInfoComponent } from './admin-manage-project-info/admin-manage-project-info.component';
import { AdminManageProjectInitialComponent } from './admin-manage-project-initial/admin-manage-project-initial.component';

const routes: Routes = [
  { 
    path: '',
    component: AdminManageProjectsComponent,    
    children: [
      { path: '', redirectTo: 'project-initial', pathMatch: 'full' },
      { path: 'project-initial', component: AdminManageProjectInitialComponent, canActivate: [AuthGuardService] },
      { path: 'project-info/:id', component: AdminManageProjectInfoComponent, canActivate: [RefreshGuardService] },
      { path: '**', redirectTo: 'project-initial' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminManageProjectsRoutingModule { }
