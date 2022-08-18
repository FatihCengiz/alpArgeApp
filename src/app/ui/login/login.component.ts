import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
get:any;
  constructor(
    private authService:AuthService,
    private router:Router,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService
    ) { }

  ngOnInit(): void {
    let result=this.authService.isAuth();
    if(result){
      this.router.navigate(['\home']);
    }
  }
login(userName:string,password:string){
  this.spinner.show().then(()=>{
    setTimeout(() => {
      this.authService.login(userName,password).subscribe((response)=>{
        this.get=response;
        if(!this.get.error){
          this.toastr.success("Giriş İşlemi Başarılı")
          localStorage.setItem("token", this.authService.makeRandom(this.authService.lengthOfCode,this.authService.possible));
          this.router.navigate(['\home']);
        }
        else{
          this.toastr.error("Kullancı adı veya şifre yanlış");
        }
        this.spinner.hide();
      },(err)=>{
        this.toastr.error("Giriş İşlemi Başarısız");
        this.spinner.hide();
      });
    }, 1000);
  })

 }
}
