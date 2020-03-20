import {Component, Inject,OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {MatDialogRef} from "@angular/material/dialog";
import {MAT_DIALOG_DATA} from "@angular/material";
import {Action} from '../../model/action';
import {DatabaseService} from '../../services/database.service';
import {DuplicateActionForm} from '../../form/duplicateAction.form';

@Component({
    selector: 'copyActionDialog-app',
    templateUrl: './copyAction.dialog.html',
    styleUrls: ['./copyAction.dialog.sass']
})
export class CopyActionDialog implements OnInit {

    duplicateActionForm : DuplicateActionForm;
    errorText : String = '';
    data : Action;

    constructor(private dialogRef: MatDialogRef<CopyActionDialog>,
                private readonly databaseService: DatabaseService,
                private datePipe: DatePipe,
                @Inject(MAT_DIALOG_DATA) data){

                  this.data = data;
                }

    ngOnInit() {
      this.duplicateActionForm = new DuplicateActionForm();
      this.duplicateActionForm.startDate.setValue(this.datePipe.transform(this.data.startDate,"dd.MM.yy HH:00"));
      this.duplicateActionForm.name.setValue(this.data.name);
    }

    close() {
           this.dialogRef.close();
    }

    copyAction(){
    
        if (this.duplicateActionForm.valid) {
            const newStartDate: number = new Date(this.datePipe.transform(this.duplicateActionForm.value.startDate,"yyyy-dd-MM HH:mm")).getTime();
            const newEndDate : number = newStartDate + (this.data.endDate - this.data.startDate);
            this.databaseService.createAction(new Action({
                name : this.duplicateActionForm.value.name,
                startDate : newStartDate,
                endDate : newEndDate,
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