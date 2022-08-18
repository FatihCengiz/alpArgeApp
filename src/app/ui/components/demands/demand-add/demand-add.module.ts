import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DemandAddComponent } from './demand-add.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    DemandAddComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path:'demands/add',component:DemandAddComponent}]),
    ReactiveFormsModule
  ],
  exports:[
    DemandAddComponent
  ]
})
export class DemandAddModule { }
