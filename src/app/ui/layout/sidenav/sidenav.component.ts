import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../login/services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
  }
  logout(){
    this.authService.logout();
  }

}
