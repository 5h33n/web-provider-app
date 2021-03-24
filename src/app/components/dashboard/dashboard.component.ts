import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  openNav = false;
  mobileDevice = false;
  currentMode = false;
  constructor() { }

  ngOnInit(): void {
    this.reorder();
  }
  @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
      this.reorder();
  }
  reorder(){
    screen.width > 760 ? this.mobileDevice = false : this.mobileDevice = true;
    screen.width > 1024 ? this.currentMode = false : this.currentMode = true;
    screen.width > 1024 ? this.openNav = true : this.openNav = false;
  }
}
