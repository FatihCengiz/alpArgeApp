import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../login/services/auth.service';
import { SidenavService } from './service/sidenav.service';

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
  authorityList = { bütçePalanlamaYetkisi: 'Bütçe Planlama', bütçeOnaylamaYetkisi: 'Bütçe Onaylama' };
  authorityArray:any []=[];

  constructor(private authService:AuthService, private sidenavService:SidenavService) {
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
       console.log(this.get.user[0].GroupID);
       if(this.get.user[0].GroupID==2){
       this.authorityArray.push(this.authorityList.bütçePalanlamaYetkisi);
       this.authorityArray.push(this.authorityList.bütçeOnaylamaYetkisi);
       console.log(this.authorityArray);

       }

      });
    }

  }
  logout(){
    this.authService.logout();
  }

}
