import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.modules';
import { ChartsComponent } from './home/charts/charts.component';
import { ProjectsComponent } from './home/projects/projects.component';


@NgModule({
  imports: [
    CommonModule, SharedModule, ChartsComponent, HomeComponent, HeaderComponent, ProjectsComponent
  ],
  declarations: [ChartsComponent, ProjectsComponent, ChartsComponent, HomeComponent, HeaderComponent]
  ,
    exports: []
})
export class ChildModule { }
