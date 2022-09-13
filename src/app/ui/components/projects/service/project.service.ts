import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Demands } from '../../demands/model/demand';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
get:any;
  constructor(
    @Inject('apiUrl') private apiUrl: string,
    private httpClient: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {

   }
   async add(form: FormGroup) {
    let Form = JSON.stringify(form.value);
    let api =
      this.apiUrl +
      '/api_demand.php';
    console.log("form");
    console.log(form);
    this.httpClient.post(api,Form).subscribe(
      (response) => {
        this.get =response;
        console.log(this.get);
        if (!this.get.error) {
          localStorage.removeItem("demand");
          Swal.fire('', 'Talep Açma İşlemi Başarılı', 'success');
        } else {
          Swal.fire('', 'Talep Açma İşlemi Başarısız1', 'error');
        }
      },
      (err) => {
        Swal.fire('', 'Talep Açma İşlemi Başarısız ', 'error');
        console.log(err);
      }
    );
  }
   getDemands(){
    let api = this.apiUrl+'/api_get_demands.php?all&developer_mode_key=AlpArge_Dev_Key_GET' ;
    return  this.httpClient.get<Demands[]>(api);
  }
  getDemandById(id:string){
    let api = this.apiUrl+"/api_get_demands.php?projectNumber="+id+"&developer_mode_key=AlpArge_Dev_Key_GET" ;
    return  this.httpClient.get<Demands[]>(api);
  }
   selectedDemandPost(selectedDemand:any){
    console.log(selectedDemand);
    let api = this.apiUrl+'/api_project_update.php' ;
    return  this.httpClient.post(api,selectedDemand);
   }
   getUser(guid:string){
    let api = this.apiUrl + "/api_get_user.php?id="+guid+"&developer_mode_key=AlpArge_Dev_Key_GET";
    return this.httpClient.get(api);
  }
  getAllUser(){
    let api = this.apiUrl + "/api_get_user.php?all&developer_mode_key=AlpArge_Dev_Key_GET";
    return this.httpClient.get(api);
  }
   spinnerShow(){
    this.spinner.show().then(() => {
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);

    });
   }
}
