import {Component, Inject,OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {MAT_DIALOG_DATA} from "@angular/material";
import {Person} from '../../model/person';
import {DatabaseService} from '../../services/database.service';
import {EditPersonForm} from '../../form/editPerson.form';

@Component({
    selector: 'editPersonDialog-app',
    templateUrl: './editPerson.dialog.html',
    styleUrls: ['./editPerson.dialog.sass']
})
export class EditPersonDialog implements OnInit {

    editPersonForm : EditPersonForm;
    errorText : String = '';
    data : Person;

    constructor(private dialogRef: MatDialogRef<EditPersonDialog>,
                private readonly databaseService: DatabaseService,
                @Inject(MAT_DIALOG_DATA) data){

                  this.data = data;
                }

    ngOnInit() {
      this. editPersonForm = new EditPersonForm();
      
      this.editPersonForm.surname.setValue(this.data.surname);
      this.editPersonForm.prename.setValue(this.data.prename);
      this.editPersonForm.mail.setValue(this.data.mail);
      this.editPersonForm.externalCompany.setValue(this.data.externalCompany);
      this.editPersonForm.role.setValue(this.data.role);
    }

    close() {
           this.dialogRef.close();
    }

    editPerson(){
      this.errorText = '';
      if (this.editPersonForm.valid) {
 
        const person: Person = new Person(
          {id : this.data.id,
           surname : this.editPersonForm.value.surname,
           prename : this.editPersonForm.value.prename,
           mail : this.editPersonForm.value.mail,
           external : this.editPersonForm.value.externalCompany,
           role : this.editPersonForm.value.role,
           topicAreas : this.data.topicAreas,
           passwordHash : this.data.passwordHash,
           sessionId : this.data.sessionId,
           sessionIdExpiryDate : this.data.sessionIdExpiryDate});
          this.postPerson(person);
        }
    }

    postPerson(person: Person) {
      this.errorText = '';
      this.databaseService.createPerson(person).subscribe(
          () => {
            
          },
          error => {
            this.errorText = error.error;
          });
  
          this.dialogRef.close();
      }

}
