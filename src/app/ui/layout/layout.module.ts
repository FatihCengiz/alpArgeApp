import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav/sidenav.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LayoutComponent } from './layout.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FooterComponent } from './footer/footer.component';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';

@NgModule({
  declarations: [
    LayoutComponent,
    SidenavComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MdbAccordionModule
  ],
  exports:[
    LayoutComponent,
    SidenavComponent,
    NavbarComponent,
    FooterComponent,
    MdbAccordionModule
  ]
})
export class LayoutModule { }
