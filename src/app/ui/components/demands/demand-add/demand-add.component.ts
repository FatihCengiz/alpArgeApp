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
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';


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

  ngOnInit(): void {}

  constructor(
    public formBuilder: FormBuilder,
    private toastr: ToastrService,
    private demandService: DemandService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
 //   this.demandService.spinnerShow();
    this.projectNumber = this.route.snapshot.paramMap.get('id');
    var date = this.datePipe.transform(this.myDate, 'yyyy-MM-dd')?.toString();
    if(date!=undefined)
    this.date=date;
    this.getUser();
    this.getCustomer();

  }
  demandAdd() {
    if (this.demandForm.valid) {
      Swal.fire({
        title: 'Teklif taslağı gönderilecek emin misiniz ?',
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
            }, 1000);
          });
        }
      });
    } else {
      this.toastr.warning('Lütfen boşlukları doldurunuz');
    }
  }
  demandSave() {
    localStorage.setItem('demand', JSON.stringify(this.demandForm.value));
    this.toastr.success('Kayıt işlemi başarılı');
  }
  demandRemove() {
    Swal.fire({
      title: 'Teklif taslağı silinecek emin misiniz ?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('demand');
        Swal.fire('', 'Silme İşlemi Başarılı !', 'success').then(() => {
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
          this.demandForm.disable();
        });
    } else if (localStorage.getItem('demand')) {
      this.btnVisible=false;
      this.dataDemand = localStorage.getItem('demand');
      var data = JSON.parse(this.dataDemand);
      this.projectNameHeader="Talep Oluştur";
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
    } else {
      this.btnVisible=false;
      this.projectNameHeader="Talep Oluştur";
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
          this.formFill();

     })
    }
  }
  getCustomer(){
    this.demandService.getCustomer().subscribe((response)=>{

      this.getCustomerResponse=response['customer'];
    })
  }
}
