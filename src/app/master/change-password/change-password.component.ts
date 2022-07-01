import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { RestAPIService } from 'src/app/services/restAPI.service';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  logged_user: User;
  showErrMsg: boolean;
  blockSpace: RegExp = /[^\s]/;
  SpecialCharErrMsg: boolean;
  pswdStrongMsg: boolean;
  NumericErrMsg: boolean;
  UpperCaseErrMsg: boolean;
  LengthErrMsg: boolean;
  showMatchMsg: boolean;
 
  @ViewChild ('f', { static: false }) changePwdForm: NgForm;
  constructor(private _restApiService: RestAPIService, private _authService: AuthService,
    private _messageService: MessageService) { }

  ngOnInit(): void {
    this.logged_user = this._authService.UserInfo;

  }

  onSubmit() {
    const params = {
      'NewPwd': this.newPassword,
      'OldPwd': this.oldPassword,
      'OldEncryptedPwd': this.logged_user.token,
      'UserId': this.logged_user.userID
    }
    this._restApiService.put(PathConstants.UserMaster_Put, params).subscribe(res => {
      if (res.item1) {
        this.onClear();
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.PasswordChangeSuccess
        });
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: res.item2
        });
      }
    })
  }

  checkPassword() {
    if (this.newPassword !== undefined && this.newPassword !== null && this.newPassword.trim() !== '' &&
    this.confirmPassword !== undefined && this.confirmPassword !== null && this.confirmPassword.trim() !== '') {
          if(this.newPassword.trim() !== this.confirmPassword.trim()) {
            this.showErrMsg = true;
            this.showMatchMsg = false;
          } else {
            this.showErrMsg = false;
            this.showMatchMsg = true;
          }
    } else {
      this.showErrMsg = false;
    }
  }

  check(NewPassword) {

     if (NewPassword.match(/[@$!%*?&]/g)) {
     this.SpecialCharErrMsg = false;
     } else {
     this.SpecialCharErrMsg = true;
     this.pswdStrongMsg = false;
    }    
   if (NewPassword.match(/[0-9]/g)) {   
     this.NumericErrMsg = false;
    } else {    
    this.NumericErrMsg = true;    
    this.pswdStrongMsg = false;    
    }    
    if (NewPassword.match(/[A-Z]/g)) {    
    this.UpperCaseErrMsg = false;    
    } else {    
    this.UpperCaseErrMsg = true;    
    this.pswdStrongMsg = false;    
    }    
    if (NewPassword.length > 8) {    
    this.LengthErrMsg = false;    
    } else {    
    this.LengthErrMsg = true;    
    this.pswdStrongMsg = false;
    }
    if (NewPassword.match(/[@$!%*?&]/g) && NewPassword.match(/[0-9]/g) && NewPassword.match(/[A-Z]/g) && NewPassword.length > 8)
    this.pswdStrongMsg = true;
   }

   onClear() {
    this.changePwdForm.form.markAsUntouched();
    this.changePwdForm.form.markAsPristine();
    this.oldPassword = null;
    this.newPassword = null;
    this.confirmPassword = null;

   }
}
