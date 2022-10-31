import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects.component';
import { MyprojectModule } from './myproject/myproject.module';
import { ProjectConfirmationModule } from './project-confirmation/project-confirmation.module';
import { ProjectPlannigModule } from './project-plannig/project-plannig.module';
import { ProjectClosingModule } from './project-closing/project-closing.module';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from './search.pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { LimitToPipe } from './limit-to.pipe';



@NgModule({
  declarations: [
    ProjectsComponent,
    SearchPipe,
    LimitToPipe
  ],
  imports: [
    CommonModule,
    MyprojectModule,
    ProjectConfirmationModule,
    ProjectPlannigModule,
    ProjectClosingModule,
    FormsModule,
    Ng2SearchPipeModule
  ],
  exports:[
    ProjectsComponent,
    MyprojectModule,
    ProjectConfirmationModule,
    ProjectPlannigModule,
    ProjectClosingModule,
    LimitToPipe,
  ]
})
export class ProjectsModule { }
