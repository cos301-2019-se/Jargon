import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CreateProjectComponent } from './create-project/create-project.component';
import { DashboardComponent } from './dashboard.component';
import { RefreshGuardService } from '../../services/refresh-guard/refresh-guard.service';

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
  ],
  providers: [
    RefreshGuardService
  ]
})
export class DashboardModule { }
