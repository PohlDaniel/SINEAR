import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";


@Component({
    selector: 'PopUpDialog-app',
    templateUrl: './PopUp.dialog.html',
    styleUrls: ['./PopUp.dialog.sass']
})
export class PopUpDialog implements OnInit {

  constructor(private dialogRef: MatDialogRef<PopUpDialog>){}

  ngOnInit() {
  }

  close() {
         this.dialogRef.close();
  }
}
