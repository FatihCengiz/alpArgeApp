import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
get:any;
  constructor(private authService:AuthService,private router:Router) { }

  ngOnInit(): void {
    let result=this.authService.isAuth();
    if(result){
      this.router.navigate(['\home']);
    }
  }
login(userName:string,password:string){
  this.authService.login(userName,password).subscribe((response)=>{
    this.get=response;
    if(!this.get.error){

      localStorage.setItem("token", this.authService.makeRandom(this.authService.lengthOfCode,this.authService.possible));
      this.router.navigate(['\home']);
    }
  });
}
}
