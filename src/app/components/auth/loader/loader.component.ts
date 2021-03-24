import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {trigger,state,style,animate,transition,} from '@angular/animations';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
  animations : [
    trigger('openClose',[
      state('open', style({
        opacity: 1
      })),
      state('closed',style({width:'70px',height:'70px',backgroundColor:'transparent','border-radius':'50%',opacity:1})),
      transition('open => closed', [
        animate('0.5s')
      ])
    ]),
    trigger('bw',[
      state('a',style({filter:'invert(100%)'})),
      state('b',style({filter:'opacity(0)'})),
      transition('a => b', [
        animate('0.4s')
      ])
    ])
  ]
})
export class LoaderComponent implements OnInit {

  constructor(private router:Router) { }
  isOpen = true;
  showLogo = "a";
  ngOnInit(): void {
    setTimeout(() => {
      this.isOpen = false;
      setTimeout(() => {
        this.showLogo = "b";
        setTimeout(() => {
          this.router.navigate(['login']);
         }, 500);
       }, 500);
     }, 3000);
  }

}
