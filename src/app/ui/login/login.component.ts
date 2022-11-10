import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Users } from './model/user';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  get: any;
  userInformation:any;

  user: Users = { userName: '', password: '' };
  constructor(
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    let result = this.authService.isAuth();
    if (result) {
      this.router.navigate(['home']);
    }
  }
  login(form: any) {
    // this.spinner.show().then(() => {
    //   setTimeout(()=>{
        this.authService.login(this.user).subscribe(
          (response) => {
            this.get = response;
            if (!this.get.error) {
             this.authService.getUser(this.get.guid).subscribe((response)=>{
              this.userInformation=response;
              if(this.userInformation.user[0].IsActive==1){
                this.toastr.success('Giriş İşlemi Başarılı');
                localStorage.setItem('token',this.get.guid);
                this.router.navigate(['home']);
              }else{
                this.toastr.warning('Hesabınız aktif değildir');
                this.user.password="";
              }
             });

            } else {
              this.toastr.error('Kullancı adı veya şifre yanlış');
              this.user.password="";
            }
            this.spinner.hide();
          },
          (err) => {
            this.toastr.error('Giriş İşlemi Başarısız');
            //this.spinner.hide();
          }
        );
    //   },1000);
    // });


  }
}
