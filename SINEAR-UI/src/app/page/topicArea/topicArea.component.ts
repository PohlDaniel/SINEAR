import {Component, OnInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import {MatSort, MatPaginator, MatDialog, MatDialogConfig, PageEvent, MatTableDataSource} from "@angular/material";
import{MatIconRegistry}from "@angular/material/icon";
import{DomSanitizer}from "@angular/platform-browser";

import {TopicArea} from '../../model/topicArea';
import {DatabaseService} from '../../services/database.service';
import {NewTopicAreaDialog} from '../../dialog/newTopicArea/newTopicArea.dialog';
import {ConfirmDialog} from '../../dialog/confirm/confirm.dialog';

@Component({
    selector: 'app-topicArea',
    templateUrl: './topicArea.component.html',
    styleUrls: ['./topicArea.component.sass']
  })
  export class TopicAreaComponent implements OnInit {

  displayedColumns: string[] = [ 'name', 'delete'];
  dataSource: MatTableDataSource<TopicArea> = new MatTableDataSource<TopicArea>();
  selectedTopicArea: TopicArea;
  errorText : string = '';

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
    
  constructor(private readonly databaseService: DatabaseService,
              private changeDetectorRefs: ChangeDetectorRef,
              private dialog: MatDialog,
              private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer){

    this.matIconRegistry.addSvgIcon("custom_delete", this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/svg/delete.svg"));
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
    this.databaseService.getTopicAreas().subscribe(response => {
      this.dataSource.data = response.slice(0, this.entriesTotal);
      this.changeDetectorRefs.detectChanges();
      this.isWait = false;
      this.dataLoaded = true;
      }
    );
  }

  applyFilter(filterValue: string){
    filterValue = filterValue.trim(); // remove whitespace
    filterValue = filterValue.toLowerCase(); 
    this.dataSource.filter = filterValue;
  }

  deleteTopicArea(topicArea : TopicArea){
    this.dialog.open(ConfirmDialog).afterClosed().subscribe(
      (confirm: boolean) => {
        if(confirm){
          this.selectedTopicArea = topicArea;
          this.databaseService.deleteTopicArea(this.selectedTopicArea).subscribe(
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

  newTopicArea(){

    this.dialog.open(NewTopicAreaDialog).afterClosed().subscribe(
      () => this.refreshTable(),
      error => {
        this.errorText = error.error;
      }
    );
  }
}
