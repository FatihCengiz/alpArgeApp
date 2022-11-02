import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { DemandService } from '../demands/service/demand.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
pendingApproval="0";
budgetPlan="0";
budgetConfirmation="0";
active="0";
endConfirmation="0";
rejected="0";
discontinued="0";
canceled="0";
complated="0";
totalDemand="0";
user:any;
demand:[]=[];
currency:any="";
dolar:string="";
euro:string="";
groupUserID:string="";
userName:string="";
  constructor(private spinner:NgxSpinnerService,private demandService:DemandService,private router:Router) {
    this.spinnerShow();
    this.getUserByID();
    this.getCurrency();
   }

  ngOnInit(): void {
  }
  spinnerShow(){
    this.spinner.show().then(() => {
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);

    });
   }
   getUserByID(){
    let userID=localStorage.getItem('token');
    if(userID!=null)
    this.demandService.getUser(userID).subscribe((response)=>{
      this.user=response['user']['0'];
      this.userName=this.user.Name+" "+this.user.Surname;
      if(this.user.GroupID==1){
        this.getDemandAll();
        this.groupUserID="1";
      }else if(this.user.GroupID==2){
        this.getEngineerDemand(this.user.Name+" "+this.user.Surname,this.user.ID);
        this.groupUserID="2";
      }else if(this.user.GroupID==3){
        this.getRequesterDemand(this.user.Name+" "+this.user.Surname);
        this.groupUserID="3";
      }
    })
   }
   getDemandAll(){
    this.demandService.getDemands().subscribe((response)=>{
      this.totalDemand=response['demand_list'].length;
      this.pendingApproval=response['demand_list'].filter(x => x.ProjectStatus==1).length;
      this.budgetPlan=response['demand_list'].filter(x => x.ProjectStatus==2).length;
      this.budgetConfirmation=response['demand_list'].filter(x => x.ProjectStatus==3).length;
      this.active=response['demand_list'].filter(x => x.ProjectStatus==4).length;
      this.endConfirmation=response['demand_list'].filter(x => x.ProjectStatus==5).length;
      this.rejected=response['demand_list'].filter(x => x.ProjectStatus==9).length;
      this.discontinued=response['demand_list'].filter(x => x.ProjectStatus==7).length;
      this.canceled=response['demand_list'].filter(x => x.ProjectStatus==8).length;
      this.complated=response['demand_list'].filter(x => x.ProjectStatus==6).length;
    });
   }
   getEngineerDemand(requester:string,responsible:any){
    this.demandService.getRequesterDemand(requester).subscribe((response)=>{
      if(!response['error']){
        this.pendingApproval=response['demand_list'].filter(x => x.ProjectStatus==1).length
      }
    });

    this.demandService.getResponsibleDemand(responsible).subscribe((response)=>{
      if(!response['error']){
      this.totalDemand=response['demand_list'].length;
      this.budgetPlan=response['demand_list'].filter(x => x.ProjectStatus==2).length;
      this.budgetConfirmation=response['demand_list'].filter(x => x.ProjectStatus==3).length;
      this.active=response['demand_list'].filter(x => x.ProjectStatus==4).length;
      this.endConfirmation=response['demand_list'].filter(x => x.ProjectStatus==5).length;
      this.complated=response['demand_list'].filter(x => x.ProjectStatus==6).length;
      this.rejected=response['demand_list'].filter(x => x.ProjectStatus==9).length;
      this.discontinued=response['demand_list'].filter(x => x.ProjectStatus==7).length;
      this.canceled=response['demand_list'].filter(x => x.ProjectStatus==8).length;
      }
    });
  //  this.displayDashboard();
   }
   getRequesterDemand(requester:string){
    this.demandService.getRequesterDemand(requester).subscribe((response)=>{
      if(!response['error']){
        this.totalDemand=response['demand_list'].length;
        this.pendingApproval=response['demand_list'].filter(x => x.ProjectStatus==1).length;
        this.budgetPlan=response['demand_list'].filter(x => x.ProjectStatus==2).length;
        this.budgetConfirmation=response['demand_list'].filter(x => x.ProjectStatus==3).length;
        this.active=response['demand_list'].filter(x => x.ProjectStatus==4).length;
        this.endConfirmation=response['demand_list'].filter(x => x.ProjectStatus==5).length;
        this.complated=response['demand_list'].filter(x => x.ProjectStatus==6).length;
        this.rejected=response['demand_list'].filter(x => x.ProjectStatus==9).length;
        this.discontinued=response['demand_list'].filter(x => x.ProjectStatus==7).length;
        this.canceled=response['demand_list'].filter(x => x.ProjectStatus==8).length;
      }
    });
  //  this.displayDashboard();
   }
   displayDashboard(){
     var element1=(document.getElementById('dashboard6') as HTMLInputElement);
     var element2=(document.getElementById('dashboard7') as HTMLInputElement);
     var element3=(document.getElementById('dashboard8') as HTMLInputElement);
     element1.style.display='none';
     element2.style.display='none';
     element3.style.display='none';
   }
   getCurrency(){
      this.demandService.getCurrency().subscribe((response)=>{
        if(response!=undefined || response!=null){
          this.currency=response;
          this.dolar=this.currency.USD.Satış.trim().replace(",",".");
          this.euro=this.currency.EUR.Satış.trim().replace(",",".");
          this.dolar=this.dolar.substring(0,5);
          this.euro=this.euro.substring(0,5);
        }else{
          // Swal.fire('', 'Kur bilgisi çekilemedi !', 'error');
        }
      },(err)=>{
        // Swal.fire('', 'Kur bilgisi çekilemedi !', 'error');
      });
    }
    projectPlannigRouter(groupID:any,status:number){
      if(groupID!=1){
        this.router.navigate(['/projects'], {
          state: { userName: this.userName,  projectStatus: status, groupID:groupID }
        });
      }else{
        this.router.navigate(['/projects'], {
          state: { userName: '',  projectStatus: status }
        });
      }
    }
    projectConfirmationRouter(groupID:any,status:number){
      if(groupID!=1){
        this.router.navigate(['/projects'], {
          state: { userName: this.userName,  projectStatus: status, groupID:groupID }
        });
      }else{
        this.router.navigate(['/projects/project-confirmation'], {
          state: { userName: '',  projectStatus: status }
        });
      }
    }
    projectDevelopmentRouter(groupID:any,status:number){
      if(groupID!=1){
        this.router.navigate(['/projects'], {
          state: { userName: this.userName,  projectStatus: status, groupID:groupID }
        });
      }else{
        this.router.navigate(['/projects'], {
          state: { userName: '',  projectStatus: status, }
        });
      }
    }
    projectClosingRouter(groupID:any,status:number){
      if(groupID!=1){
        this.router.navigate(['/projects'], {
          state: { userName: this.userName,  projectStatus: status,  groupID:groupID}
        });
      }else{
        this.router.navigate(['/projects/project-closing'], {
          state: { userName: '',  projectStatus: status }
        });
      }
    }
    projectRejectedRouter(groupID:any,status:number){
      if(groupID!=1){
        this.router.navigate(['/projects'], {
          state: { userName: this.userName,  projectStatus: status, groupID:groupID }
        });
      }else{
        this.router.navigate(['/projects'], {
          state: { userName: '',  projectStatus: status }
        });
      }
    }
    projectDiscontinuedRouter(groupID:any,status:number){
      if(groupID!=1){
        this.router.navigate(['/projects'], {
          state: { userName: this.userName,  projectStatus: status, groupID:groupID }
        });
      }else{
        this.router.navigate(['/projects'], {
          state: { userName: '',  projectStatus: status }
        });
      }
    }
    projectCanceledRouter(groupID:any,status:number){
      if(groupID!=1){
        this.router.navigate(['/projects'], {
          state: { userName: this.userName,  projectStatus: status, groupID:groupID }
        });
      }else{
        this.router.navigate(['/projects'], {
          state: { userName: '',  projectStatus: status }
        });
      }
    }
    projectComplatedRouter(groupID:any,status:number){
      if(groupID!=1){
        this.router.navigate(['/projects'], {
          state: { userName: this.userName,  projectStatus: status, groupID:groupID }
        });
      }else{
        this.router.navigate(['/projects'], {
          state: { userName: '',  projectStatus: status }
        });
      }
    }
    projectsRouter(groupID:any){
      if(groupID!=1){
        this.router.navigate(['/projects'], {
          state: { userName: this.userName,  projectStatus: '', groupID:groupID }
        });
      }else{
        this.router.navigate(['/projects'], {
          state: { userName: '',  projectStatus:  ''}
        });
    }
  }
}
