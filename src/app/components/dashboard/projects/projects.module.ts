import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectInfoComponent } from './project-info/project-info.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectInfoComponent
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule
  ]
})
export class ProjectsModule { }
