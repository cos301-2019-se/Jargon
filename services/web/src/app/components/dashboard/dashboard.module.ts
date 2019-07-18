import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CreateProjectComponent } from './create-project/create-project.component';
import { DashboardComponent } from './dashboard.component';
import { RefreshGuardService } from '../../services/refresh-guard/refresh-guard.service';
import { ProjectApiRequesterService } from '../../services/project-api-requester/project-api-requester.service';
import { NeuralnetApiRequesterService } from '../../services/neuralnet-api-requester/neuralnet-api-requester.service';
import { SharedProjectService } from '../../services/shared-project/shared-project.service';

@NgModule({
  declarations: [
    DashboardComponent,
    CreateProjectComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardRoutingModule,
    ChartsModule
  ],
  providers: [
    RefreshGuardService,
    ProjectApiRequesterService,
    NeuralnetApiRequesterService,
    SharedProjectService
  ]
})
export class DashboardModule { }
