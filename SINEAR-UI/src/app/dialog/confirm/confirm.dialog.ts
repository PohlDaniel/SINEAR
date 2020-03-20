import {Component, Inject,OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";


@Component({
    selector: 'confirmDialog-app',
    templateUrl: './confirm.dialog.html',
    styleUrls: ['./confirm.dialog.sass']
})
export class ConfirmDialog  {

    confirm : boolean = false;

    constructor(private dialogRef: MatDialogRef<ConfirmDialog>){}

    action(){
        this.confirm = true;
        this.dialogRef.close(this.confirm);      
    }

    close() {
        this.confirm = false;
        this.dialogRef.close(this.confirm);
    }

}