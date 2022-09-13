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
  authorityList = {bütçePalanlama: false, bütçeOnaylama: false,projelerim: false, projeler: false, projeKapatma:false };

  authorityArray:any []=[false,false,false,false,false,false];// talepAçma,bütçeOnaylama,bütçePalanlama,projeKapatma,projelerim, projeler,

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

       if(this.get.user[0].GroupID==1){
        this.authorityArray=[true,true,false,true,false,true];

       }else if(this.get.user[0].GroupID==2){
        this.authorityArray=[true,false,true,false,true,true];

       }else if(this.get.user[0].GroupID==3){
        this.authorityArray=[true,false,false,false,true,false];

       }

      });
    }

  }
  navigation1(){
    if(this.get.user[0].GroupID==1){
      this.router.navigate(['/demands/add']);
     // Swal.fire('', 'Yetkiniz yok', 'warning');

     }else if(this.get.user[0].GroupID==2){
      this.router.navigate(['/demands/add']);


     }else if(this.get.user[0].GroupID==3){
      this.router.navigate(['/demands/add']);
     }
  }
  navigation2(){
    if(this.get.user[0].GroupID==1){
      this.router.navigate(['/projects/project-confirmation']);
     // Swal.fire('', 'Yetkiniz yok', 'warning');

     }else if(this.get.user[0].GroupID==2){
      this.router.navigate(['/projects/project-confirmation']);


     }else if(this.get.user[0].GroupID==3){
      this.router.navigate(['/projects/project-confirmation']);
     }
  }
  navigation3(){
    if(this.get.user[0].GroupID==1){
      this.router.navigate(['/projects/project-plannig']);
     // Swal.fire('', 'Yetkiniz yok', 'warning');

     }else if(this.get.user[0].GroupID==2){
      this.router.navigate(['/projects/project-plannig']);


     }else if(this.get.user[0].GroupID==3){
      this.router.navigate(['/projects/project-plannig']);
     }
  }
  navigation4(){
    if(this.get.user[0].GroupID==1){
      this.router.navigate(['/projects/project-closing']);
     // Swal.fire('', 'Yetkiniz yok', 'warning');

     }else if(this.get.user[0].GroupID==2){
      this.router.navigate(['/projects/project-closing']);


     }else if(this.get.user[0].GroupID==3){
      this.router.navigate(['/projects/project-closing']);
     }
  }
  navigation5(){
    if(this.get.user[0].GroupID==1){
      this.router.navigate(['/projects/myproject']);
     // Swal.fire('', 'Yetkiniz yok', 'warning');

     }else if(this.get.user[0].GroupID==2){
      this.router.navigate(['/projects/myproject']);


     }else if(this.get.user[0].GroupID==3){
      this.router.navigate(['/projects/myproject']);
     }
  }
  navigation6(){
    if(this.get.user[0].GroupID==1){
      this.router.navigate(['/projects']);
     // Swal.fire('', 'Yetkiniz yok', 'warning');

     }else if(this.get.user[0].GroupID==2){
      this.router.navigate(['/projects']);


     }else if(this.get.user[0].GroupID==3){
      this.router.navigate(['/projects']);
     }
  }
  logout(){
    this.authService.logout();
  }

}
