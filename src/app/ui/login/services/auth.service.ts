import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
  lengthOfCode:number = 40;

  constructor( @Inject("apiUrl") private apiUrl:string, private httpClient:HttpClient,private router:Router) { }

  login(form:any){;
    let api = this.apiUrl + "/api_login.php";
    return this.httpClient.post(api,form);
  }

  logout(){
    localStorage.removeItem("token");
    this.router.navigate(['\login']);
  }
  getUser(guid:string){
    let api = this.apiUrl + "/api_get_user.php?id="+guid+"&developer_mode_key=AlpArge_Dev_Key_GET";
    return this.httpClient.get(api);
  }
  isAuth(){
    if(localStorage.getItem("token")){
      return true
    }else{
      return false;
    }
  }

   makeRandom(lengthOfCode: number, possible: string) {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
      return text;
  }



}
