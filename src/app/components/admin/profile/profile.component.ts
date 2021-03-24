import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  mobileDevice = false;
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
  }

}
