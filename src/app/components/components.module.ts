import { RegisterNavbarComponent } from './register/register-navbar/register-navbar.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './home/header/header.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.modules';
import { ChartsComponent } from './home/charts/charts.component';
import { EditProjectComponent } from './home/view-projects/edit-project/edit-project.component';
import { CreateProjectComponent } from './home/create-project/create-project.component';
import { ViewProjectsComponent } from './home/view-projects/view-projects.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoginNavbarComponent } from './login/login-navbar/login-navbar.component';
import { SidebarComponent } from './home/sidebar/sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ChartsComponent,
    HomeComponent,
    HeaderComponent,
    FormsModule,
    LoginNavbarComponent,
    RegisterNavbarComponent
  ],
  declarations: [
    ChartsComponent,
    ChartsComponent,
    HomeComponent,
    HeaderComponent,
    EditProjectComponent,
    CreateProjectComponent, 
    ViewProjectsComponent,
    LoginComponent,
    RegisterComponent,
    LoginNavbarComponent,
    RegisterNavbarComponent,
    SidebarComponent
  ]
  ,
    exports: [
      ChartsComponent
    ]
})
export class ChildModule { }
