import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './ui/components/home/home.component';
import { LayoutComponent } from './ui/layout/layout.component';
import { WorkSpaceComponent } from './ui/work-space/work-space.component';


const routes: Routes = [
  {path:'',component:LayoutComponent,children: [
    {path:'',component:HomeComponent},
    {path:'home',component:HomeComponent}
  ]},
  {path:'workSpace',component:WorkSpaceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
