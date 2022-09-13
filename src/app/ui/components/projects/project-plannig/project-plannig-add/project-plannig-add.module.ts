import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectPlannigAddComponent } from './project-plannig-add.component';
import { NavModule, TabsModule } from '@coreui/angular';
import { RouterModule } from '@angular/router';





@NgModule({
  declarations: [
    ProjectPlannigAddComponent
  ],
  imports: [
    CommonModule,
    NavModule,
    TabsModule,
    RouterModule
  ],
  exports:[
    ProjectPlannigAddComponent
  ]
})
export class ProjectPlannigAddModule { }
