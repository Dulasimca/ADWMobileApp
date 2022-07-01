import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService, Message } from 'primeng/api';
import { ResponseMessage } from '../Common-Modules/messages';
import { PathConstants } from '../Common-Modules/PathConstants';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-application-status',
  templateUrl: './application-status.component.html',
  styleUrls: ['./application-status.component.css']
})
export class ApplicationStatusComponent implements OnInit {

  login_user: User;
  aadharNo: number;
  mobNo: number;
  dob: any;
  yearRange: string;
  registeredDetails: any = [];
  status: any;
  msgs: Message[];
  studentName: any;
  pdfDialog: boolean;
  studentId: any;
  hostelId: any;

  constructor(private _datePipe: DatePipe, private _restApiService: RestAPIService, 
    private _messageService: MessageService, private _authService: AuthService) { }

  ngOnInit(): void {
    this.login_user = this._authService.UserInfo;
    const current_year = new Date().getFullYear();
    const start_year_range = current_year - 50;
    this.yearRange = start_year_range + ':' + current_year;
  }


  checkStatus() {
    this.registeredDetails = [];
    const params = {
      'AadharNo': this.aadharNo,
      'MobileNo': this.mobNo,
      'Dob': this._datePipe.transform(this.dob, 'MM/dd/yyyy')
      //  'AadharNo': '305278756145',
      // 'MobileNo': '9840227196',
      // 'Dob': '02/08/1997'
    }
    this._restApiService.getByParameters(PathConstants.OnlineStudentRegistration_Get, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        res.forEach(r => {
          this.status = r.districtApproval;
          this.studentName = r.studentName;
          this.studentId = r.studentId;
          this.hostelId = r.hostelId;
          
        })
        this.registeredDetails = res;
        if (this.status === 0) {
          // var msg = "District Approval status has been rejected! Please Contact TNWHO-Admin for further queries!"
          // this._messageService.clear();
          // this._messageService.add({
          //   key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR, life: 5000,
          //   summary: ResponseMessage.SUMMARY_REJECTED, detail: msg
          // });
          this.msgs = [{ severity: 'warn', summary: 'Pending', detail: 'Your Application is still in pending!' }];
          // this.msgs = [{ severity: 'error', summary: 'Rejected', detail: 'Hi' + ' ' + this.studentName + '!' + ' ' + 'Your District Approval has been rejected! Please Contact TNWHO-Admin for further queries.' }];
        } else {

        }
        if (this.status === 1) {
          // var msg = "District Approval status has been approved!"
          // this._messageService.clear();
          // this._messageService.add({
          //   key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS, life: 5000,
          //   summary: ResponseMessage.SUMMARY_APPROVED, detail: msg
          // });
          this.msgs = [{ severity: 'success', summary: 'Selected', detail:  'Your Application has been selected!' }];
          this.onDialogShow();
        } else {

        }
        if (this.status === 2) {
          this.msgs = [{ severity: 'error', summary: 'Rejected', detail: 'Your Application has been rejected! Please Contact TNWHO-Admin for further queries.' }];
          // this.msgs = [{ severity: 'warn', summary: 'Pending', detail: 'Hi' + ' ' + this.studentName + '!' + ' ' + 'Your District Approval status is still in pending!' }];

          // var msg = "District Approval status is still in pending"
          // this._messageService.clear();
          // this._messageService.add({
          //   key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING, life: 5000,
          //   summary: ResponseMessage.SUMMARY_WARNING, detail: msg
          // });
        } else {

        }
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
        })
      }
    })
  }

  onSearch() {
  }

  onAadharChange() { }

  onDialogShow() {
    var src = this.login_user.domainUrl + 'assets/layout/Reports/' + this.hostelId+ '/' + this.aadharNo + '_' + this.studentId + '.pdf';
    document.getElementById("embedPDF").setAttribute('src', src);
  }
}
