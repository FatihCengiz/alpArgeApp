import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Demands } from '../../demands/model/demand';
import { ProjectFile } from '../model/project-file';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  get: any;
  constructor(
    @Inject('apiUrl') private apiUrl: string,
    private httpClient: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}
  async add(form: FormGroup) {
    let Form = JSON.stringify(form.value);
    let api = this.apiUrl + '/api_demand.php';
    console.log('form');
    console.log(form);
    this.httpClient.post(api, Form).subscribe(
      (response) => {
        this.get = response;
        console.log(this.get);
        if (!this.get.error) {
          localStorage.removeItem('demand');
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
  getDemands() {
    let api =
      this.apiUrl +
      '/api_get_demands.php?all&developer_mode_key=AlpArge_Dev_Key_GET';
    return this.httpClient.get<Demands[]>(api);
  }
  getDemandById(id: string) {
    let api =
      this.apiUrl +
      '/api_get_demands.php?projectNumber=' +
      id +
      '&developer_mode_key=AlpArge_Dev_Key_GET';
    return this.httpClient.get<Demands[]>(api);
  }
  selectedDemandPost(selectedDemand: any) {
    console.log(selectedDemand);
    let api = this.apiUrl + '/api_project_update.php';
    return this.httpClient.post(api, selectedDemand);
  }
  selectedDemandClosingPost(selectedDemand: any) {
    console.log(selectedDemand);
    let api = this.apiUrl + '/api_demand_close.php';
    return this.httpClient.post(api, selectedDemand);
  }
  getUser(guid: string) {
    let api =
      this.apiUrl +
      '/api_get_user.php?id=' +
      guid +
      '&developer_mode_key=AlpArge_Dev_Key_GET';
    return this.httpClient.get(api);
  }
  getAllUser() {
    let api =
      this.apiUrl +
      '/api_get_user.php?all&isActive=True&developer_mode_key=AlpArge_Dev_Key_GET';
    return this.httpClient.get(api);
  }
  getAllUserForSource() {
    let api =
      this.apiUrl +
      '/api_get_user.php?all&isActive=False&developer_mode_key=AlpArge_Dev_Key_GET';
    return this.httpClient.get(api);
  }
  spinnerShow() {
    this.spinner.show().then(() => {
      setTimeout(() => {
        this.spinner.hide();
      }, 750);
    });
  }
  spinnerShowByTime(time:number) {
    this.spinner.show().then(() => {
      setTimeout(() => {
        this.spinner.hide();
      }, time);
    });
  }
  async save(form: any){
      let Form = JSON.stringify(form);
      let api = this.apiUrl + '/api_project.php';

      this.httpClient.post(api, Form).subscribe(
        (response) => {
          this.get = response;
         console.log(this.get);
          // if (!this.get.error) {
          //   localStorage.removeItem('demand');
          //   Swal.fire('', 'Talep Açma İşlemi Başarılı', 'success');
          // } else {
          //   Swal.fire('', 'Talep Açma İşlemi Başarısız1', 'error');
          // }
        },
        (err) => {
          Swal.fire('', 'Talep Açma İşlemi Başarısız ', 'error');
          console.log(err);
        }
      );
  }
  getBudgetPlanByID(id: string) {
    let api =
      this.apiUrl +
      '/api_get_projects.php?projectNumber=' +
      id +
      '&developer_mode_key=AlpArge_Dev_Key_GET';
    return this.httpClient.get(api);
  }
  getCurrency() {
    let api ='https://finans.truncgil.com/today.json';
    return this.httpClient.get(api);
  }
  getTaskType() {
    let api =   this.apiUrl +
    '/api_get_task_type.php?all&developer_mode_key=AlpArge_Dev_Key_GET';
    return this.httpClient.get(api);
  }
  getProjectPlanByID(id: string) {
    let api =this.apiUrl +'/api_get_project_plan.php?projectNumber='+id+'&developer_mode_key=AlpArge_Dev_Key_GET';
   return this.httpClient.get(api);
  }
  downloadFile(id:any){
    let api = this.apiUrl+"/getImage.php?id="+id+"&developer_mode_key=AlpArge_Dev_Key_GET";
    return this.httpClient.get( api, { responseType: 'blob' })
  }
  postFile(fd : FormData): Observable<string>{
    let api = this.apiUrl+'/postFile.php';
    return this.httpClient.post<string>(api, fd);
  }
  getFileById(id:any): Observable<Blob> {
    let api = this.apiUrl+"/getFile.php?id="+id+"&developer_mode_key=AlpArge_Dev_Key_GET";
    return this.httpClient.get( api, { responseType: 'blob' })
 }
 getFileDetailById(id:any,isDemandFile:any) {
  let api = this.apiUrl+"/getFile.php?id="+id+"&isDemandFile="+isDemandFile+"&developer_mode_key=AlpArge_Dev_Key_GET";
  return this.httpClient.get<ProjectFile[]>(api)
}
downloadFileByID(id:any,name:string){
  let api = this.apiUrl+"/getFileByID.php?id="+id+"&name="+name+"&developer_mode_key=AlpArge_Dev_Key_GET";
  return this.httpClient.get( api, { responseType: 'blob' })
}
deleteFile(selectedFile:any) {
  let api =this.apiUrl +'/deleteFile.php';
  return this.httpClient.post(api,selectedFile);
}
postTempFile(fd : FormData): Observable<string>{
  let api = this.apiUrl+'/postTempFile.php';
  return this.httpClient.post<string>(api, fd);
}
getTempFileDetailById(id:any) {
  let api = this.apiUrl+"/getTempFile.php?id="+id+"&developer_mode_key=AlpArge_Dev_Key_GET";
  return this.httpClient.get<ProjectFile[]>(api)
}
downloadTempFileByID(id:any,name:string){
  let api = this.apiUrl+"/getTempFileByID.php?id="+id+"&name="+name+"&developer_mode_key=AlpArge_Dev_Key_GET";
  return this.httpClient.get( api, { responseType: 'blob' })
}
deleteTempFile(selectedFile:any) {
  let api =this.apiUrl +'/deleteTempFile.php';
  return this.httpClient.post(api,selectedFile);
}
deleteTempAllFile(userID:any) {
  let api =this.apiUrl +'/deleteTempAllFile.php';
  return this.httpClient.post(api,userID);
}
transferFile(selectedFile:any) {
  let api =this.apiUrl +'/transferFile.php';
  return this.httpClient.post(api,selectedFile);
}
goToPageTop(){
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
  });
}
}
