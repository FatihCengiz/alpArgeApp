import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { SelectedProject } from '../../model/selected-project';
import { ProjectService } from '../../service/project.service';
import * as XLSX from 'xlsx';
import { ProjectFile } from '../../model/project-file';
import { DomSanitizer } from '@angular/platform-browser';
import { _isNumberValue } from '@angular/cdk/coercion';


@Component({
  selector: 'app-project-plannig-add',
  templateUrl: './project-plannig-add.component.html',
  styleUrls: ['./project-plannig-add.component.scss'],
})
export class ProjectPlannigAddComponent implements OnInit {
  projectNumber;
  activePane = 0;
  public budgetPlan = {
     form1Elements:[""],
     form2Elements:[[""]],
     form3Elements:[[""]],
     form5Elements:[""]
};
updateDemand = {
  responsible: [0],
  projectNumber: [0],
  projectStatus: 3,
  actualDeliveryDate:""
};
closingDemand = {
  projectNumber: [0],
  projectStatus: 5,
  actualDeliveryDate:""

};
selectedProject: SelectedProject = {
  projectNumber: [],
  projectStatus: 1,
};
  // { form1Element2: 'Profile 02' },
  // { form1Element3: 'Contact 03'},
  // { form1Element4: 'Disabled 04' }, form1Elements:{data1:"",data2:"",data3:"",data4:"",data5:"",data6:"",data7:"",data8:"",data9:""} }
  sources:any []=[];
  projeNo;
  myModel:string="data1";
  public projectForm: FormGroup;
  emptyForm2Control:boolean=false;
  emptyForm3Control:boolean=false;
  getDemandResponse:any;
  getPlanProjectResponse:any;
  getUser:any;
  getUserResponse:any;
  getTaskTypeResponse:any[]=[];
  tempTaskTypeResponse:any[]=[]
  currency:any;
  dolar:any;
  euro:any;
  tlPrice:string;
  totalPrice:string;
  isActive:boolean;
  isVisible:boolean=true;
  isClosing:boolean=true;
  isManager:boolean=false;
  isPreview:boolean=false;
  myDate = new Date();
  date:string;

  url;
  type="png";
  file;
  size;
  files:ProjectFile[]=[];

  projectPlanJsonList:any = []
  expenseItemJsonList:any = []

  sourceID:any=['990','991','992'];
  sourceName:any=['CNC','MONTAJ','TORNA'];

 excelData:any;
  constructor(
    private route: ActivatedRoute,
    private projectService:ProjectService,
    private cp:CurrencyPipe,
    private toastr:ToastrService,
    private datePipe: DatePipe,
    private router:Router,
    private sanitizer: DomSanitizer) {
    this.projectNumber = this.route.snapshot.paramMap.get('id');
    this.getAllUserForSource();
    this.getCurrency();
    this.getTaskType();
    this.projectService.spinnerShowByTime(1500);

    var date = this.datePipe.transform(this.myDate, 'yyyy-MM-dd')?.toString();
    if(date!=undefined)
    this.date=date;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.getBudgetPlan();
    }, 1500);
  }
  onTabChange($event: number) {
    this.activePane = $event;
  }
  getAllUserForSource(){
    this.projectService.getAllUser().subscribe((response)=>{
      // this.getUser=response['user'];
      this.sources=response['user'];

      // this.source = Object.keys(response['user']).map(key => ({value: response['user'][key]}));
      //extra soure
      for(let i=0;i<this.sourceID.length;i++){
        const extraSource={
          ID:this.sourceID[i],
          UserName:this.sourceName[i],
          Name:this.sourceName[i],
          Surname:''
        }
        this.sources.push(extraSource);
      }

      // this.getUser=this.source;

      this.getFiles();
    })
  }
  managerAuthority():any {
    let id = localStorage.getItem('token');
    if (id != undefined) {
      this.projectService.getUser(id?.toString()).subscribe((response) => {
        this.getUserResponse = response['user']['0'];
        if(this.getUserResponse.GroupID==1)
        this.isManager=true;
      });
    }

  }
  getUserByID(responsible:any){
    let id = localStorage.getItem('token');
    if (id != undefined) {
      this.projectService.getUser(id?.toString()).subscribe((response) => {
        this.getUserResponse = response['user']['0'];

        if(this.getUserResponse.ID!=responsible)
        this.disablePlans();
      });
    }
  }
  getCurrency(){
    this.projectService.getCurrency().subscribe((response)=>{
      if(response!=undefined || response!=null){
        this.currency=response;
        this.dolar=this.currency.USD.Sat????.trim().replace(",",".");
        this.euro=this.currency.EUR.Sat????.trim().replace(",",".");
      }else{
        Swal.fire('', 'Kur bilgisi ??ekilemedi !', 'error');
      }
    },(err)=>{
      Swal.fire('', 'Kur bilgisi ??ekilemedi !', 'error');
    });
  }
  getTaskType(){
    this.projectService.getTaskType().subscribe((response)=>{
      this.getTaskTypeResponse=response['task_type_list'];
      this.tempTaskTypeResponse=this.getTaskTypeResponse;
    })
  }
  createRow(row:string,mainDiv:string) {
    var parent=document.getElementById(mainDiv);
    var index=parent?.childNodes.length;

    var child = document.getElementById(row);
    var childIndex=parent?.childNodes.length;

    var cloneChild=child?.cloneNode(true);
    (cloneChild as HTMLInputElement).id=row+index;

    if(cloneChild!=null)
    parent?.appendChild(cloneChild);
    //this.saveToList1(Number(index)-1,Number(childIndex)); incele ***

  }
deleteRow(mainDiv,baseRowID,columnIndex){
  var parent=document.getElementById(mainDiv);
  var baseRow=document.getElementById(baseRowID);
  if(parent?.lastChild!=null &&  parent.childNodes.length>1)
  {
    parent?.removeChild(parent.lastChild);
  }else{
    for(let j=0;j<columnIndex;j++){
      var element = (baseRow?.children[j].children[0] as HTMLInputElement);
      element.value="";
    }
  }
}

save(){
if(!this.isActive){
  var parent=document.getElementById("mainDiv");
  var index =parent?.childNodes.length;

  var parent2=document.getElementById("mainDivTab2");
  var index2 =parent2?.childNodes.length;

  var child=document.getElementById('projectPlannigRow');
  var indexChild1 =child?.childNodes.length;

  var child2=document.getElementById('projectExpense');
  var indexChild2 =child2?.childNodes.length;

// let result=this.emptyControl('projectPlannigRow',indexChild1,2) ;
// let result2=this.emptyControl('projectExpense',indexChild2,3) ;


  if(this.emptyControl('projectPlannigRow',indexChild1,2)){
    Swal.fire('', 'L??tfen proje plan?? sekmesindeki bo??luklar?? kontrol ediniz !', 'error');
  }
  if(this.emptyControl('projectExpense',indexChild2,3) ){
    Swal.fire('', 'L??tfen gider kalemlerindeki sekmesindeki bo??luklar?? kontrol ediniz !', 'error');
  }else{
    this.currencyCalculate();
    this.hourPriceCalculate();
    this.saveToPlannedDeliveryDate();
    this.saveToList1(Number(index),Number(indexChild1));
    this.saveToList2(Number(index2),Number(indexChild2));
    this.getBudgetTab();
    this.projectService.save(this.budgetPlan);
    this.toastr.success('Kay??t Ba??ar??l??');
  }
}

}
saveToPlannedDeliveryDate(){
  var form1Element=(document.getElementById('form1text9') as HTMLInputElement).value;
  this.budgetPlan.form1Elements[0] = this.projectNumber;
  if(form1Element==""){
    this.budgetPlan.form1Elements[1]="2022-01-01";
  }else{
    this.budgetPlan.form1Elements[1] = form1Element;
  }

}
saveToList1(parentIndex:number,childIndex:number){
  let newList : string[] = [];
  this.budgetPlan.form2Elements=[[""]];
  let id="projectPlannigRow";
  for(let i=0;i<parentIndex;i++){
    if(i!=0){
        var parent=document.getElementById(id+i.toString());
      }else{
        var parent=document.getElementById(id);
      }
    for(let j=0;j<childIndex;j++){
      var form2Element=(parent?.children[j].children[0] as HTMLInputElement).value;
      newList.push(form2Element);
      }
      this.budgetPlan.form2Elements[i]=newList;
      newList=[];
    }

}

saveToList2(index:number,childIndex:number){
  let newList : string[] = [];
  this.budgetPlan.form3Elements=[[""]];
  let id="projectExpense";
  for(let i=0;i<index;i++){
    if(i!=0){
        var parent=document.getElementById(id+i.toString());
      }else{
        var parent=document.getElementById(id);
      }
    for(let j=0;j<childIndex;j++){
      var form3Element=(parent?.children[j].children[0] as HTMLInputElement).value;

      newList.push(form3Element);
      }
      this.budgetPlan.form3Elements[i]=newList;
      newList=[];
    }

}
getBudgetTab(){
  this.budgetPlan.form5Elements=[];
  var parent=document.getElementById("form5MainDiv");
  var form5Element1=(parent?.children[0].children[0].children[1] as HTMLInputElement).value.replace('TRY','').trim();
  var form5Element2=(parent?.children[1].children[0].children[1] as HTMLInputElement).value.replace('TRY','').trim();
  var form5Element3=(parent?.children[5].children[0].children[1] as HTMLInputElement).value.replace('TRY','').trim();
  this.budgetPlan.form5Elements.push(form5Element1);
  this.budgetPlan.form5Elements.push(form5Element2);
  this.budgetPlan.form5Elements.push(form5Element3);
}

emptyControl(parentID,childIndex,formID):boolean{
  let emptyControl:boolean=false;
  var parent1=document.getElementById(parentID);

  var parentIndex=parent1?.parentElement?.childNodes.length;
  if(parentIndex!=undefined)
  if(this.emptyForm2Control && formID==2 ){
    for(let j=0;j<childIndex;j++){
      var formElement=(parent1?.children[j].children[0] as HTMLInputElement).value;
      if(formElement==""){
        emptyControl=true;
        }
      }
  }
  else if(this.emptyForm3Control && formID==3){
    for(let j=0;j<childIndex;j++){
      var formElement=(parent1?.children[j].children[0] as HTMLInputElement).value;
      if(formElement==""){
        emptyControl=true;
        }
      }
  }

  return emptyControl;
}

form2Control() {

    this.emptyForm2Control=true;
    var index=(document.getElementById('form2text1') as HTMLSelectElement).selectedIndex;
    this.getTaskTypeResponse=this.tempTaskTypeResponse;
    this.getTaskTypeResponse=this.getTaskTypeResponse.reduce((r,n,i)=>{
      if(index==1){r.push(n); return r;}
      else if(index==2){( i === 1 || i === 2 || i === 8 || i === 11 || i === 13 || i === 17 || i === 18 || i === 20) && r.push(n); return r;}
      else if(index==3){( i === 14) && r.push(n); return r;}
      else if(index==4){( i === 3 || i === 6 || i === 7 || i === 9 || i === 15 || i === 16 || i === 19 ) && r.push(n); return r;}
      else if(index==5){( i === 5 || i === 12 ) && r.push(n); return r;}
      else if(index==6){( i === 17 ) && r.push(n); return r;}
      else if(index==7){( i === 0 ) && r.push(n); return r;}
    },[])

  }

form3Control(event) {
  if(event=!null){
    this.emptyForm3Control=true;
  }
}

getBudgetPlan(){
  this.projectService.getDemandById(this.projectNumber).subscribe((response)=>{
    this.getDemandResponse=response['demand_list'][0];
    var form1=(document.getElementById('form1') as HTMLInputElement);
    var form1Element1=form1.children[0].childNodes[0].childNodes[1] as HTMLInputElement;
    var form1Element2=form1.children[0].childNodes[1].childNodes[1] as HTMLInputElement;
    var form1Element3=form1.children[1].childNodes[0].childNodes[1] as HTMLInputElement;
    var form1Element4=form1.children[1].childNodes[1].childNodes[1] as HTMLInputElement;
    var form1Element5=form1.children[2].childNodes[0].childNodes[1] as HTMLInputElement;
    var form1Element6=form1.children[2].childNodes[1].childNodes[1] as HTMLInputElement;
    var form1Element7=form1.children[3].childNodes[0].childNodes[1] as HTMLInputElement;
    var form1Element8=form1.children[3].childNodes[1].childNodes[1] as HTMLInputElement;
    form1Element1.value=this.getDemandResponse.ProjectNumber;
    form1Element2.value=this.getDemandResponse.ProjectName;
    form1Element3.value=this.getDemandResponse.ProjectType;
    form1Element4.value=this.getDemandResponse.Customer;
    form1Element5.value=this.getDemandResponse.Requester;
    form1Element6.value=this.getDemandResponse.Engineer;
    form1Element7.value=this.getDemandResponse.DemandDate;
    form1Element8.value=this.getDemandResponse.DeliveryDate;
    var responsible=this.getDemandResponse.Responsible;

    if(this.getDemandResponse.ProjectStatus==3){
      this.managerAuthority();
      this.isActive=true;
      this.isClosing=false;
    }else if(this.getDemandResponse.ProjectStatus==4){
      this.isVisible=true;
      this.isClosing=false;
      this.isManager=false;
    }else if(this.getDemandResponse.ProjectStatus==2){
        this.isManager=false;
        this.isClosing=true;
        this.isVisible=false;
    }
    if(this.getDemandResponse.ProjectStatus>2){//disable plan
      this.disablePlans();
      this.isClosing=false;
    }
    this.getUserByID(responsible)

    var form4=(document.getElementById('form4MainDiv') as HTMLInputElement);
    var form4Element1=form4.children[0].childNodes[0].childNodes[1] as HTMLInputElement;
    var form4Element2=form4.children[0].childNodes[1].childNodes[1] as HTMLInputElement;
    var form4Element3=form4.children[1].childNodes[0].childNodes[1] as HTMLInputElement;
    var form4Element4=form4.children[1].childNodes[1].childNodes[1] as HTMLInputElement;
    var form4Element5=form4.children[2].childNodes[0].childNodes[1] as HTMLInputElement;
    var form4Element6=form4.children[2].childNodes[1].childNodes[1] as HTMLInputElement;
    form4Element1.value=this.getDemandResponse.Feature1;
    form4Element2.value=this.getDemandResponse.Feature2;
    form4Element3.value=this.getDemandResponse.Feature3;
    form4Element4.value=this.getDemandResponse.Feature4;
    form4Element5.value=this.getDemandResponse.Feature5;
    form4Element6.value=this.getDemandResponse.Feature6;

  });
  this.projectService.getBudgetPlanByID(this.projectNumber).subscribe((response)=>{
    this.getPlanProjectResponse=response;

    if(!this.getPlanProjectResponse.error2){
      this.getPlanProjectResponse.project_plan.forEach((element)=>{
        this.projectPlanJsonList.push(element)

      })
      var form1=(document.getElementById('form1') as HTMLInputElement);
      var form1Element9=form1.children[4].childNodes[0].childNodes[1] as HTMLInputElement;
      form1Element9.value=this.getPlanProjectResponse['demand_project_list'][0].PlannedDeliveryDate;


      let id="projectPlannigRow";
      var form2=document.getElementById(id);

      let rowProjectPlanNumber=this.getPlanProjectResponse['project_plan'].length;
      let childIndex=form2?.childNodes.length;

      for(let i=0;i<rowProjectPlanNumber;i++){

        const mapped = Object.keys(this.getPlanProjectResponse['project_plan'][i]).map(key => ({type: key, value: this.getPlanProjectResponse['project_plan'][i][key]}));

        if(i==0){
          var parent=document.getElementById(id);
        }else{
          this.createRow(id,'mainDiv');
          var parent=document.getElementById(id+i.toString());
        }

      for(let j=0;j<Number(childIndex);j++){
         var form2Element=(parent?.children[j].children[0] as HTMLInputElement);
         form2Element.value=mapped[j+1].value;
         }

      }
    }

    if(!this.getPlanProjectResponse.error3){
      this.getPlanProjectResponse.expense_item.forEach((element)=>{
        this.expenseItemJsonList.push(element)
      })
      let id="projectExpense";
      var form2=document.getElementById(id);
      let rowExpenseItemNumber=this.getPlanProjectResponse['expense_item'].length;/*aa2*/
      let childIndex2=form2?.childNodes.length;

      for(let i=0;i<rowExpenseItemNumber;i++){

        const mapped = Object.keys(this.getPlanProjectResponse['expense_item'][i]).map(key => ({type: key, value: this.getPlanProjectResponse['expense_item'][i][key]}));


        if(i==0){
          var parent=document.getElementById(id);
        }else{
          this.createRow(id,'mainDivTab2');
          var parent=document.getElementById(id+i.toString());
        }

      for(let j=0;j<Number(childIndex2);j++){
        var form2Element=(parent?.children[j].children[0] as HTMLInputElement);
        form2Element.value=mapped[j+1].value
        }
      }
    }

    if(!this.getPlanProjectResponse.error4){
      var parent=document.getElementById("form5MainDiv");
      var form5Element1=(parent?.children[0].children[0].children[1] as HTMLInputElement);
      var form5Element2=(parent?.children[1].children[0].children[1] as HTMLInputElement);
      var form5Element3=(parent?.children[5].children[0].children[1] as HTMLInputElement);
      form5Element1.value=this.getPlanProjectResponse['budget_list'][0]['R&DProjectCost'] +" TRY";
      form5Element2.value=this.getPlanProjectResponse['budget_list'][0]['MaterialCost']+" TRY";
      form5Element3.value=this.getPlanProjectResponse['budget_list'][0]['TotalCost']+" TRY";
    }
  });
}
currencyCalculate() {
let totalBudget=0;
var parent=document.getElementById('mainDivTab2');
parent?.childNodes.forEach(element => {
var quantiy=(element.childNodes[2].childNodes[0] as HTMLInputElement).value
var foreignCurrency=(element.childNodes[4].childNodes[0] as HTMLInputElement).value
var price:any=(element.childNodes[5].childNodes[0] as HTMLInputElement).value;
var tlPrice=(element.childNodes[6].childNodes[0] as HTMLInputElement);
var totalPrice=(element.childNodes[7].childNodes[0] as HTMLInputElement);
if(quantiy!=""){
  if(foreignCurrency=="1"){
    var priceEURCurrency:any= this.cp.transform(this.euro*price,'TRY ','symbol','');
    tlPrice.value=priceEURCurrency;
    priceEURCurrency= this.cp.transform((this.euro*price)*Number(quantiy),'TRY','','');
    totalPrice.value=priceEURCurrency
    totalBudget=((this.euro*price)*Number(quantiy))+totalBudget
   }
   else if(foreignCurrency=="2"){
    var priceUSDCurrency:any= this.cp.transform(this.dolar*price,'TRY ','symbol','');
    tlPrice.value=priceUSDCurrency;
    priceUSDCurrency= this.cp.transform((this.dolar*price)*Number(quantiy),'TRY','','');
    totalPrice.value=priceUSDCurrency;
    totalBudget=((this.dolar*price)*Number(quantiy))+totalBudget
   }
   else if(foreignCurrency=="3"){
    var priceUSDCurrency:any= this.cp.transform(price,'TRY ','symbol','');
    tlPrice.value=priceUSDCurrency;
    priceUSDCurrency= this.cp.transform(price*Number(quantiy),'TRY','','');
    totalPrice.value=priceUSDCurrency
    totalBudget=((price)*Number(quantiy))+totalBudget
   }

   totalBudget=Math.round((totalBudget + Number.EPSILON) * 100) / 100;
   this.budgetCalculate(2,totalBudget)
  }else{
    Swal.fire('', 'L??tfen miktar alan??n?? bo?? b??rakmay??n??z !', 'warning');
  }
  });
 }

 hourPriceCalculate(){
  let totalBudget=0;
  var parent=document.getElementById('mainDiv');
  parent?.childNodes.forEach(element => {
    // var hourPrice2=(element.childNodes[1].childNodes[0] as HTMLInputElement).value.toString().split("/",2)[1];
    var hourPriceSource=(element.childNodes[1].childNodes[0] as HTMLInputElement).value
    if((element.childNodes[1].childNodes[0]as HTMLInputElement).value!="")
      {
        var hourPrice = this.getTaskTypeResponse.find(x=>x.Source == hourPriceSource).HourPrice;
        var price=element.childNodes[6].childNodes[0] as HTMLInputElement;
        var totalPrice=element.childNodes[7].childNodes[0] as HTMLInputElement;
        var hours=(element.childNodes[3].childNodes[0] as HTMLInputElement).value;
        if(hourPrice != "0" && hours != ""){
          price.value=hourPrice;
          totalPrice.value=(Number(hourPrice)*Number(hours)).toString();
        }else{
          Swal.fire('', 'L??tfen Kaynak ve S??re alan??n?? bo?? b??rakmay??n??z !', 'warning');
        }
        totalBudget=totalBudget+Number(totalPrice.value);
        totalBudget=Math.round((totalBudget + Number.EPSILON) * 100) / 100;
        this.budgetCalculate(3,totalBudget)
      }else{
        this.budgetCalculate(3,0)
      }

  });
 }
budgetCalculate(formID:number,cost:number){
var parent=document.getElementById('form5MainDiv');
var expenseItemCost=parent?.childNodes[1].childNodes[0].childNodes[1] as HTMLInputElement;
expenseItemCost.value=expenseItemCost.value.replace('TRY','');
var projectPlanCost=parent?.childNodes[0].childNodes[0].childNodes[1] as HTMLInputElement
projectPlanCost.value=projectPlanCost.value.replace('TRY','');
var total=parent?.childNodes[5].childNodes[0].childNodes[1] as HTMLInputElement;
if(formID==2){
  expenseItemCost.value=cost.toString().trim() + ' TRY';
  projectPlanCost.value=projectPlanCost.value.trim() + ' TRY';
}else{
  projectPlanCost.value=cost.toString().trim()  + ' TRY';
  expenseItemCost.value=expenseItemCost.value.trim() + ' TRY';
}

total.value=(Number(projectPlanCost.value.replace('TRY',''))+Number(expenseItemCost.value.replace('TRY',''))).toString().trim() + ' TRY';
}
send(){
  var plannedDate=(document.getElementById('form1text9') as HTMLInputElement);
  if(this.expanseItemControl()){
    Swal.fire('', 'Gider kalemlerindeki bo??luklar?? doldurunuz !', 'warning');
  }else if(this.projectPlanEmptyControl()){
    Swal.fire('', 'Proje plan??ndaki bo??luklar?? doldurunuz !', 'warning');
  }
  else if(this.dateControl()){
    Swal.fire('', 'Ba??lang???? tarihi biti?? tarihinden b??y??k olamaz !', 'warning');
  }
  else if(!this.isActive && plannedDate.value!="" ){
    plannedDate.classList.remove('is-invalid')
    Swal.fire({
      title: '',
      text: 'Onaya g??nderilecek emin misiniz ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet',
    }).then((result) => {
      if (result.isConfirmed) {
        var responsible=(document.getElementById('form1text6') as HTMLInputElement).value;
        this.updateDemand.responsible[0]=Number(responsible);
        this.updateDemand.projectNumber[0]=Number(this.projectNumber);
        this.projectService.selectedDemandPost(this.updateDemand).subscribe((response) => {
          if(!response["error"]){
            this.isActive=true;
            Swal.fire('', 'Onaya G??nderildi !', 'success');
          }

        });
      }
    })
  }else{
    Swal.fire('', 'L??tfen zorunlu alanlar?? bo?? b??rakmay??n??z !', 'warning');
    plannedDate.classList.add('is-invalid')
    if(plannedDate.value!="")
      plannedDate.classList.remove('is-invalid')
  }

}

  budgetSend(){
    this.selectedProject.projectNumber[0]=this.projectNumber;
    this.selectedProject.projectStatus=4;
    this.projectService.selectedDemandPost(this.selectedProject).subscribe((response)=>{
      if(!response['error']){
        Swal.fire('', "B??t??e Plan?? Onayland?? !", 'success');
        this.router.navigate(["projects/project-confirmation/"]);

      }else{
        Swal.fire('', 'B??t??e Onaylama ????lemi Ba??ar??s??z !', 'error');
      }
    },(err)=>{
      Swal.fire('', 'B??t??e Onaylama ????lemi Ba??ar??s??z !', 'error');
    });
  }
  budgetReject(){
    this.selectedProject.projectNumber[0]=this.projectNumber;
    this.selectedProject.projectStatus=2;
    this.projectService.selectedDemandPost(this.selectedProject).subscribe((response)=>{
      if(!response['error']){
        Swal.fire('', "B??t??e Plan?? Reddedildi !", 'success');
        this.router.navigate(["projects/project-confirmation/"]);
      }else{
        Swal.fire('', 'B??t??e Onaylama ????lemi Ba??ar??s??z !', 'error');
      }
    },(err)=>{
      Swal.fire('', 'B??t??e Onaylama ????lemi Ba??ar??s??z !', 'error');
    });
  }
  projectPlanEmptyControl():boolean{
    var returnValue=false;
    var parent=document.getElementById('mainDiv');
    parent?.childNodes.forEach(element => {
      var child=(element.childNodes[0] as HTMLInputElement)
      child.parentNode?.childNodes.forEach(element=>{
        var inputs=(element.childNodes[0] as HTMLInputElement)
        if(inputs.value=="" || inputs.value=="0" ){
          inputs.classList.add("is-invalid");
          returnValue=true;
        }else{
          inputs.classList.remove("is-invalid");
        }
      })

    })
    return returnValue;
  }
  expanseItemControl(){
    var returnValue=false;
    var parent=document.getElementById('mainDivTab2');
    parent?.childNodes.forEach(element => {
      var firstChild=(element.childNodes[0].childNodes[0] as HTMLInputElement)
      var child=(element.childNodes[0] as HTMLInputElement)

      if(firstChild.value!="0")
      {
         child.parentNode?.childNodes.forEach(element=>{
          var inputs=(element.childNodes[0] as HTMLInputElement)
          if(inputs.value=="0" || inputs.value==""){
            returnValue=true;
            inputs.classList.add('is-invalid');
          }else{
            inputs.classList.remove('is-invalid');
          }

         })
      }
    });
    return returnValue;
  }
  dateControl():boolean{
    var returnValue=false;
    var parent=document.getElementById('mainDiv') as HTMLInputElement;
    parent?.childNodes.forEach(element => {
      var dataStart=(element.childNodes[4].childNodes[0] as HTMLInputElement);
      var dataEnd=(element.childNodes[5].childNodes[0] as HTMLInputElement);
      const d1 = new Date(dataStart.value);
      const d2 = new Date(dataEnd.value);
      if(d1>d2){
        returnValue=true;
        dataStart.classList.add('is-invalid');
        dataEnd.classList.add('is-invalid');
      }else{
        dataStart.classList.remove('is-invalid');
        dataEnd.classList.remove('is-invalid');
      }
    });
    return returnValue;
  }
  disablePlans(){
    var parent=document.getElementById('form1text9');
    parent?.setAttribute('disabled','');
     parent=document.getElementById('mainDiv');
    parent?.childNodes.forEach(element => {
      var child=(element.childNodes[0] as HTMLInputElement)
      child.parentNode?.childNodes.forEach(element=>{
        var inputs=(element.childNodes[0] as HTMLInputElement)
        inputs.setAttribute('disabled','')
      })
    });
     parent=document.getElementById('mainDivTab2');
    parent?.childNodes.forEach(element => {
      var child=(element.childNodes[0] as HTMLInputElement)
      child.parentNode?.childNodes.forEach(element=>{
        var inputs=(element.childNodes[0] as HTMLInputElement)
        inputs.setAttribute('disabled','')
      })
    });
    this.isPreview=true;
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    downloadFile(){
      this.projectService.downloadFile(2).subscribe((response)=>{
        const data = response;
        const blob = new Blob([data], { type: 'application/octet-stream' });
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
      })
    }
    downloadFiles(fileName:string) {
      this.projectService.downloadFileByID(this.projectNumber,fileName).subscribe((response)=>{
        const data = response;
        const blob = new Blob([data], { type: 'application/octet-stream' });
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
      });
    }
    getFiles(){
      this.projectService.getFileDetailById(this.projectNumber,1).subscribe(res =>{
        this.files=res['file_list'];
       if(this.files!=undefined)
        this.files.forEach((element)=>{
          this.projectService.downloadFileByID(this.projectNumber,element.FileName).subscribe((response)=>{
            const data = response;
            const blob = new Blob([data], { type: 'application/octet-stream' });
            element.Url=this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
          });
        });
      })
    }
    readExcel(event:any){
      let file=event.target.files[0];
      if(event.target.files[0].type=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
        let fileReader=new FileReader();
        fileReader.readAsBinaryString(file);

        fileReader.onload=(e)=>{
          var workBook=XLSX.read(fileReader.result,{type:'binary'});
          var sheetNames=workBook.SheetNames;
         this.excelData= XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]])
        }
      }else{
        Swal.fire('', 'Excel format?? bulunamad?? !', 'error');
        (document.getElementById('projectPlanFileInput') as HTMLInputElement).value="";

      }

    }
    importExcel(rowID:string,mainDiv:string,formIndex:Number){
      try{
        if(_isNumberValue(this.excelData[0].ProjectNumber)){
          let rowNumber=this.excelData.length;
          var formColNumber=document.getElementById(rowID)?.childNodes.length;
          this.deleteAllRow(Number(rowNumber),Number(formColNumber),mainDiv,rowID);
          for(let i=0;i<rowNumber;i++){
            const mapped = Object.keys(this.excelData[i]).map(key => ({type: key, value: this.excelData[i][key]}));
            if(i==0){
              var parent=document.getElementById(rowID);
            }else{
              this.createRow(rowID,mainDiv);
              var parent=document.getElementById(rowID+i.toString());
            }
            for(let j=0;j<Number(formColNumber);j++){
              var form2Element=(parent?.children[j].children[0] as HTMLInputElement);
             form2Element.value=mapped[j+1].value;
             if(formIndex==1){
              this.projectPlanJsonList=this.excelData;
             }else{
              this.expenseItemJsonList=this.excelData;
             }
            }
          }
          this.hourPriceCalculate();
          this.currencyCalculate();
        }else{
          Swal.fire('', 'Uygun format bulunamad?? !', 'error');
          (document.getElementById('projectPlanFileInput') as HTMLInputElement).value="";
        }
      }catch(err){
        Swal.fire('', 'Dosya bulunamad?? !', 'error');
        (document.getElementById('projectPlanFileInput') as HTMLInputElement).value="";
      }

    }

    exportexcel(fileName:string, jsonList:any)
    {
      /* pass here the table id */
      let element = document.getElementById('excel-table');
      const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(jsonList);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, fileName);

    }
    deleteAllRow(rowIndex:Number,columnIndex:Number,mainDiv:string,rowID:string){
      for(let j=0;j<rowIndex;j++){
        var parent=document.getElementById(mainDiv);
        var baseRow=document.getElementById(rowID);
        if(parent?.lastChild!=null &&  parent.childNodes.length>1){
          parent?.removeChild(parent.lastChild);
        }else{
          for(let j=0;j<columnIndex;j++){
            var element = (baseRow?.children[j].children[0] as HTMLInputElement);
            element.value="";
          }
        }
      }

    }
}
