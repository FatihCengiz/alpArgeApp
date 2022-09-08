import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../login/services/auth.service';
import { SidenavService } from './service/sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  demandQuantity;
  get;
  constructor(private authService:AuthService, private sidenavService:SidenavService) {
    this.sidenavService.getDemands().subscribe((response)=>{
      this.get=response;
      this.demandQuantity=this.get.demand_list.filter(x => x.ProjectStatus==1).length;
    })

   }

  ngOnInit(): void {
  }
  logout(){
    this.authService.logout();
  }

}
