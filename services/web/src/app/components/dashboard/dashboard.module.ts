import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CreateProjectComponent } from './create-project/create-project.component';
import { DashboardComponent } from './dashboard.component';
import { RefreshGuardService } from '../../services/refresh-guard/refresh-guard.service';
import { ProjectApiRequesterService } from '../../services/project-api-requester/project-api-requester.service';
import { NeuralnetApiRequesterService } from '../../services/neuralnet-api-requester/neuralnet-api-requester.service';
import { SharedProjectService } from '../../services/shared-project/shared-project.service';
import { HistogramSeriesService, LineSeriesService, PieSeriesService, AccumulationDataLabelService, AccumulationAnnotationService, AccumulationTooltipService, AccumulationLegendService, AccumulationChartModule, DateTimeService } from '@syncfusion/ej2-angular-charts';
import { ProjectCompareComponent } from './project-compare/project-compare.component';
import { ChartModule } from '@syncfusion/ej2-angular-charts'; 
import { AdminManageProjectsComponent } from './admin-manage-projects/admin-manage-projects.component';
import { AdminManageUsersComponent } from './admin-manage-users/admin-manage-users.component';
import { AdminNeuralNetworkComponent } from './admin-neural-network/admin-neural-network.component';
import { AdminUserStatsComponent } from './admin-user-stats/admin-user-stats.component';
import { HttpInterceptorService } from '../../services/http-interceptor/http-interceptor.service';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { AdminApiRequesterService } from '../../services/admin-api-requester/admin-api-requester.service';

import { NotifierModule } from 'angular-notifier';
import { rightToLeft } from '@syncfusion/ej2-base';
import { HomeComponent } from './home/home/home.component';
import { StreamComponent } from './stream/stream/stream.component';
import { AnalyseApiRequesterService } from '../../services/analyse-api-requester/analyse-api-requester.service';

@NgModule({
  declarations: [
    DashboardComponent,
    CreateProjectComponent,
    ProjectCompareComponent,
    AdminManageUsersComponent,
    AdminNeuralNetworkComponent,
    AdminUserStatsComponent,
    ViewProfileComponent,
    HomeComponent,
    StreamComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardRoutingModule,
    ChartsModule,
    ChartModule,
    // NotifierModule.withConfig({
    //   position: {
    //     horizontal : {
    //       position: 'right'
    //     },
    //     'vertical': {
    //       position: 'top'
    //     }
    //   }
    // }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    RefreshGuardService,
    ProjectApiRequesterService,
    AdminApiRequesterService,
    NeuralnetApiRequesterService,
    AnalyseApiRequesterService,
    SharedProjectService,
    HistogramSeriesService,
    LineSeriesService,
    PieSeriesService, 
    AccumulationLegendService, 
    AccumulationTooltipService, 
    AccumulationAnnotationService,
    AccumulationDataLabelService,
  ]
})
export class DashboardModule { }
