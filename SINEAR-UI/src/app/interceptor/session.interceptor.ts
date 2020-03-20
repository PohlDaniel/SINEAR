import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse,} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../services/authentication.service';
import {Router} from '@angular/router';
import {tap} from "rxjs/operators";

@Injectable()
export class SessionInterceptor implements HttpInterceptor {
  constructor(
    private readonly authenticationService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.sessionId && currentUser.sessionIdExpiryDate) {
      request = request.clone({headers: request.headers.set('sessionid', currentUser.sessionId)});
    }
    return next.handle(request)
      .pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse && currentUser && currentUser.sessionId && event.headers.get('sessionid') && event.headers.get('sessionid') !== currentUser.sessionId) {
            this.authenticationService.logout();
          }
        }));
  }
}
