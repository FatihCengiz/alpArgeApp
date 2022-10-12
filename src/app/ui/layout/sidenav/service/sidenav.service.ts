import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Demands } from 'src/app/ui/components/demands/model/demand';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  constructor( @Inject('apiUrl') private apiUrl: string,private httpClient:HttpClient) {

   }
   getDemands(){
    let api = this.apiUrl+'/api_get_demands.php?all&developer_mode_key=AlpArge_Dev_Key_GET' ;
    return  this.httpClient.get<Demands[]>(api);
  }
  getDemandCount(){
    let api = this.apiUrl+'/api_get_demands.php?getCount&developer_mode_key=AlpArge_Dev_Key_GET' ;
    return  this.httpClient.get<Demands[]>(api);
  }
  getUser(guid:string){
    let api = this.apiUrl + "/api_get_user.php?id="+guid+"&developer_mode_key=AlpArge_Dev_Key_GET";
    return this.httpClient.get(api);
  }
  getImageById(id:any): Observable<Blob> {
    let api = this.apiUrl+"/getImage.php?id="+id+"&developer_mode_key=AlpArge_Dev_Key_GET";
    return this.httpClient.get( api, { responseType: 'blob' })
 }

}
