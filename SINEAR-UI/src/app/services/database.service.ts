import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

import {Action} from '../model/action';
import {Person} from '../model/person';
import {TopicArea} from '../model/topicArea';

import {environment} from "../../environments/environment";
import {map} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(private readonly http: HttpClient) {
    }

    // Action
    createAction(action: Action): Observable<Action> {
      return this.http.post<Action>(
        environment.baseUrl + '/actions/create',
        JSON.stringify(action),
        {headers: this.headers});
    }

    //a simple mapping to reduce the received json
    getActions(): Observable<Action[]> {
      return this.http.get<Action[]>(environment.baseUrl + '/actions/getAll').pipe(
        map((response : Action[]) =>{
          return response.map(x => new Action(x));
        })//map
      );//pipe;
    }

    duplicateAction(newAction: Action,
                    oldAction: Action): Observable<Action> {
      return this.http.post<Action>(
        environment.baseUrl + '/actions/duplicate',
        {newAction, oldAction},
        {headers: this.headers});
    }

    deleteAction(action: Action): Observable<string> {
      return this.http.post<string>(
        environment.baseUrl + '/actions/delete',
        JSON.stringify(action),
        {headers: this.headers});
    }


    // Persons
    createPerson(person: Person): Observable<Person> {
      return this.http.post<Person>(
        environment.baseUrl + '/persons/create',
        JSON.stringify(person),
        {headers: this.headers});
    }

    //a simple mapping to reduce the received json
    getPersons(): Observable<Person[]> {
      return  this.http.get<Person[]>(environment.baseUrl + '/persons/getAll').pipe(
        map((response : Person[]) =>{
          return response.map(x => new Person(x));
        })//map
      );//pipe
    }

    deletePerson(person: Person): Observable<string> {
      return this.http.post<string>(
        environment.baseUrl + '/persons/delete',
        JSON.stringify(person),
        {headers: this.headers});
    }

    getPersonByID(id: string): Observable<Person> {
        const params = new HttpParams()
          .append('id', id);
        return this.http.get<Person>(
        environment.baseUrl + '/persons/getById',
        {params});
    }

    changePassword(id: string,
                   token: string,
                   passwordHash: string) {
          return this.http.post(
          environment.baseUrl + '/persons/changePassword',
          {id, token, passwordHash},
          {headers: this.headers});
    }

    resetPassword(id: string) {
        return this.http.post<any>(
          environment.baseUrl + '/persons/resetPassword',
          {id},
          {headers: this.headers});
    }

    // TopicAreas
  createTopicArea(topicArea: TopicArea): Observable<TopicArea> {
    return this.http.post<TopicArea>(
      environment.baseUrl + '/topicareas/create',
      JSON.stringify(topicArea),
      {headers: this.headers});
  }

  //a simple mapping to reduce the received json
  getTopicAreas(): Observable<TopicArea[]> {
    return this.http.get<TopicArea[]>(environment.baseUrl + '/topicareas/getAll').pipe(
      map((response : TopicArea[]) =>{
        return response.map(x => new TopicArea(x));
      })//map
    );//pipe
  }

  addPersonToTopicArea(topicAreaName: string,
                       id: string): Observable<TopicArea> {
    return this.http.post<TopicArea>(
      environment.baseUrl + '/topicareas/addPerson',
      {topicAreaName, id},
      {headers: this.headers});
  }

  removePersonFromTopicArea(topicAreaName: string,
                            id: string): Observable<string> {
    return this.http.post<string>(
      environment.baseUrl + '/topicareas/removePerson',
      {topicAreaName, id},
      {headers: this.headers});
  }

  deleteTopicArea(topicArea: TopicArea): Observable<string> {
    return this.http.post<string>(
      environment.baseUrl + '/topicareas/delete',
      JSON.stringify(topicArea),
      {headers: this.headers});
  }
}
