import {Component, OnInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import {MatSort, MatPaginator, MatDialog, MatDialogConfig, PageEvent, MatTableDataSource} from "@angular/material";
import{MatIconRegistry}from "@angular/material/icon";
import{DomSanitizer}from "@angular/platform-browser";

import {Person} from '../../model/person';
import {AuthenticationService} from '../../services/authentication.service';
import {DatabaseService} from '../../services/database.service';
import{NewPersonDialog} from '../../dialog/newPerson/newPerson.dialog';
import{EditPersonDialog} from '../../dialog/editPerson/editPerson.dialog';
import {ConfirmDialog} from '../../dialog/confirm/confirm.dialog';


@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.sass']
})
export class PersonComponent implements OnInit {

  displayedColumns: string[] = [ 'id', 'surname', 'prename', 'edit', 'delete'];
  dataSource: MatTableDataSource<Person> = new MatTableDataSource<Person>();
  selectedPerson: Person;
  currentUser: Person;
  errorText: string = '';

 @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
 @ViewChild(MatSort, {static: false}) sort: MatSort;

  entriesTotal: number = 100;
  pageSize: number = 2;
  currentPage: number = 0;
  pageSizeOptions: number[] = [2, 5];
  pageEvent: PageEvent;

  isWait: boolean;
  dataLoaded: boolean = false;
  delayInterval: number = 100;

  constructor(private readonly databaseService: DatabaseService,
              private readonly authenticationService: AuthenticationService,
              private dialog: MatDialog,
              private changeDetectorRefs: ChangeDetectorRef,
              private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) {

    this.currentUser = this.authenticationService.currentUserValue;
    this.matIconRegistry.addSvgIcon("custom_delete", this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/svg/delete.svg"));
  }

  ngOnInit() {
    this.refreshTable();
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    //custom accesor e.q. date sorting
    /*this.dataSource2.sortingDataAccessor = (item, property) =>{

      switch(property){
        case 'startDate' : {return new Date(item.date)}
        default : {return item[property];}
      }
    }*/

    //custom sort function
    this.dataSource.sortData = (data: Person[], sort: MatSort) =>{

      if(!sort.active || sort.direction === ''){
        return data;
      }

      return data.sort((a, b) =>{
            const isAsc = sort.direction === 'asc';
            switch(this.sort.active){
              case 'id' : return compare(a.id, b.id, isAsc);
              case 'prename' : return compare(a.prename, b.prename, isAsc);
              case 'surname' : return compare(a.surname, b.surname, isAsc);
              default: return 0;
            }
          }
        );
      }
  }

  refreshTable() {
    setTimeout(()=>{this.isWait = !this.dataLoaded ? true : false  }, this.delayInterval);
    this.dataLoaded = false;
    this.databaseService.getPersons().subscribe(response => {
        this.dataSource.data = response;
        this.changeDetectorRefs.detectChanges();
        this.isWait = false;
        this.dataLoaded = true;
      }
    );
  }

  getServerData(event?: PageEvent){
    this.refreshTable();
    return event;
  }

  applyFilter(filterValue: string){
    filterValue = filterValue.trim(); // remove whitespace
    filterValue = filterValue.toLowerCase(); 
    this.dataSource.filter = filterValue;
  }

  newPerson(){

    this.dialog.open(NewPersonDialog).afterClosed().subscribe(
      () => this.refreshTable()
    );
  }

  deletePerson(person: Person) {

    this.dialog.open(ConfirmDialog).afterClosed().subscribe(
      (confirm: boolean) => {
        if(confirm){
          this.selectedPerson = person;
          this.databaseService.deletePerson(this.selectedPerson).subscribe(() => {
            this.refreshTable();
            },
            error => {
            this.errorText = error.error;
            });
        }
      }
    );  
  }

  editPerson(person: Person) {

    const dialogConfig = new MatDialogConfig();

    if(person.id == this.currentUser.id){

      dialogConfig.data = person;
      dialogConfig.data.sessionId = this.currentUser.sessionId;
      dialogConfig.data.sessionIdExpiryDate = this.currentUser.sessionIdExpiryDate;

    }else{

      dialogConfig.data = person;
    }

    this.dialog.open(EditPersonDialog, dialogConfig).afterClosed().subscribe(
      () => this.refreshTable()
    );

  }

}

function compare(a: number | string, b: number | string, isAsc: boolean){
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}