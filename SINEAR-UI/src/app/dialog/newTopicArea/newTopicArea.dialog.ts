import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {DatePipe} from '@angular/common';
import {DatabaseService} from '../../services/database.service';
import {NewTopicAreaForm} from '../../form/newTopicArea.form';
import {TopicArea} from 'src/app/model/topicArea';

@Component({
    selector: 'newTopicArea-app',
    templateUrl: './newTopicArea.dialog.html',
    styleUrls: ['./newTopicArea.dialog.sass']
})
export class NewTopicAreaDialog implements OnInit {

    newTopicAreaForm : NewTopicAreaForm;
    errorText : String = '';

    constructor(private dialogRef: MatDialogRef<NewTopicAreaDialog>,
                private readonly databaseService: DatabaseService,
                private datePipe: DatePipe,){}

    ngOnInit() {
        this.newTopicAreaForm = new NewTopicAreaForm();
    }

    close() {
        this.dialogRef.close();
    }

   addNewTopicArea(){
      
        if (this.newTopicAreaForm.valid) {
        this.databaseService.createTopicArea(new TopicArea(
            this.newTopicAreaForm.value.name)).subscribe(() => {
            
        }, error => {
            this.errorText = error.error;
        });

        this.dialogRef.close();
        }
  }
}