import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Person} from '../../model/person';
import {DatabaseService} from '../../services/database.service';
import {NewPersonForm} from '../../form/newPerson.form';

@Component({
    selector: 'newPersonDialog-app',
    templateUrl: './newPerson.dialog.html',
    styleUrls: ['./newPerson.dialog.sass']
})
export class NewPersonDialog implements OnInit {

    newPersonForm : NewPersonForm;
    errorText : String = '';

    constructor(private dialogRef: MatDialogRef<NewPersonDialog>,
                private readonly databaseService: DatabaseService){}

    ngOnInit() {
      this.newPersonForm = new NewPersonForm();
    }

    close() {
           this.dialogRef.close();
    }



    addNewPerson(){
      this.errorText = '';
      if (this.newPersonForm.valid) {
        const person: Person = new Person({
          id : this.newPersonForm.value.bi,
          surname : this.newPersonForm.value.surname,
          prename : this.newPersonForm.value.prename,
          mail : this.newPersonForm.value.mail,
          externalCompany : this.newPersonForm.value.externalCompany,
          role : this.newPersonForm.value.role});
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
