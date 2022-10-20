import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => { 
        if (error) {
          console.log(error.status);
          switch(error.status) {
            case 400: 
            if(error.error.errors) {
              const modalStateErrors = [];
              for (const key in error.error.errors) {
                if (error.error.errors) {
                  modalStateErrors.push(error.error.errors[key])
                }
              }
              //this.toastr.error(modalStateErrors.flat().join());  
              for (const key in modalStateErrors.flat()) {
                this.toastr.error(modalStateErrors.flat()[key]);
              }
         
              throw modalStateErrors.flat();
            } else {
              this.toastr.error(error.statusText, error.status);           
            }
            break;
            case 401:
              console.log('401');
              this.toastr.error(error.statusText, error.status);              
              break;
            case 404:
              console.log('404');
              this.router.navigateByUrl('/not-found');
              break;
            case 500: 
               console.log('500');
              const navigationExtras: NavigationExtras = { state: {error: error.error}} 
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;          
            default: 
            this.toastr.error('Unexpected error');
            console.log(error);
            break;
          }
        }
        console.log('deu ruim');
        return throwError(error);
      })
    );
  }
}
