import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import $ from 'jquery';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

@Injectable({
  providedIn: 'root'
})

export class DashboardComponent implements OnInit {
  apiURL: string = 'localhost:3000';
  
  constructor(private httpClient: HttpClient) { }
  
  ngOnInit() {
    $("#sidebarToggle").on("click",function(o){o.preventDefault(),$("body").toggleClass("sidebar-toggled"),$(".sidebar").toggleClass("toggled")}),$("body.fixed-nav .sidebar").on("mousewheel DOMMouseScroll wheel",function(o){if(768<$(window).width()){var e=o.originalEvent,t=e.wheelDelta||-e.detail;this.scrollTop+=30*(t<0?1:-1),o.preventDefault()}}),$(document).on("scroll",function(){100<$(this).scrollTop()?$(".scroll-to-top").fadeIn():$(".scroll-to-top").fadeOut()}),$(document).on("click","a.scroll-to-top",function(o){var e=$(this);$("html, body").stop().animate({scrollTop:$(e.attr("href")).offset().top},1e3,"easeInOutExpo"),o.preventDefault()});


  }
}
