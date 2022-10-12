import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeModule } from './home/home.module';
import { DemandsModule } from './demands/demands.module';
import { ProjectsModule } from './projects/projects.module';
import { AccountModule } from './account/account.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    HomeModule,
    DemandsModule,
    ProjectsModule,
    AccountModule,
  ],
  exports:[
    CommonModule,
    HomeModule,
    DemandsModule,
    ProjectsModule,
    AccountModule
  ]
})
export class ComponentsModule { }
