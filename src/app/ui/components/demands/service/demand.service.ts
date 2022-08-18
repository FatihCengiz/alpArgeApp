import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class DemandService {
  get: any;
  bool: any;
  constructor(
    @Inject('apiUrl') private apiUrl: string,
    private httpClient: HttpClient,
    private toastr: ToastrService
  ) {}
  async add(form: FormGroup) {
    let bool;
    let api =
      this.apiUrl +
      '/api_demand.php?ID=1&projectNumber=' +
      form.getRawValue().projectNumber +
      '&projectName=' +
      form.getRawValue().projectName +
      '&projectType=' +
      form.getRawValue().projectType +
      '&demandType=' +
      form.getRawValue().demandType +
      '&customer=' +
      form.getRawValue().customer +
      '&demandDate=' +
      form.getRawValue().demandDate +
      '&deliveryDate=' +
      form.getRawValue().deliveryDate +
      '&facilityCode=' +
      form.getRawValue().facilityCode +
      '&quantity=' +
      form.getRawValue().quantity +
      '&feature1=' +
      form.getRawValue().feature1 +
      '&feature2=' +
      form.getRawValue().feature2 +
      '&feature3=' +
      form.getRawValue().feature3 +
      '&feature4=' +
      form.getRawValue().feature4 +
      '&feature5=' +
      form.getRawValue().feature5 +
      '&feature6=' +
      form.getRawValue().feature6 +
      '&developer_mode_key=AlpArge_Dev_Key_GET';

    this.httpClient.get(api).subscribe(
      (response) => {
        this.get = response;
        if (!this.get.error) {
          localStorage.removeItem("demand");
          Swal.fire('', 'Talep Açma İşlemi Başarılı', 'success');
        } else {
          Swal.fire('', 'Talep Açma İşlemi Başarısız', 'error');
        }
      },
      (err) => {
        Swal.fire('', 'Talep Açma İşlemi Başarısız', 'error');
      }
    );
  }
}
