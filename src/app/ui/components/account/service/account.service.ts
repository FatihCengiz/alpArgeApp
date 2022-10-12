import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(@Inject('apiUrl') private apiUrl: string,private httpClient: HttpClient,private spinner:NgxSpinnerService) { }
  postImage(fd : FormData): Observable<string>{
    let api = this.apiUrl+'/postImage.php';
    return this.httpClient.post<string>(api, fd );
  }

  getImageById(id:any): Observable<Blob> {
    let api = this.apiUrl+"/getImage.php?id="+id+"&developer_mode_key=AlpArge_Dev_Key_GET";
    return this.httpClient.get( api, { responseType: 'blob' })
 }
 getUser(guid: string) {
  let api =
    this.apiUrl +
    '/api_get_user.php?id=' +
    guid +
    '&developer_mode_key=AlpArge_Dev_Key_GET';
  return this.httpClient.get(api);
}
deleteImage(id:any){
  let api = this.apiUrl +'/api_image_delete.php?&developer_mode_key=AlpArge_Dev_Key_GET';
  return this.httpClient.post(api,id);
}
changePassword(form:any){;
  let api = this.apiUrl + "/api_password_update.php?&developer_mode_key=AlpArge_Dev_Key_GET";
  return this.httpClient.post(api,form);
}
spinnerShow() {
  this.spinner.show().then(() => {
    setTimeout(() => {
      this.spinner.hide();
    }, 1500);
  });
}
}
