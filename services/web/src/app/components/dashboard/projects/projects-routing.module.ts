import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectInfoComponent } from './project-info/project-info.component';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { ProjectResultComponent } from './project-result/project-result.component';
import { NoInfoComponent } from './no-info/no-info.component';

const routes: Routes = [
  { 
    path: '',
    component: ProjectsComponent,    
    children: [
      { path: '', redirectTo: 'no-info', pathMatch: 'full' },
      { path: 'no-info', component: NoInfoComponent },
      { path: 'project-info/:id', component: ProjectInfoComponent },
      { path: 'project-result', component: ProjectResultComponent },
      // { path: '**', redirectTo: 'project-info' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
