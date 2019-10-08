import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { GlobalService } from '../global-service/global-service.service';
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { ApiResponse } from '../../interfaces/api-response/api-response';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private globalService: GlobalService,
      private notifierService: NotifierService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.globalService.getTokenValue();
    const isLoggedIn = token != undefined && token != null 
        && token !== "";
    //const isApiUrl = request.url.startsWith(config.apiUrl);
    if (isLoggedIn) {
      request = request.clone({
        setHeaders: {
          "x-access-token": token
        }
      });
    }

    console.log("HttpRequest intercepted. Added token to header");
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          //add success/failure dialog
          // if (event.status == 200) {
          //   console.log("Event 200:", event);
          //   let response: ApiResponse = event.body;
          //   if (response.success == true) {
          //     this.notifierService.notify('success', response.message);
          //   } else {
          //     this.notifierService.notify('error', response.message);
          //   }
          // } else {
          //   let response: ApiResponse = event.body;
          //   this.notifierService.notify('error', response.message);
          // }
        }
        return event;
      }),
      catchError(
        (error: HttpErrorResponse) => {
          console.log(error);
          if (error.status === 0) {
            this.notifierService.notify('error', error.statusText);
          }
          if (error.status === 401) {
            // auto logout if 401 response returned from api
            this.globalService.logout();
            location.reload(true);
            this.notifierService.notify('error', 'Unauthorised. Logging out');
          }

          // const error = err.error.message || err.statusText;
          return throwError(error);
        }
      )
  );
  }
}
