import { Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from "@angular/material";
import {AuthenticationService} from '../../services/authentication.service';
import {DatabaseService} from '../../services/database.service';
import {PopUpDialog} from '../../dialog/popUp/popUp.dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  username: string = "admin";
  password: string = "salt";

  loadingPassword = false;
  returnUrl: string;
  errorPassword = '';
  isWait: boolean = false;
  hide: boolean = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService,
    private readonly databaseService: DatabaseService,
    private dialog: MatDialog){
      // redirect to home if already logged in
      if (this.authenticationService.currentUserValue) {
          this.router.navigate(['/']);
        }
  }

  ngOnInit(){
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {

    this.authenticationService.login(this.username, this.password)
    .subscribe(
      data => {

        this.router.navigate(['/aktionen']);
      },
      error => {
        this.errorPassword = error.status === 404 ? 'Benutzername oder Passwort nicht korrekt.' : `Server ist nicht gestartet.`;
        this.loadingPassword = false;
      });
  }

  resetPW(){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = "400px";
    dialogConfig.width = "600px";

    this.dialog.open(PopUpDialog, dialogConfig);
  }

}
