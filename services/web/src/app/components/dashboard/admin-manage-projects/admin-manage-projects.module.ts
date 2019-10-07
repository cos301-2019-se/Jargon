import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { ChartModule, AccumulationChartModule, AccumulationDataLabelService, AccumulationAnnotationService, AccumulationTooltipService, AccumulationLegendService, PieSeriesService, LineSeriesService, HistogramSeriesService, DateTimeService  } from '@syncfusion/ej2-angular-charts';
import { HttpClientModule } from '@angular/common/http';
import { AdminManageProjectsComponent } from './admin-manage-projects.component';
import { AdminManageProjectsRoutingModule } from './admin-manage-projects-routing.module';
import { AdminManageProjectInfoComponent } from './admin-manage-project-info/admin-manage-project-info.component';
import { AdminManageProjectInitialComponent } from './admin-manage-project-initial/admin-manage-project-initial.component';
@NgModule({
  declarations: [
    AdminManageProjectsComponent,
    AdminManageProjectInfoComponent,
    AdminManageProjectInitialComponent,
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    AdminManageProjectsRoutingModule,
    FormsModule,
    ChartsModule,
    ChartModule,
    AccumulationChartModule
  ],
  providers: [
    DateTimeService
  ]
})
export class AdminManageProjectsModule { }
