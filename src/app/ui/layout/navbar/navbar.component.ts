import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
menu:any;
  constructor() {


  }

  ngOnInit(): void {
  }
  ngAfterContentInit(): void {
    this.menu=document.getElementById("menu-sidebar2") as HTMLInputElement;
    this.menu.setAttribute("id","menu-sidebar2-visible");
    // console.log(this.menu);
  }
  showMenu(){
    if(this.menu.id=="menu-sidebar2"){
      this.menu.setAttribute("id","menu-sidebar2-visible");
    }else{
      this.menu.setAttribute("id","menu-sidebar2");
    }
  }
  showMessage(){
    Swal.fire('','Çok yakın zamanda eklenecek...','info')
  }

}
