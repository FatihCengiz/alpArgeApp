import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from './layout/layout.module';
import { ComponentsModule } from './components/components.module';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { LoginModule } from './login/login.module';



@NgModule({
  declarations: [
    WorkSpaceComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    ComponentsModule,
    LoginModule
  ],
  exports:[
    CommonModule,
    LayoutModule,
    ComponentsModule,
    LoginModule,
    WorkSpaceComponent,

  ]
})
export class UiModule { }
