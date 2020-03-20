import {Component, Inject,OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {MatDialogRef} from "@angular/material/dialog";
import {MAT_DIALOG_DATA} from "@angular/material";
import {Action} from '../../model/action';
import {DatabaseService} from '../../services/database.service';
import {EditActionForm} from '../../form/editAction.form';

@Component({
    selector: 'editActionDialog-app',
    templateUrl: './editAction.dialog.html',
    styleUrls: ['./editAction.dialog.sass']
})
export class EditActionDialog implements OnInit {

    editActionForm : EditActionForm;
    errorText : String = '';
    data : Action;

    constructor(private dialogRef: MatDialogRef<EditActionDialog>,
                private readonly databaseService: DatabaseService,
                private datePipe: DatePipe,
                @Inject(MAT_DIALOG_DATA) data){

                  this.data = data;
                }

    ngOnInit() {
      this.editActionForm = new EditActionForm();
      this.editActionForm.startDate.setValue(this.datePipe.transform(this.data.startDate,"dd.MM.yy HH:00"));
      this.editActionForm.endDate.setValue(this.datePipe.transform(this.data.endDate,"dd.MM.yy HH:00"));
    }

    close() {
           this.dialogRef.close();
    }

    editAction(){
    
      if (this.editActionForm.valid) {

        this.databaseService.createAction(new Action({
            name : this.data.name,
            startDate : new Date(this.datePipe.transform(this.editActionForm.value.startDate,"yyyy-dd-MM HH:mm")).getTime(),
            endDate : new Date(this.datePipe.transform(this.editActionForm.value.endDate,"yyyy-dd-MM HH:mm")).getTime(),
            finishedPlanning : this.data.finishedPlanning,
            finished : this.data.finished})).subscribe(() => {
            },
            error => {
              this.errorText = error.error;
            });
    
            this.dialogRef.close();
       
        }
    }
}