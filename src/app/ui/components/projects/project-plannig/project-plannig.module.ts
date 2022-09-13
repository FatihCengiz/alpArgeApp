import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectPlannigComponent } from './project-plannig.component';
import { ProjectPlannigAddModule } from './project-plannig-add/project-plannig-add.module';



@NgModule({
  declarations: [
    ProjectPlannigComponent,
  ],
  imports: [
    CommonModule,
    ProjectPlannigAddModule
  ],
  exports:[
    ProjectPlannigComponent,
    ProjectPlannigAddModule
  ]
})
export class ProjectPlannigModule { }
