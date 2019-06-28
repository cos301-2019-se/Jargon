import { Component, OnInit } from '@angular/core';
import {HostListener} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public innerWidth: any;
  public collapse: boolean;
 

  constructor() { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    if(this.innerWidth > 1200) {
      this.collapse = true;
    }

    if(this.innerWidth < 1200) {
      this.collapse= false;
    }
  }

  @HostListener('window:resize', ['$event']) onResize(event) { 
    this.innerWidth = window.innerWidth;
    if(this.innerWidth > 1200) {
      this.collapse = true;
    }

    if(this.innerWidth < 1200) {
      this.collapse= false;
    }
  }
}
