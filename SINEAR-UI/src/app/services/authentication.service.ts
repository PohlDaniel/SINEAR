import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Person} from '../model/person';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private readonly currentUserSubject: BehaviorSubject<Person>;
  public currentUser: Observable<Person>;

  headers = new HttpHeaders().set('Content-Type', 'application/json');


  constructor(
    private readonly http: HttpClient,
    private readonly router: Router) {
    this.currentUserSubject = new BehaviorSubject<Person>(JSON.parse(sessionStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Person {
    return this.currentUserSubject.value;
  }

  login(id: string, passwordHash: string) {
    return this.http.post<Person>(environment.baseUrl + '/persons/authenticate', {
      id,
      passwordHash
    }, {headers: this.headers})
      .pipe(map(user => {
        if (user) {
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      }));
  }




  logout() {
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);

    this.router.navigate(['/login']);
  }

}
