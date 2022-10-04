import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  navigationToHome(){
    this.router.navigate(['/']);
  }

}
