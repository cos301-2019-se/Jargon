import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.modules';
import { ChartsComponent } from './home/charts/charts.component';
import { ProjectsComponent } from './home/projects/projects.component';
import { EditProjectComponent } from './view-projects/edit-project/edit-project.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ViewProjectsComponent } from './view-projects/view-projects.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ChartsComponent,
    HomeComponent,
    HeaderComponent,
    ProjectsComponent,
    FormsModule
  ],
  declarations: [
    ChartsComponent,
    ProjectsComponent,
    ChartsComponent,
    HomeComponent,
    HeaderComponent,
    EditProjectComponent,
    CreateProjectComponent,
    ViewProjectsComponent
  ]
  ,
    exports: []
})
export class ChildModule { }
