import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemandsComponent } from './demands.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { DemandAddModule } from './demand-add/demand-add.module';



@NgModule({
  declarations: [
    DemandsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path:'demands',component:DemandsComponent}]),
    DemandAddModule
  ],
  exports:[
    DemandAddModule,
    DemandsComponent
  ]
})
export class DemandsModule { }
