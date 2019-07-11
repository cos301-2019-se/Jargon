import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { ViewProjectsComponent } from './view-projects/view-projects.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CreateProjectComponent } from './create-project/create-project.component';
import { EditProjectComponent } from './view-projects/edit-project/edit-project.component';
import { ProjectsComponent } from './view-projects/projects/projects.component';

@NgModule({
  declarations: [
    ViewProjectsComponent,
    CreateProjectComponent,
    EditProjectComponent,
    ProjectsComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class DashboardModule { }
