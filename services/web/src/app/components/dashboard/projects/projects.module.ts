import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectInfoComponent } from './project-info/project-info.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { FormsModule } from '@angular/forms';
import { ProjectResultComponent } from './project-result/project-result.component';
import { ProjectInitialComponent } from './project-initial/project-initial.component';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectInfoComponent,
    ProjectResultComponent,
    ProjectInitialComponent,
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    FormsModule,
  ]
})
export class ProjectsModule { }
