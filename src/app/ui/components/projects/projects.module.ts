import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects.component';
import { MyprojectModule } from './myproject/myproject.module';
import { ProjectConfirmationModule } from './project-confirmation/project-confirmation.module';
import { ProjectPlannigModule } from './project-plannig/project-plannig.module';
import { ProjectClosingModule } from './project-closing/project-closing.module';






@NgModule({
  declarations: [
    ProjectsComponent
  ],
  imports: [
    CommonModule,
    MyprojectModule,
    ProjectConfirmationModule,
    ProjectPlannigModule,
    ProjectClosingModule
  ],
  exports:[
    ProjectsComponent,
    MyprojectModule,
    ProjectConfirmationModule,
    ProjectPlannigModule,
    ProjectClosingModule
  ]
})
export class ProjectsModule { }
