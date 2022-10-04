import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../login/services/auth.service';
import { SidenavService } from './service/sidenav.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  demandQuantity;
  get;
  userName;
  projectManager:boolean=false;
  authorityList = {bütçePalanlama: false, bütçeOnaylama: false,projeler: false,projelerim: false, projeKapatma:false,projeKapatmaIslem:false };
  headerUser:string;

  authorityArray:any []=[false,false,false,false,false,false,false];// talepAçma,bütçeOnaylama,bütçePalanlama,projeKapatma,projelerim, projeler,proje kapatma,

  constructor(private authService:AuthService, private sidenavService:SidenavService,private router:Router) {
    this.sidenavService.getDemands().subscribe((response)=>{
      this.get=response;
      this.demandQuantity=this.get.demand_list.filter(x => x.ProjectStatus==1).length;
    })
    this.getUser();

   }

  ngOnInit(): void {
  }
  getUser(){
    let id=localStorage.getItem("token");
    if(id!=undefined){
      this.sidenavService.getUser(id?.toString()).subscribe((response)=>{
        this.get=response;
       this.userName=this.get.user[0].Name + " " + this.get.user[0].Surname;
       this.headerUser=this.get.user[0].Name.substring(0,1)+this.get.user[0].Surname.substring(0,1);
       if(this.get.user[0].GroupID==1){
        this.authorityArray=[true,false,true,true,false,true,false];// talepAçma,projeler,projelerim,bütçeOnaylama,bütçePalanlama,projeKapatma,

       }else if(this.get.user[0].GroupID==2){
        this.authorityArray=[true,true,true,false,true,false,true];

       }else if(this.get.user[0].GroupID==3){
        this.authorityArray=[true,false,true,false,false,false,false];
       }

      });
    }
  }

  logout(){
    this.authService.logout();
  }

}
