import{Component, OnInit, ChangeDetectorRef, ViewChild}from '@angular/core';
import {MatSort, MatPaginator, MatDialog, MatDialogConfig, PageEvent, MatTableDataSource} from "@angular/material";
import{MatIconRegistry}from "@angular/material/icon";
import{DomSanitizer}from "@angular/platform-browser";


import{DatabaseService} from '../../services/database.service';
import{Action}from '../../model/action';
import{Person}from "../../model/person";
import{AuthenticationService}from "../../services/authentication.service";
import{NewActionDialog}from '../../dialog/newAction/newAction.dialog';
import{EditActionDialog}from '../../dialog/editAction/editAction.dialog';
import{CopyActionDialog}from '../../dialog/copyAction/copyAction.dialog';
import{ConfirmDialog}from '../../dialog/confirm/confirm.dialog';

@Component({
    selector: 'app-actions',
    templateUrl: './actions.component.html',
    styleUrls: ['./actions.component.sass']
  })
  export class ActionsComponent implements OnInit {

    displayedColumns: string[] = [ 'name', 'startDate', 'endDate', 'finishedPlanning', 'finished', 'edit', 'copy', 'delete'];
    dataSource: MatTableDataSource<Action> = new MatTableDataSource<Action>();
    currentUser: Person;
    selectedAction: Action;
    errorText = '';

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
   
    entriesTotal: number = 100;
    pageSize: number = 50;
    currentPage: number = 0;
    pageSizeOptions: number[] = [5, 10, 20, 50, 100];
    pageEvent: PageEvent;

    isWait: boolean;
    dataLoaded: boolean = false;
    delayInterval: number = 100;

    constructor(
      private readonly databaseService: DatabaseService,
      private readonly authenticationService: AuthenticationService,
      private dialog: MatDialog,
      private changeDetectorRefs: ChangeDetectorRef,
      private matIconRegistry: MatIconRegistry,
      private domSanitizer: DomSanitizer){
  
        this.currentUser = this.authenticationService.currentUserValue;
        this.matIconRegistry.addSvgIcon("custom_copy", this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/svg/copy-file.svg"));
        this.matIconRegistry.addSvgIcon("custom_check", this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/svg/stop.svg"));
        this.matIconRegistry.addSvgIcon("custom_delete", this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/svg/delete.svg"));
      }

    ngOnInit() {

      this.refreshTable();

    }

    ngAfterViewInit(){
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    
   
    refreshTable() {
      setTimeout(()=>{this.isWait = !this.dataLoaded ? true : false  }, this.delayInterval);
      this.dataLoaded = false;
      this.databaseService.getActions().subscribe(response => {
        this.dataSource.data = response.slice(0, this.entriesTotal);
        this.changeDetectorRefs.detectChanges();
        this.dataLoaded = true;
        this.isWait = false;
        }
      );
    }

    applyFilter(filterValue: string){
      filterValue = filterValue.trim(); // remove whitespace
      filterValue = filterValue.toLowerCase(); 
      this.dataSource.filter = filterValue;
    }

    deleteAction(action : Action){

      this.dialog.open(ConfirmDialog).afterClosed().subscribe(
        (confirm: boolean) => {
          if(confirm){
            this.selectedAction = action;
            this.databaseService.deleteAction(this.selectedAction).subscribe(
              () => {
                      this.refreshTable();
                    },
              error => {
                        this.errorText = error.error;
                       });
          }
        }
      );  
    }

    editAction(action: Action) {

      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = action;

      this.dialog.open(EditActionDialog, dialogConfig).afterClosed().subscribe(
        () => this.refreshTable(),
        error => {
          this.errorText = error.error;
        }
      );

    }

    copyAction(action: Action){

      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = action;

      this.dialog.open(CopyActionDialog, dialogConfig).afterClosed().subscribe(
        () => this.refreshTable(),
        error => {
          this.errorText = error.error;
        }
      );
    }

    newAction(){
      this.dialog.open(NewActionDialog).afterClosed().subscribe(
        () => this.refreshTable(),
        error => {
          this.errorText = error.error;
        }
      );
    }

    changeFinishedPlanning(action: Action){
      action.finishedPlanning = !action.finishedPlanning;
      this.databaseService.createAction(action).subscribe(() => {
        this.refreshTable();
      }, error => {
        this.errorText = error.error;
      });
    }

    changeFinished(action: Action){
      action.finished = !action.finished;
      if (action.finished) {
        action.finishedPlanning = true;
      }
      this.databaseService.createAction(action).subscribe(() => {
        this.refreshTable();
      }, error => {
        this.errorText = error.error;
      });
    }
}
