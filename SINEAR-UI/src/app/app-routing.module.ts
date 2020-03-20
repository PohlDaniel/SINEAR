import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ActionsComponent} from './page/actions/actions.component';
import {AuthGuard} from './guard/auth.guard';
import {PersonComponent} from './page/person/person.component';
import {LoginComponent} from './page/login/login.component';
import {Role} from './model/role.enum';
import {TopicAreaComponent} from './page/topicArea/topicArea.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data : { showSidebar: false }
  },
  {
    path: 'persons',
    component: PersonComponent,
    canActivate: [AuthGuard],
    data : { showSidebar: true }
  },
  {
    path: 'actions',
    component: ActionsComponent,
    canActivate: [AuthGuard],
    data : { showSidebar: true }
  },
  {
    path: 'topicareas',
    component: TopicAreaComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.ADMIN, Role.ACTION_MANAGER]}
  },
  {
    path: 'tmp1',
    component: TopicAreaComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.ADMIN, Role.ACTION_MANAGER]}
  },
  {
    path: 'tmp2',
    component: TopicAreaComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.ADMIN, Role.ACTION_MANAGER]}
  },
  {
    path: 'tmp3',
    component: TopicAreaComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.ADMIN, Role.ACTION_MANAGER]}
  },
  {
    path: 'tmp4',
    component: TopicAreaComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.ADMIN, Role.ACTION_MANAGER]}
  },
  {
    path: '',
    component: ActionsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
