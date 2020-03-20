import {Component} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  targetedSubmenu: string = "four";
  
  constructor(public authenticationService: AuthenticationService) {}

  onClick(e) {
   
    this.targetedSubmenu = e.target.parentElement.id != "" ? e.target.parentElement.id  : e.target.parentElement.parentElement.parentElement.id;
    return;
  }
}