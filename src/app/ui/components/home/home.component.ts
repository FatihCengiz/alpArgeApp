import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { DemandService } from '../demands/service/demand.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
pendingApproval;
budgetPlan;
budgetConfirmation;
active;
endConfirmation;
rejected;
discontinued;
canceled;
complated;
totalDemand;
user:any;
demand:[]=[];
currency:any="";
dolar:string="";
euro:string="";
  constructor(private spinner:NgxSpinnerService,private demandService:DemandService) {
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
      if(this.user.GroupID==1){
        this.getDemandAll();
      }else if(this.user.GroupID==2){
        this.getEngineerDemand(this.user.Name+" "+this.user.Surname,this.user.ID);

      }else if(this.user.GroupID==3){
        this.getRequesterDemand(this.user.Name+" "+this.user.Surname);
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
      this.totalDemand=response['demand_list'].length;
      this.budgetPlan=response['demand_list'].filter(x => x.ProjectStatus==2).length;
      this.budgetConfirmation=response['demand_list'].filter(x => x.ProjectStatus==3).length;
      this.active=response['demand_list'].filter(x => x.ProjectStatus==4).length;
      this.endConfirmation=response['demand_list'].filter(x => x.ProjectStatus==5).length;
      this.complated=response['demand_list'].filter(x => x.ProjectStatus==6).length;
    });
    this.displayDashboard();
   }
   getRequesterDemand(requester:string){
    console.log(requester);
    this.demandService.getRequesterDemand(requester).subscribe((response)=>{
      if(!response['error']){
        this.totalDemand=response['demand_list'].length;
        this.pendingApproval=response['demand_list'].filter(x => x.ProjectStatus==1).length;
        this.budgetPlan=response['demand_list'].filter(x => x.ProjectStatus==2).length;
        this.budgetConfirmation=response['demand_list'].filter(x => x.ProjectStatus==3).length;
        this.active=response['demand_list'].filter(x => x.ProjectStatus==4).length;
        this.endConfirmation=response['demand_list'].filter(x => x.ProjectStatus==5).length;
        this.complated=response['demand_list'].filter(x => x.ProjectStatus==6).length;
      }
    });
    this.displayDashboard();
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
}
