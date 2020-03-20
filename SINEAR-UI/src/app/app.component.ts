import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Observable } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'amep-ui';

  showSidebar$: Observable<boolean>;
  private defaultShowSidebar = true;

  private isWait: boolean;

  constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute){
      this.showSidebar$ = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => activatedRoute),
      map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap(route => route.data),
        map(data => data.hasOwnProperty('showSidebar') ? data.showSidebar : this.defaultShowSidebar),
      )
    }
}
