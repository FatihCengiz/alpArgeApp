import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule} from'@angular/common/http';



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild([{path:'login',component:LoginComponent}])
  ],
  exports: [
    LoginComponent
  ]
})
export class LoginModule { }
