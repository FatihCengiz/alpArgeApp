import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeModule } from './home/home.module';
import { DemandsModule } from './demands/demands.module';
import { ProjectsModule } from './projects/projects.module';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    HomeModule,
    DemandsModule,
    ProjectsModule
  ],
  exports:[
    CommonModule,
    HomeModule,
    DemandsModule,
    ProjectsModule
  ]
})
export class ComponentsModule { }
