import { Component, OnInit } from '@angular/core';
import { Demands } from './model/demand';
import { DemandService } from './service/demand.service';
import Swal from 'sweetalert2';
import { FormGroup } from '@angular/forms';
import { SelectedDemands } from './model/selected-demand';

@Component({
  selector: 'app-demands',
  templateUrl: './demands.component.html',
  styleUrls: ['./demands.component.scss'],
})
export class DemandsComponent implements OnInit {
  get: any;
  demands: Demands[] = [];
  selectedDemands: SelectedDemands = {
    responsible: [],
    projectNumber: [],
    projectStatus: 1,
  };
  responsibleEngineer: any[] = [
    { id: 0, name: '' },
    { id: 1, name: 'Fatih Cengiz' },
    { id: 2, name: 'Mehmet Karatokuş' },
    { id: 3, name: 'Serkan Baki' },
    { id: 4, name: 'Mahmut Yasak' },
  ];
  demandList: any[] = [];
  responsibleVisible: boolean;

  constructor(private demandService: DemandService) {}
  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.demands = [];
    this.demandService.getDemands().subscribe((response) => {
      this.get = response;
      for (let i = 0; i < this.get.demand_list.length; i++) {
        if (this.get.demand_list[i].ProjectStatus == 1) {
          this.demands.push(this.get.demand_list[i]);
        } else {
          //this.demands.push(this.get.demand_list[i]);
        }
      }
      this.responsibleVisible = false;

      console.log(this.demands);
      this.demands.forEach((element) => {
        element.Checked = false;
      });
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
    // if (e.target != null) {
    //   // console.log((e.target as HTMLInputElement).checked)
    //   let action=(e.target as HTMLInputElement).checked
    //   if((e.target as HTMLInputElement).checked==true){

    //     if(elementRef!=undefined){
    //       elementRef.style.backgroundColor="#DDDDDD";
    //       const selectedDemand: any = {
    //         projectNumber:projectNumber,
    //         event:e,
    //         action:action
    //       };
    //       this.demandList.push(selectedDemand);
    //     }

    // }
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
    let spaceControl: boolean = false;
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

            var elementCmbBx = document.getElementById(
              'cmbBx' + arrayCount.toString()
            ) as HTMLInputElement;

            var elementProjectNumber = (
              document.getElementById(
                'cmbBx' + arrayCount.toString()
              ) as HTMLInputElement
            ).parentElement?.parentElement?.children[1].textContent;

            this.selectedDemands.responsible[checkedCount] = Number(
              elementCmbBx.value
            );

            this.selectedDemands.projectNumber[checkedCount] =
              Number(elementProjectNumber);

            this.selectedDemands.projectStatus = projectStatusValue;

            if (Number(elementCmbBx.value) == 0) {
              spaceControl = true;
            }
            checkedControl = true;
            
            checkedCount++;
          }
          arrayCount++;
        });

        if (spaceControl && projectStatusValue == 2) {
          Swal.fire('', 'Lütfen sorumlu bölümünü boş bırakmayınız', 'warning');
          spaceControl = false;
        } else if (!checkedControl) {
          Swal.fire('', 'Lütfen talep seçiniz', 'warning');
        } else {
          this.demandService.selectedDemandPost(this.selectedDemands).subscribe(
            (response) => {
              console.log(response);
              this.get = response;
              if (!this.get.error) {
                this.selectedDemands = {
                  responsible: [],
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
                Swal.fire('', 'Talep Onaylama İşlemi Başarısız !', 'error');
              }
            },
            (err) => {
              console.log(err);
              Swal.fire('', 'Talep Onaylama İşlemi Başarısız !', 'error');
            }
          );
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
  // demandConfirm(
  //   e: Event,
  //   projectStatusIndex: number,
  //   title: string,
  //   message: string
  // ) {
  //   if (e.target != null) {
  //     let spaceControl: boolean = false;
  //     this.selectedDemands = {
  //       responsible: [],
  //       projectNumber: [],
  //       projectStatus: 1,
  //     };
  //     Swal.fire({
  //       title: title,
  //       text: '',
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Evet',
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         var elementCmbBx;
  //         var elementCmbBxID;

  //         elementCmbBxID = (e.target as HTMLInputElement).parentElement?.parentElement?.parentElement?.parentElement?.children[7]
  //           .children[0].id;

  //         if (elementCmbBxID != undefined) {
  //           elementCmbBx = document.getElementById(
  //             elementCmbBxID.toString()
  //           ) as HTMLInputElement;
  //           var elementProjectNumber = (e.target as HTMLInputElement)
  //             .parentElement?.parentElement?.parentElement?.parentElement?.children[1].textContent;
  //         } else {
  //         }
  //       }
  //     });
  //   }
  // }
}
