import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectInfoComponent } from './project-info/project-info.component';
import { ProjectResultComponent } from './project-result/project-result.component';
import { ProjectInitialComponent } from './project-initial/project-initial.component';
import { RefreshGuardService } from '../../../services/refresh-guard/refresh-guard.service';

const routes: Routes = [
  { 
    path: '',
    component: ProjectsComponent,    
    children: [
      { path: '', redirectTo: 'project-initial', pathMatch: 'full' },
      { path: 'project-initial', component: ProjectInitialComponent },
      { path: 'project-info/:id', component: ProjectInfoComponent, canActivate: [RefreshGuardService] },
      { path: '**', redirectTo: 'project-initial' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
