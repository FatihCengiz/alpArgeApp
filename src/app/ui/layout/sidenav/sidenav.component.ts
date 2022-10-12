import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../login/services/auth.service';
import { SidenavService } from './service/sidenav.service';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  demandQuantity;
  get;
  userName;
  userID;
  projectManager:boolean=false;
  authorityList = {bütçePalanlama: false, bütçeOnaylama: false,projeler: false,projelerim: false, projeKapatma:false,projeKapatmaIslem:false };
  headerUser:string;
  imageVisible:boolean;
  nameVisible:boolean;
  imageUrl:any="";

  authorityArray:any []=[false,false,false,false,false,false,false];// talepAçma,bütçeOnaylama,bütçePalanlama,projeKapatma,projelerim, projeler,proje kapatma isl,


  constructor(private authService:AuthService, private sidenavService:SidenavService,private router:Router,public _DomSanitizationService: DomSanitizer) {

   }

  ngOnInit(): void {
    this.getUser();
  }
  getDemandQuantity(requester:any){
      this.sidenavService.getDemands().subscribe((response)=>{
        this.get.demand_list=response['demand_list'];
        let count=0;
        this.get.demand_list.forEach(element => {
          if(element.ProjectStatus==1 &&  element.Requester==requester)
            count++;
            this.demandQuantity=count;
        });


      })

  }
  getDemandQuantityManager(){
    setInterval(() => {
      this.sidenavService.getDemandCount().subscribe((response)=>{
        this.demandQuantity=response['demand_list'][0]['Count'];
      })
      // this.demandQuantity=this.get.demand_list.filter(x => x.ProjectStatus==1).length;
    }, 3000);

  }
  getUser(){
    let id=localStorage.getItem("token");
    if(id!=undefined){
      this.sidenavService.getUser(id?.toString()).subscribe((response)=>{
        this.get=response;
       this.userName=this.get.user[0].Name + " " + this.get.user[0].Surname;
       this.headerUser=this.get.user[0].Name.substring(0,1)+this.get.user[0].Surname.substring(0,1);
       this.getDemandQuantity(this.userName);
       this.userID=this.get.user[0].ID;
       this.showImage();
       if(this.get.user[0].GroupID==1){
        this.authorityArray=[true,false,true,true,false,true,false];// talepAçma,projeler,projelerim,bütçeOnaylama,bütçePalanlama,projeKapatma,
        this.getDemandQuantityManager();

       }else if(this.get.user[0].GroupID==2){
        this.authorityArray=[true,true,true,false,true,false,true];

       }else if(this.get.user[0].GroupID==3){
        this.authorityArray=[true,false,true,false,false,false,false];
       }

      });
    }
  }
showImage(){
  this.sidenavService.getImageById(this.userID).subscribe((res) => {
    if(res['size']>100){
      let photo = res;
      var myReader:FileReader = new FileReader();
      myReader.onloadend = (e) => {
        this.imageUrl = this._DomSanitizationService.bypassSecurityTrustUrl(<string>myReader.result);
      }
      myReader.readAsDataURL(photo);
      this.imageVisible=true;
      this.headerUser="";
    }else{
      this.nameVisible=true;
    }
  });

}
  logout(){
    this.authService.logout();
  }

}
