import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Provider } from 'src/app/models/provider';
import { AuthService } from 'src/app/services/auth.service';
import { Logout } from '../../common/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentProvider: Provider | undefined;
  openNav = false;
  mobileDevice = false;
  currentMode = false;
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.reorder();
    this.currentProvider = this.authService.getCurrentUser();
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
  logout(){
    Logout(this.authService,this.router);
  }
}
