import { HostListener } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() dr: any;
  @Input() mobileDevice: any;
  marginUser = "";
  currentWidth = screen.width;
  constructor(private router:Router) {
    }
  ngOnInit(): void {
    this.reorder();
  }
  @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
      this.currentWidth = (event.target as Window).innerWidth;
      this.reorder();
  }
  reorder(){
    let cf;
    if (this.dr===null){
      cf = this.mobileDevice ? 200 : 230;
    }else{
      cf = this.dr.opened ? 487 : this.mobileDevice ? 155 : 270; 
    }
    this.marginUser = `${this.currentWidth - cf}px`;
  }
  action(){
    this.dr === null ? this.router.navigate(['dashboard']) : this.dr.toggle();
    this.reorder();
  }
}