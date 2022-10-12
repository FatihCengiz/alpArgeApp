import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
menu:any;
  constructor(private router:Router) {


  }

  ngOnInit(): void {
  }
  ngAfterContentInit(): void {
    this.menu=document.getElementById("menu-sidebar2") as HTMLInputElement;
    this.menu.setAttribute("id","menu-sidebar2-visible");
  }
  showLeftSideBar(){
    if(this.menu.id=="menu-sidebar2"){
      this.menu.setAttribute("id","menu-sidebar2-visible");
    }else{
      this.menu.setAttribute("id","menu-sidebar2");
    }
  }
  showMessage(){
    Swal.fire('','Çok yakın zamanda eklenecek...','info')
  }
  showRightSideBar(){
    var rightSideBar = document.getElementById('rightSideBar') as HTMLInputElement;
    if(rightSideBar.classList.contains('show-sidebar')){
      rightSideBar.classList.remove('show-sidebar');
      rightSideBar.classList.add('show-dropdown');
      console.log("1")
   }else{
      rightSideBar.classList.add('show-sidebar');
      rightSideBar.classList.remove('show-dropdown');
      console.log("2")
    }
  }
showMenu(){
 if(this.getWidth()>=991){
  this.showRightSideBar();
 }else{
  this.showLeftSideBar();
 }
}
  getWidth():number{
    return window.innerWidth
  }
  logout(){
    localStorage.removeItem("token");
    this.router.navigate(['\login']);
  }
}
