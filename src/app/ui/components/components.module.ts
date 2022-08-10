import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeModule } from './home/home.module';
import { DemandsModule } from './demands/demands.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HomeModule,
    DemandsModule
  ],
  exports:[
    CommonModule,
    HomeModule,
    DemandsModule
  ]
})
export class ComponentsModule { }
