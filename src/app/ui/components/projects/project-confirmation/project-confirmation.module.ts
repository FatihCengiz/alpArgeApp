import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectConfirmationComponent } from './project-confirmation.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [
    ProjectConfirmationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{path:'projects/project-confirmation',component:ProjectConfirmationComponent}]),
  ],
  exports:[
    ProjectConfirmationComponent
  ]
})
export class ProjectConfirmationModule { }
