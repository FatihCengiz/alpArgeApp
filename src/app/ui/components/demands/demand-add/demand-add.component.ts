import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Demands } from '../model/demand';
import { DemandService } from '../service/demand.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { SelectedDemands } from '../model/selected-demand';
import { ProjectService } from '../../projects/service/project.service';
import { ProjectFile } from '../../projects/model/project-file';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-demand-add',
  templateUrl: './demand-add.component.html',
  styleUrls: ['./demand-add.component.scss'],
})
export class DemandAddComponent implements OnInit {
  demands: Demands[] = [];
  public demandForm: FormGroup;
  dataDemand: any;
  get;
  getCustomerResponse;
  projectNumber: any;
  projectNameHeader:any;
  btnVisible:any;
  user:any;
  myDate = new Date();
  date:string;
  isActive:boolean=false;
  getUserAllResponse: any;
  isVisible:boolean=true;
  groupID:any;
  userID:any;
  projectStatus:any;
  numbers:number[]=[0];
  url;
  type="png";
  file;
  size;
  files:ProjectFile[]=[];


  selectedDemands: SelectedDemands = {
    responsible: [],
    projectNumber: [],
    projectStatus: 2,
  };

  selectedFile = {
    projectNumber: 0,
    fileName: [""],
  };
  selectedTempFile = {
    userID: 0,
    fileName: [""],
  };
  trasferFile = {
    projectNumber: 0,
    userID:0,
  };
  ngOnInit(): void {}

  constructor(
    public formBuilder: FormBuilder,
    private toastr: ToastrService,
    private demandService: DemandService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private router:Router,
    private projectService:ProjectService,
    private sanitizer: DomSanitizer,
  ) {
 //   this.demandService.spinnerShow();
    this.projectNumber = this.route.snapshot.paramMap.get('id');
    var date = this.datePipe.transform(this.myDate, 'yyyy-MM-dd')?.toString();
    if(date!=undefined)
    this.date=date;
    this.getUser();
    this.getCustomer();
    this.getAllUser();

  }
  demandAdd() {
    if (this.demandForm.valid) {
      Swal.fire({
        title: 'Teklif tasla???? g??nderilecek emin misiniz ?',
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet',
      }).then((result) => {
        if (result.isConfirmed) {
          this.demandService.add(this.demandForm).then(() => {
            setTimeout(() => {
              this.formFill();
              this.sendTempFileToProjectFile();
            }, 1500);
            // setTimeout(() => {
            //   this.router.navigate(["/demands"]);
            // }, 1000);
          });
        }
      });
    } else {
      this.toastr.warning('L??tfen bo??luklar?? doldurunuz');
      for(let i=0;i<11;i++){
        var element=document.getElementById('demandForm')?.childNodes[i].childNodes[1] as HTMLInputElement
        if(element.value==""){
          element.classList.add('is-invalid');
        }else {
          element.classList.remove('is-invalid');
          element.classList.add('is-valid');
        }

      }

    }
  }
  demandSave() {
    localStorage.setItem('demand', JSON.stringify(this.demandForm.value));
    this.toastr.success('Kay??t i??lemi ba??ar??l??');
  }
  demandRemove() {
    Swal.fire({
      title: 'Teklif tasla???? silinecek emin misiniz ?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('demand');
        Swal.fire('', 'Silme ????lemi Ba??ar??l?? !', 'success').then(() => {
          this.formFill();
        });
      }
    });
  }
  formFill() {

    if (this.projectNumber != null) {
      this.btnVisible=true;
      this.demandService
        .getDemandById(this.projectNumber)
        .subscribe((response) => {
          this.get = response['demand_list'][0];
          this.projectNameHeader=this.get.ProjectName;
          this.demandForm = this.formBuilder.group({
            projectNumber: [this.projectNumber],
            projectName: [this.get.ProjectName],
            projectType: [this.get.ProjectType],
            demandType: [this.get.DemandType],
            customer: [this.get.Customer],
            demandDate: [this.get.DemandDate],
            deliveryDate: [this.get.DeliveryDate],
            facilityCode: [this.get.FacilityCode],
            quantity: [this.get.Quantity],
            feature1: [this.get.Feature1],
            feature2: [this.get.Feature2],
            feature3: [this.get.Feature3],
            feature4: [this.get.Feature4],
            feature5: [this.get.Feature5],
            feature6: [this.get.Feature6],
            requester:[this.user],
          });
          this.projectStatus=this.get.ProjectStatus
          this.demandForm.disable();
          this.showManagerAuthority();
          this.hideFileButtons();

        });
    } else if (localStorage.getItem('demand')) {
      this.btnVisible=false;
      this.dataDemand = localStorage.getItem('demand');
      var data = JSON.parse(this.dataDemand);
      this.projectNameHeader="Talep Olu??tur";
      this.demandForm = this.formBuilder.group({
        projectNumber: [data.projectNumber],
        projectName: [data.projectName],
        projectType: [data.projectType],
        demandType: [data.demandType],
        customer: [data.customer],
        demandDate: [data.demandDate],
        deliveryDate: [data.deliveryDate],
        facilityCode: [data.facilityCode],
        quantity: [data.quantity],
        feature1: [data.feature1],
        feature2: [data.feature2],
        feature3: [data.feature3],
        feature4: [data.feature4],
        feature5: [data.feature5],
        feature6: [data.feature6],
        requester:[this.user],
      });
      this.isVisible=true;
    } else {
      this.btnVisible=false;
      this.projectNameHeader="Talep Olu??tur";
      this.demandForm = this.formBuilder.group({
        projectNumber: [0],
        projectName: ['', [Validators.required]],
        projectType: ['', [Validators.required]],
        demandType: ['', [Validators.required]],
        customer: ['', [Validators.required]],
        demandDate: [this.date, [Validators.required]],
        deliveryDate: ['', [Validators.required]],
        facilityCode: ['', [Validators.required]],
        quantity: [0],
        feature1: ['', [Validators.required]],
        feature2: ['', [Validators.required]],
        feature3: [''],
        feature4: [''],
        feature5: [''],
        feature6: [''],
        requester:[this.user]
      });
      this.isVisible=true;
    }

  }
  getDemandFormValue() {
    return this.demandService.getDemandById(this.projectNumber);
  }
  getUser(){
    let id = localStorage.getItem('token');
    if (id != undefined) {
       this.demandService.getUser(id).subscribe((response)=>{
          this.user=response['user'][0].Name +" "+response['user'][0].Surname;
          this.groupID=response['user'][0].GroupID;
          this.userID=response['user'][0].ID;
          this.trasferFile.userID=this.userID;
          this.formFill();
          this.deleteTempAllFile();
          this.getFiles();
     });
    }
  }
  getCustomer(){
    this.demandService.getCustomer().subscribe((response)=>{
      this.getCustomerResponse=response['customer'];
    })
  }
  getAllUser(){
    this.demandService.getAllUser().subscribe((response) => {
      this.getUserAllResponse=response['user'];
   });
  }
  assigntResposible(){
    var selectValue=(document.getElementById('selectResponsible') as HTMLInputElement).value;
    if(selectValue!="0"){
      this.selectedDemands.projectNumber[0]=this.projectNumber;
      this.selectedDemands.responsible[0]=Number(selectValue);
      this.demandService.selectedDemandPost(this.selectedDemands).subscribe((response)=>{
        if(!response['error']){
          Swal.fire('', 'Talep Onayland?? !', 'success');
          this.router.navigate(["/demands"]);
        }else{
          Swal.fire('', 'Talep Onaylama ????lemi Ba??ar??s??z !', 'error');
        }
      },(err)=>{
        Swal.fire('', 'Talep Onaylama ????lemi Ba??ar??s??z !', 'error');
      })

    }else{
      Swal.fire('', 'L??tfen sorumlu b??l??m??n?? bo?? b??rakmay??n??z', 'warning');
    }

  }
  demandReject(){
    this.selectedDemands.projectNumber[0]=this.projectNumber;
    this.selectedDemands.responsible[0]=0;
    this.selectedDemands.projectStatus=9;
    this.demandService.selectedDemandPost(this.selectedDemands).subscribe((response)=>{
      if(!response['error']){
        Swal.fire('', 'Talep Reddedildi !', 'success');
        this.router.navigate(["/demands"]);
      }else{
        Swal.fire('', 'Talep Onaylama ????lemi Ba??ar??s??z !', 'error');
      }
    },(err)=>{
      Swal.fire('', 'Talep Onaylama ????lemi Ba??ar??s??z !', 'error');
    })
  }
  showManagerAuthority(){
    if(this.projectStatus==1 && this.groupID==1){
      this.isVisible=false;
    }else{
      this.isVisible=true;
    }
  }
  // getProjectNumber(){
  //   this.numbers.length=0;
  //   this.demandService.getDemands().subscribe((response)=>{
  //     response['demand_list'].forEach((item)=>{
  //       this.numbers.push(Number(item.ProjectNumber))
  //     });
  //      this.lastProjectMumber=Math.max.apply(null,this.numbers)+1;
  //      this.trasferFile.userID=this.lastProjectMumber;
  //   })
  // }

  hideFileButtons(){
    var inputFileElement=document.getElementById('fileButtonRow') as HTMLInputElement;
    inputFileElement.style.background='grey';
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
        fd.append('isDemandFile',"1");
        this.projectService.postFile(fd).subscribe(res =>{
         if(res['error']){
          Swal.fire('',"Hatal?? dosya format?? !",'error');
         }else{
          Swal.fire('',"Dosyan??z kaydedildi !",'success');
          setTimeout(() => {
            this.getFiles();
          }, 1000);
         }
          },(err)=>{
            Swal.fire('',"Dosya g??nderilemedi !",'error');
          });
      }else{
        Swal.fire('',"Dosya 15 MB'den b??y??k olamaz !",'warning');
      }

    }else{
      Swal.fire('','L??tfen dosya se??iniz !','warning');
    }
  }

  getFiles(){
    this.projectService.getFileDetailById(this.projectNumber,1).subscribe(res =>{
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
        Swal.fire('','Dosya silme i??lemi ba??ar??l?? !','success');
        setTimeout(() => {
          this.getFiles();
        }, 1000);
       }else{
        Swal.fire('','Dosya silme i??lemi ba??ar??s??z !','error');
       }
      },(err)=>{
        Swal.fire('','Dosya silme i??lemi ba??ar??s??z !','error');
      })
    }else{
      Swal.fire('','Se??ili dosya bulunumad?? !','question');
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
  sendTempFile(){
    if(this.file!=undefined){
      if(this.size<=16000000){
        const fd = new FormData();
        fd.append('usrfile',this.file);
        fd.append('userID',this.userID);
       // console.log(this.userID +" "+this.file )
        this.projectService.postTempFile(fd).subscribe((res) =>{
          console.log(res);
         if(res['error']){
          Swal.fire('',"Hatal?? dosya format?? !",'error');
         }else{
          Swal.fire('',"Dosyan??z kaydedildi !",'success');
          setTimeout(() => {
            this.getTempFiles();
          }, 1000);
         }
          },(err)=>{
            Swal.fire('',"Dosya g??nderilemedi !",'error');
          });
      }else{
        Swal.fire('',"Dosya 15 MB'den b??y??k olamaz !",'warning');
      }

    }else{
      Swal.fire('','L??tfen dosya se??iniz !','warning');
    }
  }
  getTempFiles(){
    this.projectService.getTempFileDetailById(this.userID).subscribe(res =>{
      this.files=res['file_list'];
     if(this.files!=undefined)
      this.files.forEach((element)=>{
        this.projectService.downloadTempFileByID(this.userID,element.FileName).subscribe((response)=>{
          const data = response;
          const blob = new Blob([data], { type: 'application/octet-stream' });
          element.Url=this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
        });
      });
    })
  }
  checkTempFile(){
    this.selectedTempFile.fileName.length=0;
    this.selectedTempFile.userID=0;
    var parent=document.getElementById('listFile') as HTMLInputElement;
    parent.childNodes.forEach(element=>{
       if(parent.lastChild!=element){
     if((element.childNodes[0].childNodes[0] as HTMLInputElement).checked){
      let fileName=element.childNodes[2].textContent;
      this.selectedTempFile.userID=this.userID;
      if(fileName!=null)
      this.selectedTempFile.fileName.push(fileName);
         }
       }
    })
  }
  deleteTempFile(){
    this.checkTempFile();
    if(this.selectedTempFile.fileName.length!=0){
    this.projectService.deleteTempFile(this.selectedTempFile).subscribe(response=>{
      console.log(response);
      if(!response['error']){
       Swal.fire('','Dosya silme i??lemi ba??ar??l?? !','success');
       setTimeout(() => {
         this.getTempFiles();
       }, 1000);
      }else{
       Swal.fire('','Dosya silme i??lemi ba??ar??s??z !','error');
      }

     },(err)=>{
       Swal.fire('','Dosya silme i??lemi ba??ar??s??z !','error');

     })
    }else{
      Swal.fire('','Se??ili dosya bulunumad?? !','question');
    }
  }
  public deleteTempAllFile(){
    this.projectService.deleteTempAllFile(this.userID).subscribe((response)=>{
    })
  }
  public transferFile(){
    this.projectService.transferFile(this.trasferFile).subscribe((response)=>{
      if(!response['error']){
        this.deleteTempAllFile();
        (document.getElementById('projectFile') as HTMLInputElement).value="";
        setTimeout(() => {
        this.getTempFiles();
    this.router.navigate(["/demands"]);
        }, 1000);
      }else{
        Swal.fire('','Dosya aktar??m?? yap??lmad??!','error');
      }
    })
  }
  public sendTempFileToProjectFile(){
    this.demandService.getMax().subscribe((response)=>{
      if(!response['error']){
        this.trasferFile.projectNumber=(Number(response['max_number']['MAX(ProjectNumber)']))
        this.transferFile();
      }else{
        Swal.fire('','Dosya g??nderme i??lemi ba??ar??s??z !','error');
      }
    },(err)=>{
      Swal.fire('','Dosya g??nderme i??lemi ba??ar??s??z !','error');
    })
   // console.log(this.trasferFile)
  }

}
