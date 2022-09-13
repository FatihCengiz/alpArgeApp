import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyprojectComponent } from './myproject.component';



@NgModule({
  declarations: [
    MyprojectComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    MyprojectComponent
  ]
})
export class MyprojectModule { }
