import { LoginNavbarComponent } from './components/login/login-navbar/login-navbar.component';
import { RegisterNavbarComponent } from './components/register/register-navbar/register-navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { EditProjectComponent } from './components/view-projects/edit-project/edit-project.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { ViewProjectsComponent } from './components/view-projects/view-projects.component';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './components/home/projects/projects.component';
import { ChartsComponent } from './components/home/charts/charts.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';


const appRoutes: Routes = [
  { path: '' , component: HomeComponent},
  { path: 'home', component: HomeComponent },
  { path: 'view-projects', component: ViewProjectsComponent },
  { path: 'create-project', component: CreateProjectComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    ChartsComponent,
    ProjectsComponent,
    ViewProjectsComponent,
    CreateProjectComponent,
    EditProjectComponent,
    RegisterComponent,
    LoginNavbarComponent,
    RegisterNavbarComponent,
  ],
  exports: [
    ChartsComponent,
    ProjectsComponent,
    EditProjectComponent,
    HomeComponent,
    LoginNavbarComponent,
    RegisterNavbarComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    ChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
