import { Component, OnInit } from '@angular/core';
import { ProjectService } from './service/project.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
demandList:any;
demand:any;
search:any;
userName:any;
projectStatus:any;
groupID:any;
  constructor(private projectService:ProjectService,private router: Router) {
    this.projectService.spinnerShow();
    this.getDemandList();
    this.projectService.goToPageTop();
    this.userName=this.router.getCurrentNavigation()?.extras.state?.userName;
    this.projectStatus=this.router.getCurrentNavigation()?.extras.state?.projectStatus;
    this.groupID=this.router.getCurrentNavigation()?.extras.state?.groupID;
  }

  ngOnInit(): void {

  }
  getDemandList(){
    this.projectService.getDemands().subscribe((response=>{
      //this.demandList=response['demand_list'];
       // console.log(response['demand_list'])
      if(this.userName==undefined && this.projectStatus==undefined){
        this.userName="";
        this.projectStatus="";
      }
      if(this.groupID!=3){
        this.demandList=response['demand_list'].filter(s=> s.Engineer.includes(this.userName) && s.ProjectStatus.includes(this.projectStatus));
      }else{
        this.demandList=response['demand_list'].filter(s=> s.Requester.includes(this.userName) && s.ProjectStatus.includes(this.projectStatus));
      }

    }));
  }
  showDemand(event:Event){
    if(event!=null){
      var projectNumber=(event.target as HTMLInputElement).parentElement?.childNodes[0].textContent;
      if(projectNumber)
      this.projectService.getDemandById(projectNumber).subscribe((response)=>{
      this.demand=response['demand_list'][0];
      var swal_html="<style> th, td {text-align: left; padding: 8px; font-size:17px;} tr:nth-child(odd){background-color: #f2f2f2; font-weight:600;} </style><div style=overflow-x:auto; background-color:red !important;><table style= "+'"text-align: left;  width: 100%;  border-collapse: collapse; border-spacing: 0; -webkit-overflow-scrolling: touch !important; min-width:500px; border: 1px solid #ddd; padding: 8px;"'+" ><tr><td>Proje Numarası </td><td>"+this.demand.ProjectNumber+"</td> <td>Proje Adı  </td><td>"+this.demand.ProjectName+"</td> </tr> <tr> <td>Proje Tipi </td> <td>"+this.demand.ProjectType+"</td> <td>Proje Durumu  </td> <td>"+this.demand.Status+"</td></tr><tr> <td>Talep Tarihi </td> <td>"+this.demand.DemandDate+"</td> <td>Teslim Tarihi  </td> <td>"+this.demand.DeliveryDate+"</td></tr><tr> <td>Sorumlu </td> <td>"+this.demand.Engineer+"</td> <td>Planlanan Teslim Tarihi  </td> <td>"+this.demand.PlannedDeliveryDate+"</td></tr><tr> <td>Müşteri </td> <td>"+this.demand.Customer+"</td> <td>Talep Eden  </td> <td>"+this.demand.Requester+"</td></tr><tr> <td>Talep Şekli </td> <td>"+this.demand.DemandType+"</td> <td>Miktar  </td> <td>"+this.demand.Quantity+"</td></tr></table></div> <div class="+'"row"'+"><div class="+'"col-sm-6 form-group mt-3"'+"> <label for="+'"feature4"'+">Beklenen Temel Foksiyonlar</label> <textarea type="+'"search"'+ "class="+'"form-control"'+" readonly style="+'"resize: none; background-color:white !important; "'+">"+this.demand.Feature1+"</textarea> </div> <div class="+'"col-sm-6 form-group mt-3"'+"> <label for="+'"feature4"'+">Foksiyonel ve Teknik Özellikler</label> <textarea type="+'"search"'+ "class="+'"form-control"'+" readonly style="+'"resize: none; background-color:white !important; "'+">"+this.demand.Feature2+"</textarea> </div> <div class="+'"col-sm-6 form-group mt-3"'+"> <label for="+'"feature4"'+">Mekanik Özellikler</label> <textarea type="+'"search"'+ "class="+'"form-control"'+" readonly style="+'"resize: none; background-color:white !important; "'+">"+this.demand.Feature3+"</textarea> </div> <div class="+'"col-sm-6 form-group mt-3"'+"> <label for="+'"feature4"'+">Elektriksel Özellikler</label> <textarea type="+'"search"'+ "class="+'"form-control"'+" readonly style="+'"resize: none; background-color:white !important; "'+">"+this.demand.Feature4+"</textarea> </div> <div class="+'"col-sm-6 form-group mt-3"'+"> <label for="+'"feature4"'+">İlgili Standartlar</label> <textarea type="+'"search"'+ "class="+'"form-control"'+" readonly style="+'"resize: none; background-color:white !important; "'+">"+this.demand.Feature5+"</textarea> </div> <div class="+'"col-sm-6 form-group mt-3"'+"> <label for="+'"feature4"'+">Elektrik komponentleri ile ilgili detaylı bilgi</label> <textarea type="+'"search"'+ "class="+'"form-control"'+" readonly style="+'"resize: none; background-color:white !important; "'+">"+this.demand.Feature6+"</textarea> </div></div>";



      Swal.fire({title:'Proje Detayları',html:swal_html, showCloseButton: true,width:900})
      })
    }

  }
}
