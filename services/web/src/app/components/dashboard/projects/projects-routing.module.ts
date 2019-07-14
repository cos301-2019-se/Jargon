import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectInfoComponent } from './project-info/project-info.component';
import { CreateProjectComponent } from '../create-project/create-project.component';

const routes: Routes = [
  { 
    path: '',
    component: ProjectsComponent,    
    children: [
      { path: '', redirectTo: 'project', pathMatch: 'full' },
      { path: 'project', component: ProjectInfoComponent },
      { path: '**', redirectTo: 'project' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
