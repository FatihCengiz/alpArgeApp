import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Demands } from '../../demands/model/demand';
import { SelectedProject } from '../model/selected-project';
import { ProjectService } from '../service/project.service';

@Component({
  selector: 'app-project-plannig',
  templateUrl: './project-plannig.component.html',
  styleUrls: ['./project-plannig.component.scss'],
})
export class ProjectPlannigComponent implements OnInit {
  get: any;
  getUserResponse: any;
  getUserAllResponse: any;
  demands: Demands[] = [];
  message: string;
  selectedProject: SelectedProject = {
    projectNumber: [],
    projectStatus: 1,
  };
  responsibleVisible: boolean;

  constructor(private projectService: ProjectService, private router: Router) {}

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
          this.get.demand_list[i].ProjectStatus == 2 &&
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
        this.getUserResponse = response['user']['0'];
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

  navigationToProjectPlannigForm(e: Event) {
    var element = (e.target as HTMLInputElement).id;

    var elementProjectNumber = (
      document.getElementById(element) as HTMLInputElement
    ).parentElement?.parentElement?.parentElement?.parentElement?.children[1]
      .textContent;
    this.router.navigate(["projects/project-plannig-add/"+elementProjectNumber?.toString()]);
  }
}
