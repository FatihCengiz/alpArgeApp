import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Demands } from '../../demands/model/demand';
import { SelectedProject } from '../model/selected-project';
import { ProjectService } from '../service/project.service';


@Component({
  selector: 'app-project-confirmation',
  templateUrl: './project-confirmation.component.html',
  styleUrls: ['./project-confirmation.component.scss']
})
export class ProjectConfirmationComponent implements OnInit {
  get: any;
  getUserResponse: any;
  getUserAllResponse: any;
  demands: Demands[] = [];
  message:string;
  selectedProject: SelectedProject = {
    projectNumber: [],
    projectStatus: 1,
  };
  responsibleVisible: boolean;

  constructor(private projectService:ProjectService,private router:Router) { this.projectService.goToPageTop()}

  ngOnInit(): void {
    this.projectService.spinnerShow();
    this.getUser()
    this.getAllUser();
    this.getList();
  }
  getList() {
    this.demands = [];
    this.projectService.getDemands().subscribe((response) => {
      this.get = response;

      for (let i = 0; i < this.get.demand_list.length; i++) {
        if (this.get.demand_list[i].ProjectStatus == 3 ) {
          this.demands.push(this.get.demand_list[i]);
        }

      }
      this.demands.forEach((element) => {
        element.Checked = false;
      });
    });

  }
  getUser():any {
    let id = localStorage.getItem('token');
    if (id != undefined) {
      this.projectService.getUser(id?.toString()).subscribe((response) => {
        this.getUserResponse = response['user']['0'];
        if (this.getUserResponse.GroupID == 1) {
          this.responsibleVisible = true;
        } else {
          this.responsibleVisible = false;
          this.router.navigate(['/home']);
        }
      });
    }

  }
  getAllUser(){
    this.projectService.getAllUser().subscribe((response) => {
      this.getUserAllResponse=response['user'];
    //  console.log(this.getUserAllResponse);
  });
}

  checkBoxControl(e: Event) {
    if (e.target != null) {
      let projectNumber = (e.target as HTMLInputElement).parentElement
        ?.parentElement?.parentElement?.children[1].textContent;
      let action = (e.target as HTMLInputElement).checked;
      let index = this.demands.findIndex(
        (x) => x.ProjectNumber == Number(projectNumber)
      );
      if (action == true) {
        this.demands[Number(index)].Checked = true;
      } else {
        this.demands[Number(index)].Checked = false;
      }
    }

  }

  checkBoxControlAll(e: Event) {
    if (e.target != null) {
    }
  }

  selectedDemandConfirm(
    projectStatusValue: number,
    title: string,
    message: string
  ) {

    let checkedControl: boolean = false;
    Swal.fire({
      title: title,
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet',
    }).then((result) => {
      if (result.isConfirmed) {
        let arrayCount = 0,
          checkedCount = 0;
        this.demands.forEach((element) => {
          if (element.Checked == true) {

            var elementProjectNumber = (
              document.getElementById(
                'chckBx'+arrayCount.toString()
              ) as HTMLInputElement
            ).parentElement?.parentElement?.parentElement?.children[1].textContent;

            this.selectedProject.projectNumber[checkedCount] =
              Number(elementProjectNumber);

            this.selectedProject.projectStatus = projectStatusValue;
            checkedControl = true;

            checkedCount++;
          }
          arrayCount++;
        });

        if (!checkedControl) {
          Swal.fire('', 'L??tfen talep se??iniz', 'warning');
        } else {
          if (this.responsibleVisible) {
            this.projectService
              .selectedDemandPost(this.selectedProject)
              .subscribe(
                (response) => {
                  this.get = response;
                  if (!this.get.error) {
                    this.selectedProject = {
                      projectNumber: [],
                      projectStatus: 1,
                    };
                    setTimeout(() => {
                      Swal.fire('', message, 'success').then(() => {
                        checkedControl = false;
                        this.getList();
                      });
                    }, 1000);
                  } else {
                    Swal.fire('', 'B??t??e Onaylama ????lemi Ba??ar??s??z !', 'error');
                  }
                },
                (err) => {
                  Swal.fire('', 'B??t??e Onaylama ????lemi Ba??ar??s??z !', 'error');
                }
              );
          }
          else{
            Swal.fire('', 'Yetkiniz yok !', 'error');
          }
        }
      }
    });
  }

  selectAll() {
    let index: Number = this.demands.length;
    var elementChckBxAll = document.getElementById(
      'chckBxAll'
    ) as HTMLInputElement;
    for (let i = 0; i < index; i++) {
      var elementChckBx = document.getElementById(
        'chckBx' + i.toString()
      ) as HTMLInputElement;
      if (elementChckBxAll.checked == true) {
        elementChckBx.checked = true;
        this.demands[i].Checked = true;
      } else {
        elementChckBx.checked = false;
        this.demands[i].Checked = false;
      }
    }
  }
  getEvent(event:Event){
    this.projectService.spinnerShow();
  }
}
