import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Demands } from '../../demands/model/demand';
import { SelectedProject } from '../model/selected-project';
import { ProjectService } from '../service/project.service';

@Component({
  selector: 'app-myproject',
  templateUrl: './myproject.component.html',
  styleUrls: ['./myproject.component.scss']
})
export class MyprojectComponent implements OnInit {
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

  constructor(private projectService: ProjectService, private router: Router) {this.projectService.goToPageTop()}

  ngOnInit(): void {
    this.projectService.spinnerShow();
    this.getUser();
    this.getAllUser();
    var array = [{"id":3645,"date":"2018-07-05T13:13:37","date_gmt":"2018-07-05T13:13:37","guid":{"rendered":""},"modified":"2018-07-05T13:13:37","modified_gmt":"2018-07-05T13:13:37","slug":"vpwin","status":"publish","type":"matrix","link":"","title":{"rendered":"VPWIN"},"content":{"rendered":"","protected":false},"featured_media":0,"parent":0,"template":"","better_featured_image":null,"acf":{"domain":"SMB","ds_rating":"3","dt_rating":""},},{"id":3645,"date":"2018-07-05T13:13:37","date_gmt":"2018-07-05T13:13:37","guid":{"rendered":""},"modified":"2018-07-05T13:13:37","modified_gmt":"2018-07-05T13:13:37","slug":"vpwin","status":"publish","type":"matrix","link":"","title":{"rendered":"adfPWIN"},"content":{"rendered":"","protected":false},"featured_media":0,"parent":0,"template":"","better_featured_image":null,"acf":{"domain":"SMB","ds_rating":"3","dt_rating":""}},{"id":3645,"date":"2018-07-05T13:13:37","date_gmt":"2018-07-05T13:13:37","guid":{"rendered":""},"modified":"2018-07-05T13:13:37","modified_gmt":"2018-07-05T13:13:37","slug":"vpwin","status":"publish","type":"matrix","link":"","title":{"rendered":"abfPWIN"},"content":{"rendered":"","protected":false},"featured_media":0,"parent":0,"template":"","better_featured_image":null,"acf":{"domain":"SMB","ds_rating":"3","dt_rating":""}}];
    array.sort((a,b) => a.title.rendered.localeCompare(b.title.rendered));

     console.log(array);
  }
  getList() {
    this.demands = [];
    this.projectService.getDemands().subscribe((response) => {
      this.get = response;

      for (let i = 0; i < this.get.demand_list.length; i++) {

        if (this.get.demand_list[i].ProjectStatus >=2 && this.get.demand_list[i].ProjectStatus <=9  && this.getUserResponse.ID==this.get.demand_list[i].Responsible) {
          this.demands.push(this.get.demand_list[i]);
        }
      }
      this.demands.forEach((element) => {
        element.Checked = false;
      });
      this.demands.sort((a,b) => a.ProjectStatus.toString().localeCompare(b.ProjectStatus.toString()));
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
  getEvent(event:Event){
    this.projectService.spinnerShow();
    // var projectNumber=((event.target)as HTMLInputElement).childNodes[0].textContent;
    // this.router.navigate(['/projects/project-plannig-add/'+projectNumber])

  }

}
