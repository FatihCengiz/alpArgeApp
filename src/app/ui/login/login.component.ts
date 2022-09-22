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
    this.spinner.show().then(() => {
      setTimeout(()=>{
        this.authService.login(this.user).subscribe(
          (response) => {
            this.get = response;
            console.log("login");
            console.log(this.get);
            if (!this.get.error) {
              this.toastr.success('Giriş İşlemi Başarılı');
              localStorage.setItem('token',this.get.guid);

             this.authService.getUser(this.get.guid).subscribe((response)=>{
              this.userInformation=response;
            //  console.log( this.userInformation);
             })
              this.router.navigate(['home']);
            } else {
              form.reset();
              this.toastr.error('Kullancı adı veya şifre yanlış');
            }
            this.spinner.hide();
          },
          (err) => {
            this.toastr.error('Giriş İşlemi Başarısız');
            this.spinner.hide();
          }
        );
      },1000);
    });


  }
}
