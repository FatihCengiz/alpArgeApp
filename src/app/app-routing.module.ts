import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemandAddComponent } from './ui/components/demands/demand-add/demand-add.component';
import { DemandsComponent } from './ui/components/demands/demands.component';
import { HomeComponent } from './ui/components/home/home.component';
import { MyprojectComponent } from './ui/components/projects/myproject/myproject.component';
import { ProjectClosingComponent } from './ui/components/projects/project-closing/project-closing.component';
import { ProjectConfirmationComponent } from './ui/components/projects/project-confirmation/project-confirmation.component';
import { ProjectPlannigAddComponent } from './ui/components/projects/project-plannig/project-plannig-add/project-plannig-add.component';
import { ProjectPlannigComponent } from './ui/components/projects/project-plannig/project-plannig.component';
import { ProjectsComponent } from './ui/components/projects/projects.component';
import { LayoutComponent } from './ui/layout/layout.component';
import { AuthGuard } from './ui/login/guard/auth.guard';
import { LoginGuard } from './ui/login/guard/login.guard';
import { LoginComponent } from './ui/login/login.component';
import { WorkSpaceComponent } from './ui/work-space/work-space.component';


const routes: Routes = [
  {path:'',component:LayoutComponent, canActivateChild: [AuthGuard],children: [
    {path:'',component:HomeComponent,loadChildren:()=> import('./ui/components/home/home.module').then(m=>m.HomeModule)},
    {path:'home',component:HomeComponent,loadChildren:()=> import('./ui/components/home/home.module').then(m=>m.HomeModule)},
    {path:'demands',component:DemandsComponent,loadChildren:()=> import('./ui/components/demands/demands.module').then(m=>m.DemandsModule)},
    {path:'demands/add',component:DemandAddComponent,loadChildren:()=>import('./ui/components/demands/demand-add/demand-add.module').then(m=>m.DemandAddModule)},
    {path:'demands/add/:id',component:DemandAddComponent,loadChildren:()=>import('./ui/components/demands/demand-add/demand-add.module').then(m=>m.DemandAddModule)},
    {path:'projects',component:ProjectsComponent,loadChildren:()=> import('./ui/components/projects/projects.module').then(m=>m.ProjectsModule)},
    {path:'projects/myproject',component:MyprojectComponent,loadChildren:()=> import('./ui/components/projects/myproject/myproject.module').then(m=>m.MyprojectModule)},
    {path:'projects/project-confirmation',component:ProjectConfirmationComponent,loadChildren:()=> import('./ui/components/projects/project-confirmation/project-confirmation.module').then(m=>m.ProjectConfirmationModule)},
    {path:'projects/project-plannig',component:ProjectPlannigComponent,loadChildren:()=> import('./ui/components/projects/project-plannig/project-plannig.module').then(m=>m.ProjectPlannigModule)},
    {path:'projects/project-closing',component:ProjectClosingComponent,loadChildren:()=> import('./ui/components/projects/project-closing/project-closing.module').then(m=>m.ProjectClosingModule)},
    {path:'projects/project-plannig-add/:id',component:ProjectPlannigAddComponent,loadChildren:()=> import('./ui/components/projects/project-plannig/project-plannig-add/project-plannig-add.module').then(m=>m.ProjectPlannigAddModule)},
  ]},
  {path:'login',component:LoginComponent,canActivateChild:[AuthGuard],loadChildren:()=> import('./ui/login/login.module').then(m=>m.LoginModule)},
  {path:'workSpace',component:WorkSpaceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
