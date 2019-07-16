import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectResultComponent } from './projects/project-result/project-result.component';

const routes: Routes = [
  { 
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'projects', pathMatch: 'full' },
      { path: 'projects', loadChildren: './projects/projects.module#ProjectsModule' },
      // { path: 'create-project', component: CreateProjectComponent },
      { path: 'create-project', component: ProjectResultComponent },
      { path: '**', redirectTo: 'projects' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
