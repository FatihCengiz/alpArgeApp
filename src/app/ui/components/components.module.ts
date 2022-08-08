import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { DemandsComponent } from './demands/demands.component';



@NgModule({
  declarations: [
    HomeComponent,
    DemandsComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    HomeComponent,
    DemandsComponent
  ]
})
export class ComponentsModule { }
