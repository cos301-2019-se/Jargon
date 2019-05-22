import { EditProjectComponent } from './components/view-projects/edit-project/edit-project.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { ViewProjectsComponent } from './components/view-projects/view-projects.component';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './components/home/projects/projects.component';
import { ChartsComponent } from './components/home/charts/charts.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';

const appRoutes: Routes = [
  { path: '' , component: HomeComponent},
  { path: 'view-projects', component: ViewProjectsComponent },
  { path: 'create-project', component: CreateProjectComponent }
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
    EditProjectComponent
  ],
  exports: [
    ChartsComponent,
    ProjectsComponent,
    EditProjectComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
