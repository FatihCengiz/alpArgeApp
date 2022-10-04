import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectClosingProcessComponent } from './project-closing-process.component';
import { ProjectClosingProcessAddModule } from './project-closing-process-add/project-closing-process-add.module';



@NgModule({
  declarations: [
    ProjectClosingProcessComponent
  ],
  imports: [
    CommonModule,
    ProjectClosingProcessAddModule
  ],exports:[
    ProjectClosingProcessComponent,
    ProjectClosingProcessAddModule
  ]
})
export class ProjectClosingProcessModule { }
