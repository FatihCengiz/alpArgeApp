import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from './layout/layout.module';
import { ComponentsModule } from './components/components.module';
import { WorkSpaceComponent } from './work-space/work-space.component';



@NgModule({
  declarations: [
    WorkSpaceComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    ComponentsModule,

  ],
  exports:[
    LayoutModule,
    ComponentsModule,
    WorkSpaceComponent,

  ]
})
export class UiModule { }
