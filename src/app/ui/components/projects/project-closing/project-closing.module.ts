import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectClosingComponent } from './project-closing.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ProjectClosingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path:'projects/project-closing',component:ProjectClosingComponent}]),
  ],
  exports:[
    ProjectClosingComponent
  ]
})
export class ProjectClosingModule { }
