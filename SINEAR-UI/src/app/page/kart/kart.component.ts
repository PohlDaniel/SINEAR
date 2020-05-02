import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var UnityLoader: any;

@Component({
  selector: 'app-kart',
  templateUrl: './kart.component.html',
  styleUrls: ['./kart.component.sass']
})
export class KartComponent implements OnInit, AfterViewInit {
  unityInstance: any;

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.unityInstance = UnityLoader.instantiate("unityContainer", "assets/unity/Kart.json");
  }

}