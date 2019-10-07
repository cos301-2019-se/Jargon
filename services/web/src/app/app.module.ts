import { LoginNavbarComponent } from './components/login/login-navbar/login-navbar.component';
import { RegisterNavbarComponent } from './components/register/register-navbar/register-navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule } from 'ng2-charts';
import { LoginApiRequesterService } from './services/login-api-requester/login-api-requester.service';
import { RegisterApiRequesterService } from './services/register-api-requester/register-api-requester.service';
import { GlobalService } from './services/global-service/global-service.service';
import { NotifierModule } from 'angular-notifier';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LoginNavbarComponent,
    RegisterNavbarComponent,
  ],
  exports: [
    LoginNavbarComponent,
    RegisterNavbarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    ChartsModule,
    NotifierModule.withConfig({
      position: {
        horizontal : {
          position: 'right'
        },
        'vertical': {
          position: 'top'
        }
      }
    }),
    AppRoutingModule,
  ],
  providers: [
    LoginApiRequesterService,
    RegisterApiRequesterService,
    GlobalService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
