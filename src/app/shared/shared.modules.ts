import { ProjectsComponent } from './../components/home/projects/projects.component';
import { ChartsComponent } from './../components/home/charts/charts.component';
import { HomeComponent } from './../components/home/home.component';
import { NgModule } from '@angular/core';
import { Chart } from 'chart.js';

@NgModule({
  imports: [
    ProjectsComponent, ChartsComponent
  ],
  exports: [
    ,
  ],
  declarations: []
})
export class SharedModule { }
