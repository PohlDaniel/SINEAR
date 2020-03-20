import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {DatePipe} from '@angular/common';
import {Action} from '../../model/action';
import {DatabaseService} from '../../services/database.service';
import {NewActionForm} from '../../form/newAction.form';

@Component({
    selector: 'newActionDialog-app',
    templateUrl: './newAction.dialog.html',
    styleUrls: ['./newAction.dialog.sass']
})
export class NewActionDialog implements OnInit {

    newActionForm : NewActionForm;
    errorText : String = '';

    constructor(private dialogRef: MatDialogRef<NewActionDialog>,
                private readonly databaseService: DatabaseService,
                private datePipe: DatePipe,){}

    ngOnInit() {
      this.newActionForm = new NewActionForm();
    }

    close() {
      this.dialogRef.close();
    }

   addNewAction(){
      
    if (this.newActionForm.valid) {
      this.databaseService.createAction(new Action({
        name : this.newActionForm.value.name,
        startDate : new Date(this.datePipe.transform(this.newActionForm.value.startDate,"yyyy-dd-MM HH:mm")).getTime(),
        endDate : new Date(this.datePipe.transform(this.newActionForm.value.endDate,"yyyy-dd-MM HH:mm")).getTime(),
        finishedPlanning : false,
        finished : false})).subscribe(() => {
        
      }, error => {
        this.errorText = error.error;
      });

      this.dialogRef.close();
    }
  }
}