import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-plannig-add',
  templateUrl: './project-plannig-add.component.html',
  styleUrls: ['./project-plannig-add.component.scss'],
})
export class ProjectPlannigAddComponent implements OnInit {
  projectNumber;
  activePane = 0;
  public panes = [
    { name: 'Home 01', content: 'One' },
    { name: 'Profile 02', content: 'Two' },
    { name: 'Contact 03', content: 'Three' },
    { name: 'Disabled 04', content: 'Four' },
  ];

  constructor(private route: ActivatedRoute) {
    this.projectNumber = this.route.snapshot.paramMap.get('id');
    console.log(this.projectNumber);
  }

  ngOnInit(): void {}
  onTabChange($event: number) {
    this.activePane = $event;
    console.log('onTabChange', $event);
  }
  createText() {
    // var y=document.getElementById('textcreate1');
    // var x = document.createElement('BUTTON');
    // var t = document.createTextNode('Click me');
    // x.appendChild(t);
    // y?.appendChild(x);
    // console.log(y);
  }
}
