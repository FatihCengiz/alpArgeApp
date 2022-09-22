import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProjectPlannigAddComponent } from './project-plannig-add.component';
import { NavModule, TabsModule } from '@coreui/angular';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ProjectPlannigAddComponent,
  ],
  imports: [
    CommonModule,
    NavModule,
    TabsModule,
    RouterModule,

  ],
  exports:[
    ProjectPlannigAddComponent
  ],providers:[
    CurrencyPipe
  ]
})
export class ProjectPlannigAddModule { }
