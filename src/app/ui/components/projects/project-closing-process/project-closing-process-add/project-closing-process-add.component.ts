import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import Swal from 'sweetalert2';
import { ProjectFile } from '../../model/project-file';
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
selectedFile = {
  projectNumber: 0,
  fileName: [""],
};
projectNumber:any;
getDemandResponse:any;
isActive:boolean=true;
isVisible:boolean=true;
isManager:boolean=false;
isClosing:boolean=true;
commentControl:boolean=false;
base64Output : string;
url;
type="png";
file;
size;
files:ProjectFile[]=[];

  constructor(
    private route: ActivatedRoute,
    private projectService:ProjectService,
    private router:Router,private sanitizer: DomSanitizer,
    ) {
    this.projectNumber=this.route.snapshot.paramMap.get('id');
    this.getFiles();
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
        if(responsible != responseUser || status>4){
          this.disableProjectPlan();
          this.hideFileButtons();
        }
      });

    }

  });
  this.projectService.getProjectPlanByID(this.projectNumber).subscribe((response)=>{
    if(!response['error']){
      this.getDemandResponse=response['project_closing_information_list'][0];
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
      this.router.navigate(["projects/project-closing"]);
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
      this.router.navigate(["projects/project-closing"]);
    }else{
      Swal.fire('', 'Proje Onaylama İşlemi Başarısız !', 'error');
    }
  },(err)=>{
    Swal.fire('', 'Proje Onaylama İşlemi Başarısız !', 'error');
  });
}
disableProjectPlan(){
  var parent=(document.getElementById('form1text9') as HTMLInputElement);
  parent.setAttribute('disabled','');
  parent=(document.getElementById('form2MainDiv') as HTMLInputElement);
  var counter=0;
  parent?.childNodes.forEach((element)=>{
  var checked=(element.childNodes[0].childNodes[0].childNodes[0] as HTMLInputElement);
  var comment=(element.childNodes[1].childNodes[0] as HTMLInputElement);
  checked.setAttribute('disabled','');
  comment.setAttribute('disabled','');
  });
}
hideFileButtons(){
  var inputFileElement=document.getElementById('fileButtonRow') as HTMLInputElement;
  inputFileElement.style.display='none';
}

downloadFile(){
  this.projectService.downloadFile(2).subscribe((response)=>{
    const data = response;
    const blob = new Blob([data], { type: 'application/octet-stream' });
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  })
}
downloadFiles(fileName:string) {
  this.projectService.downloadFileByID(this.projectNumber,fileName).subscribe((response)=>{
    const data = response;
    const blob = new Blob([data], { type: 'application/octet-stream' });
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  });
}
// getFile(event){
//   this.file = event.target.files[0];
//   const reader = new FileReader();
//   reader.readAsBinaryString(this.file);
//     reader.onload = () => {
//         console.log(reader.result);
//     };
// }

getFile(event){
  this.file = event.target.files[0];
  if(this.file!=undefined)
  this.size=this.file.size;

}
sendFile(){
  if(this.file!=undefined){
    if(this.size<=16000000){
      const fd = new FormData();
      fd.append('usrfile',this.file);
      fd.append('projectNumber',this.projectNumber);
      this.projectService.postFile(fd).subscribe(res =>{
       if(res['error']){
        Swal.fire('',"Hatalı dosya formatı !",'error');
       }else{
        Swal.fire('',"Dosyanız kaydedildi !",'success');
        setTimeout(() => {
          this.getFiles();
        }, 1000);
       }
        },(err)=>{
          Swal.fire('',"Dosya gönderilemedi !",'error');
        });
    }else{
      Swal.fire('',"Dosya 15 MB'den büyük olamaz !",'warning');
    }

  }else{
    Swal.fire('','Lütfen dosya seçiniz !','warning');
  }
}

getFiles(){
  this.projectService.getFileDetailById(this.projectNumber).subscribe(res =>{
    this.files=res['file_list'];
   if(this.files!=undefined)
    this.files.forEach((element)=>{
      this.projectService.downloadFileByID(this.projectNumber,element.FileName).subscribe((response)=>{
        const data = response;
        const blob = new Blob([data], { type: 'application/octet-stream' });
        element.Url=this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
      });
    });
  })
}
checkFile(){
this.selectedFile.fileName.length=0;
this.selectedFile.projectNumber=0;
var parent=document.getElementById('listFile') as HTMLInputElement;
var element=parent.childNodes[0].childNodes[0].childNodes[0] as HTMLInputElement;
parent.childNodes.forEach(element=>{
   if(parent.lastChild!=element){
 if((element.childNodes[0].childNodes[0] as HTMLInputElement).checked){
  let fileName=element.childNodes[2].textContent;
  this.selectedFile.projectNumber=this.projectNumber;
  if(fileName!=null)
  this.selectedFile.fileName.push(fileName);
 }
   }
})

}
deleteFile(){
  this.checkFile();
  if(this.selectedFile.fileName.length!=0){
    this.projectService.deleteFile(this.selectedFile).subscribe(response=>{
     if(!response['error']){
      Swal.fire('','Dosya silme işlemi başarılı !','success');
      setTimeout(() => {
        this.getFiles();
      }, 1000);
     }else{
      Swal.fire('','Dosya silme işlemi başarısız !','error');
     }
    },(err)=>{
      Swal.fire('','Dosya silme işlemi başarısız !','error');
    })
  }else{
    Swal.fire('','Seçili dosya bulunumadı !','question');
  }
}
checkedRow(event){
  if(event!=null){
    var element= event.target.parentNode as HTMLInputElement;
    if((element.childNodes[0] as HTMLInputElement).checked){
      (element.parentNode as HTMLInputElement).style.backgroundColor='#92be21';
    }else{
      (element.parentNode as HTMLInputElement).style.backgroundColor='white';
    }
  }


}

// onFileSelected(event){
//   this.convertFile(event.target.files[0]).subscribe(base64 => {
//     this.base64Output = base64;
//   });
// }
// convertFile(file :File){

//  const result = new ReplaySubject<string>(1);
//  const reader = new FileReader();
//  reader.readAsBinaryString(file);
// reader.onload = (event) => {
// let data = event.target?.result;
// if(data!=null)
//   result.next(btoa(data.toString()));
// }
//  return result;
// }


}
