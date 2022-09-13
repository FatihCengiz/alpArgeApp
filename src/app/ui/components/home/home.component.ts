import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  constructor(private spinner:NgxSpinnerService) {
    this.spinnerShow();
   }

  ngOnInit(): void {
  }
  spinnerShow(){
    this.spinner.show().then(() => {
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);

    });
   }

}
