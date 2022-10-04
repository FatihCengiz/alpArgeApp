import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyprojectComponent } from './myproject.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    MyprojectComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path:'projects/myproject',component:MyprojectComponent}]),
  ],
  exports:[
    MyprojectComponent
  ]
})
export class MyprojectModule { }
