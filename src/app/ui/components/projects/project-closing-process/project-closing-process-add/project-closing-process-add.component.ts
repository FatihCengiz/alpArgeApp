import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { SelectedProject } from '../../model/selected-project';
import { ProjectService } from '../../service/project.service';

@Component({
  selector: 'app-project-closing-process-add',
  templateUrl: './project-closing-process-add.component.html',
  styleUrls: ['./project-closing-process-add.component.scss']
})
export class ProjectClosingProcessAddComponent implements OnInit {
  public projectPlans = {
    form1Elements:{},
    form2Elements:[""]
};
 closingDemand:any = {
  projectNumber: [0],
  projectStatus: 5,
  actualDeliveryDate:""
};
selectedProject: SelectedProject = {
  projectNumber: [],
  projectStatus: 1,
};
projectNumber:any;
getDemandResponse:any;
isActive:boolean=true;
isVisible:boolean=true;
isManager:boolean=false;
isClosing:boolean=true;
commentControl:boolean=false;
  constructor(private route: ActivatedRoute, private projectService:ProjectService) {
    this.projectNumber = this.route.snapshot.paramMap.get('id');
    this.getData();
  }

  ngOnInit(): void {


  }

  saveToActualDeliveryDate(projectStatus:number){
    this.projectPlans.form1Elements=[];
    var form1Element1=(document.getElementById("form1text9") as HTMLInputElement).value;
    this.closingDemand.actualDeliveryDate=form1Element1;
    this.closingDemand.projectNumber=this.projectNumber;
    this.closingDemand.projectStatus=projectStatus;
    this.projectPlans.form1Elements=this.closingDemand;
  }
  saveToProjectPlan(){
    this.projectPlans.form2Elements=[];
    var parent=document.getElementById("form2MainDiv");
    parent?.childNodes.forEach((element)=>{
      var checked=(element.childNodes[0].childNodes[0].childNodes[0] as HTMLInputElement).checked;
      var comment=(element.childNodes[1].childNodes[0] as HTMLInputElement).value;

      if(checked)
        if(comment==""){
          this.commentControl=true;
        }else{
          this.commentControl=false;
        }

      const  variable: any = {
        checked:checked,
        comment:comment
      }
      this.projectPlans.form2Elements.push(variable);
    })

  }
  save(){
    if(!this.isActive){
      this.saveToActualDeliveryDate(4);
      this.saveToProjectPlan();
      this.projectService.selectedDemandClosingPost(this.projectPlans).subscribe((response) => {
        console.log(response);
        if(!response["error"]){
          Swal.fire('', 'Kaydedildi !', 'success');
        }else{
          Swal.fire('', 'Kaydetme işlemi başarısız !', 'error');
        }
      });
    }

  }
  sendClosing(){
    if(!this.isActive){
      Swal.fire({
        title: '',
        text: 'Kapatma onaya gönderilecek emin misiniz ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet',
      }).then((result) => {
        if (result.isConfirmed) {
          this.saveToActualDeliveryDate(5);
          this.saveToProjectPlan();
          var form1Element1=(document.getElementById("form1text9") as HTMLInputElement).value;
          if(form1Element1==""){
            Swal.fire('', 'Lütfen Fiili Teslim Tarihi alanını boş bırakmayınız !', 'warning');
          }else if(this.commentControl){
            Swal.fire('','Lütfen seçili yerlerin açıklama kısmını doldurunuz','warning');
          }
          else{
            this.projectService.selectedDemandClosingPost(this.projectPlans).subscribe((response) => {
              if(!response["error"]){
                this.isActive=true;
                Swal.fire('', 'Onaya Gönderildi !', 'success');
              }else{
                Swal.fire('', 'Onaya Gönderme İşlemi Başarısız !', 'error');
              }
            },(err)=>{
              Swal.fire('', 'Onaya Gönderme İşlemi Başarısız !', 'error');
            });
          }
        }
      });
    }

    }
getData(){
  this.projectService.getDemandById(this.projectNumber).subscribe((response)=>{
    this.getDemandResponse=response['demand_list'][0];
    var form1=(document.getElementById('form1') as HTMLInputElement);
    var form1Element1=form1.children[0].childNodes[0].childNodes[1] as HTMLInputElement;
    var form1Element2=form1.children[0].childNodes[1].childNodes[1] as HTMLInputElement;
    var form1Element3=form1.children[1].childNodes[0].childNodes[1] as HTMLInputElement;
    var form1Element4=form1.children[1].childNodes[1].childNodes[1] as HTMLInputElement;
    var form1Element5=form1.children[2].childNodes[0].childNodes[1] as HTMLInputElement;
    var form1Element6=form1.children[2].childNodes[1].childNodes[1] as HTMLInputElement;
    var form1Element7=form1.children[3].childNodes[0].childNodes[1] as HTMLInputElement;
    var form1Element8=form1.children[3].childNodes[1].childNodes[1] as HTMLInputElement;
    var form1Element9=form1.children[4].childNodes[0].childNodes[1] as HTMLInputElement;
    form1Element1.value=this.getDemandResponse.ProjectNumber;
    form1Element2.value=this.getDemandResponse.ProjectName;
    form1Element3.value=this.getDemandResponse.ProjectType;
    form1Element4.value=this.getDemandResponse.Customer;
    form1Element5.value=this.getDemandResponse.Requester;
    form1Element6.value=this.getDemandResponse.Engineer;
    form1Element7.value=this.getDemandResponse.DemandDate;
    form1Element8.value=this.getDemandResponse.DeliveryDate;
    form1Element9.value=this.getDemandResponse.ActualDeliveryDate;
    var responseUser=this.getDemandResponse.Responsible;
    var status=this.getDemandResponse.ProjectStatus;
    var user=localStorage.getItem("token");
    if(user!=null){
      this.projectService.getUser(user).subscribe((response)=>{
        var responsible=response['user'][0]['ID'];
        var group=response['user'][0]['GroupID'];
        if(status==4 && responsible==responseUser){
          this.isActive=false;
          this.isVisible=false;
        }else if(status==5 && responsible==responseUser){
          this.isActive=true;
          this.isVisible=false;
        }else if(status==5 && group==1 ){
          this.isManager=true;
          this.isClosing=false;
        }
        else{
          this.isVisible=true;
        }
      });

    }

  });
  this.projectService.getProjectPlanByID(this.projectNumber).subscribe((response)=>{
    if(!response['error']){
      this.getDemandResponse=response['project_closing_information_list'][0];
      console.log(this.getDemandResponse)
      var parent=(document.getElementById('form2MainDiv') as HTMLInputElement);
      var counter=0;
      parent?.childNodes.forEach((element)=>{
      var checked=(element.childNodes[0].childNodes[0].childNodes[0] as HTMLInputElement);
      var comment=(element.childNodes[1].childNodes[0] as HTMLInputElement);
      counter++;
      var variableName1="Checked"+counter;
      var variableName2="Explanation"+counter;
      checked.checked=Boolean(Number(this.getDemandResponse[variableName1]));
      comment.value=this.getDemandResponse[variableName2];
    });
  }


  });

}

projectClose(){
  this.selectedProject.projectNumber[0]=this.projectNumber;
  this.selectedProject.projectStatus=6;
  this.projectService.selectedDemandPost(this.selectedProject).subscribe((response)=>{
    if(!response['error']){
      Swal.fire('', "Proje Onaylandı !", 'success');
    }else{
      Swal.fire('', 'Proje Onaylama İşlemi Başarısız !', 'error');
    }
  },(err)=>{
    Swal.fire('', 'Proje Onaylama İşlemi Başarısız !', 'error');
  });
}
projectReject(){
  this.selectedProject.projectNumber[0]=this.projectNumber;
  this.selectedProject.projectStatus=4;
  this.projectService.selectedDemandPost(this.selectedProject).subscribe((response)=>{
    if(!response['error']){
      Swal.fire('', "Proje Geri Gönderildi  !", 'success');
    }else{
      Swal.fire('', 'Proje Onaylama İşlemi Başarısız !', 'error');
    }
  },(err)=>{
    Swal.fire('', 'Proje Onaylama İşlemi Başarısız !', 'error');
  });
}


}
