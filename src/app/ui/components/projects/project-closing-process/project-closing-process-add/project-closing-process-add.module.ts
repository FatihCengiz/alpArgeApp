import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectClosingProcessAddComponent } from './project-closing-process-add.component';
import { NavModule, TabsModule } from '@coreui/angular';
import { RouterModule } from '@angular/router';
import {MatCheckboxModule} from '@angular/material/checkbox'



@NgModule({
  declarations: [
    ProjectClosingProcessAddComponent
  ],
  imports: [
    CommonModule,
    NavModule,
    TabsModule,
    RouterModule,
    MatCheckboxModule

  ],exports:[
    ProjectClosingProcessAddComponent
  ]
})
export class ProjectClosingProcessAddModule { }
