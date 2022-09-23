import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DemandService } from '../demands/service/demand.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
pendingApproval;
active;
complated;
totalDemand;
  constructor(private spinner:NgxSpinnerService,private demandService:DemandService) {
    this.spinnerShow();
    this.getDemand();
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
   getDemand(){
    this.demandService.getDemands().subscribe((response)=>{
      this.totalDemand=response['demand_list'].length;
      this.pendingApproval=response['demand_list'].filter(x => x.ProjectStatus==1).length;
      this.active=response['demand_list'].filter(x => x.ProjectStatus==4).length;
      this.complated=response['demand_list'].filter(x => x.ProjectStatus==6).length;
    })
   }

}
