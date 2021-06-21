import { HostListener } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Provider } from 'src/app/models/provider';
import { AuthService } from 'src/app/services/auth.service';
import { Logout } from '../../common/common';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentProvider: Provider | undefined;
  @Input() dr: any;
  @Input() mobileDevice: any;
  marginUser = "";
  currentWidth = screen.width;
  constructor(
    private authService:AuthService,
    private router:Router
    ) {
    }
  ngOnInit(): void {
    this.reorder();
    this.currentProvider = this.authService.getCurrentUser();
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
  logout(){
    Logout(this.authService,this.router);
  }
}