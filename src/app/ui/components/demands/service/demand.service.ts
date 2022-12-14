import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Demands } from '../model/demand';

@Injectable({
  providedIn: 'root',
})
export class DemandService {
  get;



  constructor(
    @Inject('apiUrl') private apiUrl: string,
    private httpClient: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  async add(form: FormGroup) {
    let Form = JSON.stringify(form.value);
    let api =
      this.apiUrl +
      '/api_demand.php';
    //console.log(form.value);
    this.httpClient.post(api,Form).subscribe(
      (response) => {
        this.get =response;
       // console.log(this.get);
        if (!this.get.error) {
          localStorage.removeItem("demand");
          Swal.fire('', 'Talep Açma İşlemi Başarılı', 'success');
        } else {
          Swal.fire('', 'Talep Açma İşlemi Başarısız1', 'error');
        }
      },
      (err) => {
        Swal.fire('', 'Talep Açma İşlemi Başarısız ', 'error');
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
  getRequesterDemand(requester:string){
    let api = this.apiUrl+"/api_get_demands.php?requester="+requester+"&developer_mode_key=AlpArge_Dev_Key_GET" ;
    return  this.httpClient.get<Demands[]>(api);
  }
  getResponsibleDemand(responsible:string){
    let api = this.apiUrl+"/api_get_demands.php?responsible="+responsible+"&developer_mode_key=AlpArge_Dev_Key_GET" ;
    return  this.httpClient.get<Demands[]>(api);
  }
  selectedDemandPost(selectedDemand:any){
    let api = this.apiUrl+'/api_demand_update.php' ;
    return  this.httpClient.post(api,selectedDemand);
   }
  getUser(guid:string){
    let api = this.apiUrl + "/api_get_user.php?id="+guid+"&developer_mode_key=AlpArge_Dev_Key_GET";
    return this.httpClient.get(api);
  }
  getAllUser(){
    let api = this.apiUrl + "/api_get_user.php?all&isActive=True&developer_mode_key=AlpArge_Dev_Key_GET";
    return this.httpClient.get(api);
  }
  getCustomer(){
    let api = this.apiUrl + "/api_get_customer.php?all&developer_mode_key=AlpArge_Dev_Key_GET";
    return this.httpClient.get(api);
  }
  getCurrency() {
    let api ='https://finans.truncgil.com/today.json';
    return this.httpClient.get(api);
  }
  getMax() {
    let api =this.apiUrl + "/api_get_max.php";
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
