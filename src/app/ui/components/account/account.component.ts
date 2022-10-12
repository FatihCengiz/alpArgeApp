import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { AccountService } from './service/account.service';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  imageUrl:any="https://www.pngkey.com/png/detail/115-1150152_default-profile-picture-avatar-png-green.png"
  photo: Blob;
  userID:string;
  user:any="";
  password:any= {
    id:0,
    newPass:""
  }

  constructor(public _DomSanitizationService: DomSanitizer,private accountService:AccountService) {
    this.accountService.spinnerShow();
   }

  ngOnInit(): void {
    this.getUser();
  }
  getUser():any {
    let id = localStorage.getItem('token');
    if (id != undefined) {
      this.accountService.getUser(id?.toString()).subscribe((response) => {
        this.userID = response['user']['0']['ID'];
        this.user=response['user']['0'];
        this.showImage();
      });
    }
  }
  setPhoto(event){
    this.photo = event.target.files[0];
  }
  onClickSubmit(){
    if(this.photo!=undefined){
      const fd = new FormData();
      fd.append('usrphoto',this.photo,this.userID+".jpg");
      this.accountService.postImage(fd).subscribe(res => {});
      let timerInterval
      Swal.fire({
             title: '',
             html: 'Yükleniyor..',
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
            Swal.showLoading()
         },
          willClose: () => {
    clearInterval(timerInterval)
    this.showImage();
    window.location.reload();
  }
      });

    }else{
      Swal.fire('','Lütfen resim seçiniz','warning');
    }

}
showImage(){
  this.accountService.getImageById(this.userID).subscribe((res) => {
    if(res['size']>100){
      this.photo = res;
      var myReader:FileReader = new FileReader();
      myReader.onloadend = (e) => {
        this.imageUrl = this._DomSanitizationService.bypassSecurityTrustUrl(<string>myReader.result);
      }
      myReader.readAsDataURL(this.photo);
    }
  });
}
deleteImage(){
  if(this.photo!=undefined){
    this.accountService.deleteImage(this.userID).subscribe((res)=>{
      let timerInterval
      Swal.fire({
             title: '',
             html: 'Siliniyor..',
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
            Swal.showLoading()
         },
          willClose: () => {
    clearInterval(timerInterval);
    window.location.reload();
  }
      });
    })
  }else{
    Swal.fire('','Kaldıralacak resim bulunamadı !','info');
  }

}
changePassword(){
  var newPass=(document.getElementById('passNew') as HTMLInputElement);
  var newPassRe=(document.getElementById('passNewRe') as HTMLInputElement);
  if(newPass.value==newPassRe.value){
    this.password.id=this.userID;
    this.password.newPass=newPass.value;
    this.accountService.changePassword(this.password).subscribe((response)=>{
      if(!response['error']){
        Swal.fire('','Şifre değiştirme işlemi başarılı !','success');
        newPass.value="";
        newPassRe.value="";
      }
    },(err)=>{
      Swal.fire('','Şifre değiştirme işlemi başarısız !','error');
    });
  }else{
    Swal.fire('','Şifre eşleşmedi !','warning');
  }

}
}
