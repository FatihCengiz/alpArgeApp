import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemandsComponent } from './demands.component';
import { RouterModule } from '@angular/router';
import { DemandAddModule } from './demand-add/demand-add.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DemandsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path:'demands',component:DemandsComponent}]),
    DemandAddModule,
    FormsModule,
  ],
  exports:[
    DemandAddModule,
    DemandsComponent
  ]
})
export class DemandsModule { }
