import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { noSession } from './common/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    if(!document.location.href.includes('/login') && !document.location.href.includes('/register') ){
      this.authService.getSession().subscribe((value)=>{
      },error=>{
        //noSession(this.router);
      });
    }
  }
  title = 'web-provider';
  constructor(
    private authService:AuthService,
    private router:Router
    ){
  }
}
