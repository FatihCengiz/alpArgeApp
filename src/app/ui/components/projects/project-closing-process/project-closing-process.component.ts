import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Demands } from '../../demands/model/demand';
import { ProjectService } from '../service/project.service';

@Component({
  selector: 'app-project-closing-process',
  templateUrl: './project-closing-process.component.html',
  styleUrls: ['./project-closing-process.component.scss']
})
export class ProjectClosingProcessComponent implements OnInit {
  get: any;
  getUserResponse: any;
  getUserAllResponse: any;
  demands: Demands[] = [];
  message: string;
  responsibleVisible: boolean;

  constructor(private projectService: ProjectService, private router: Router) {this.projectService.goToPageTop();}

  ngOnInit(): void {
    this.projectService.spinnerShow();
    this.getUser();
    this.getAllUser();
  }
  getList() {
    this.demands = [];
    this.projectService.getDemands().subscribe((response) => {
      this.get = response;

      for (let i = 0; i < this.get.demand_list.length; i++) {
        if (
          this.get.demand_list[i].ProjectStatus >= 4 &&
          this.getUserResponse.ID == this.get.demand_list[i].Responsible
        ) {
          this.demands.push(this.get.demand_list[i]);
        }
      }
      this.demands.forEach((element) => {
        element.Checked = false;
      });
    });
  }
  getUser(): any {
    let id = localStorage.getItem('token');
    if (id != undefined) {
      this.projectService.getUser(id?.toString()).subscribe((response) => {
        this.getUserResponse = response['user'][0];
        if (this.getUserResponse.GroupID == 2) {
          this.responsibleVisible = true;
        } else {
          this.responsibleVisible = false;
          this.router.navigate(['/home']);
        }
        this.getList();
      });
    }
  }
  getAllUser() {
    this.projectService.getAllUser().subscribe((response) => {
      this.getUserAllResponse = response['user'];
    });
  }

  navigationToProjectPlannigForm(projectNumber:any) {
    var number=(projectNumber as HTMLInputElement).childNodes[0].textContent;
    this.router.navigate(["projects/project-closing-process/add/"+number]);
  }

}
