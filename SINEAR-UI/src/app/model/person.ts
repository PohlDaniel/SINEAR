import {Role} from './role.enum';
import {TopicArea} from './topicArea';

export class Person {

  
  constructor(obj: any){
    if(obj){
    this.id = obj.id;
    this.surname = obj.surname;
    this.prename = obj.prename;
    this.mail = obj.mail;
    this.externalCompany = obj.externalCompany;
    this.role = obj.role;
    this.topicAreas = obj.topicAreas;
    this.passwordHash = obj.passwordHash;
    this.sessionId = obj.sessionId;
    this.sessionIdExpiryDate = obj.sessionIdExpiryDate;
    }
  }

  id: string;
  surname: string;
  prename: string;
  mail: string;
  externalCompany: string;
  role: Role;
  topicAreas: Array<TopicArea>;
  passwordHash: string;
  sessionId: string;
  sessionIdExpiryDate: string;
}
