import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemandAddComponent } from './ui/components/demands/demand-add/demand-add.component';
import { DemandsComponent } from './ui/components/demands/demands.component';
import { HomeComponent } from './ui/components/home/home.component';
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
    {path:'demands/add/:id',component:DemandAddComponent,loadChildren:()=>import('./ui/components/demands/demand-add/demand-add.module').then(m=>m.DemandAddModule)}
  ]},
  {path:'login',component:LoginComponent,canActivateChild:[AuthGuard],loadChildren:()=> import('./ui/login/login.module').then(m=>m.LoginModule)},
  {path:'workSpace',component:WorkSpaceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
