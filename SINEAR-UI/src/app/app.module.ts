import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//this module is needed to use the angular "HtttpClient" see e.g authentication.service
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
//this module is needed to use the angular "FormBuilder" see e.g authentication.service
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {DatePipe} from '@angular/common';

//see AddHeaderFilter.java accessGranted(...)
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {SessionInterceptor} from './interceptor/session.interceptor';
import {ErrorInterceptor} from './interceptor/error.interceptor';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {MenuComponent} from './shared/menu/menu.component';
import {LoginComponent} from './page/login/login.component';
import {PersonComponent} from './page/person/person.component';
import {ActionsComponent} from './page/actions/actions.component';
import {TopicAreaComponent} from './page/topicArea/topicArea.component';
import {SpinnerComponent} from './shared/spinner/spinner.component';
import {KartComponent} from './page/kart/kart.component';



import {NewPersonDialog} from './dialog/newPerson/newPerson.dialog';
import {EditPersonDialog} from './dialog/editPerson/editPerson.dialog';
import {NewActionDialog} from './dialog/newAction/newAction.dialog';
import {EditActionDialog} from './dialog/editAction/editAction.dialog';
import {CopyActionDialog} from './dialog/copyAction/copyAction.dialog';
import {NewTopicAreaDialog} from './dialog/newTopicArea/newTopicArea.dialog';
import {ConfirmDialog} from './dialog/confirm/confirm.dialog';
import {PopUpDialog} from './dialog/popUp/popUp.dialog';
import {MaterialModule} from './material-module';

import {CtrlQDirective} from './directives/crtl-q.directive';

//import {NoopAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ActionsComponent,
    MenuComponent,
    LoginComponent,
    PersonComponent,
    TopicAreaComponent,
    KartComponent,
    PopUpDialog,
    NewPersonDialog,
    EditPersonDialog,
    NewActionDialog,
    EditActionDialog,
    NewTopicAreaDialog,
    ConfirmDialog,
    CopyActionDialog,
    SpinnerComponent,
    CtrlQDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    //NoopAnimationsModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: SessionInterceptor, multi: true}, 
    DatePipe],
  bootstrap: [AppComponent],
  entryComponents: [PopUpDialog, ConfirmDialog, NewPersonDialog, EditPersonDialog,  NewActionDialog, EditActionDialog, CopyActionDialog, NewTopicAreaDialog]
})
export class AppModule { }
