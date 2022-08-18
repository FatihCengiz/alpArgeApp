import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Demands } from '../model/demand-model';
import { DemandService } from '../service/demand.service';
import { timeout } from 'rxjs/operators';
import Swal from 'sweetalert2';

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

  ngOnInit(): void {}

  constructor(
    public formBuilder: FormBuilder,
    private toastr: ToastrService,
    private demandService: DemandService
  ) {
    this.formFill();
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
    if (localStorage.getItem('demand')) {
      this.dataDemand = localStorage.getItem('demand');
      var data = JSON.parse(this.dataDemand);

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
      });
    } else {
      this.demandForm = this.formBuilder.group({
        projectNumber: [0],
        projectName: ['', [Validators.required]],
        projectType: ['', [Validators.required]],
        demandType: ['', [Validators.required]],
        customer: ['', [Validators.required]],
        demandDate: ['', [Validators.required]],
        deliveryDate: ['', [Validators.required]],
        facilityCode: ['', [Validators.required]],
        quantity: [0],
        feature1: ['', [Validators.required]],
        feature2: ['', [Validators.required]],
        feature3: [''],
        feature4: [''],
        feature5: [''],
        feature6: [''],
      });
    }
  }
}
