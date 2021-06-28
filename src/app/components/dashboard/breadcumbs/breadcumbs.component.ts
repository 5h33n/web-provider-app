import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-breadcumbs',
  templateUrl: './breadcumbs.component.html',
  styleUrls: ['./breadcumbs.component.css']
})
export class BreadcumbsComponent implements OnInit {
  @Input() current: string | undefined;
  constructor() { }

  ngOnInit(): void {
  }

}
