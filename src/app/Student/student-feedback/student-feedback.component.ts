import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MessageService, SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-student-feedback',
  templateUrl: './student-feedback.component.html',
  styleUrls: ['./student-feedback.component.css']
})
export class StudentFeedbackComponent implements OnInit {
  hostelName: string;
  studentName: string;
  feedBack: string;
  replyMessage: string;
  login_user: User;
  cols: any;
  data: any = [];
  Districtid: number;
  Hostelid: number;
  TalukId: number;
  studentid: number;
  RowId: 0;
  replyDate = Date;

  @ViewChild('f', { static: false }) studentFeedbackForm: NgForm;

  constructor(private _authService: AuthService,private _restApiService: RestAPIService,private _messageService: MessageService
    ,private http: HttpClient) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'Districtname', header: 'District Name', width: '200px', align: 'left !important'},
      { field: 'HostelName', header: 'Hostel Name', width: '200px', align: 'left !important'},
      { field: 'StudentName', header: 'Student Name', width: '200px', align: 'left !important'},
      { field: 'FBMessage', header: 'Feedback', width: '200px', align: 'left !important'},
      { field: 'ReplyMessage', header: 'Reply Message', width: '200px', align: 'left !important'},
    ];
    this.onView();
    this.login_user = this._authService.UserInfo;
    this.Districtid = this.login_user.districtCode;
    this.Hostelid = this.login_user.hostelId;
    this.TalukId = this.login_user.talukId;
    this.studentid = this.login_user.userID;
  }

  onSubmit() {
    const params = {
      'Slno': this.RowId,
      'ReplyMessage': this.replyMessage ,
      'ActionDate': this.replyDate,
    };
    this._restApiService.post(PathConstants.FeedBack_Post,params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res) {
          // this.blockUI.stop();
           this.onClear();
           this.onView();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          });

        } else {
          // this.blockUI.stop();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          });
        }
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      // this.blockUI.stop();
      if (err.status === 0 || err.status === 400) {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })

      }
    })


  }


  onView() {
    const params = {
      'StudentId' : 216,
       }
    this._restApiService.getByParameters(PathConstants.FeedBack_Get, params).subscribe(res => {
      if (res !== null && res !== undefined && res.Table.length !== 0) {
        this.data = res.Table;
      }
    })
  }

  onEdit(data) {
    this.RowId = data.Slno;
    this.studentName = data.StudentName;
    this.hostelName = data.HostelName;
    this.feedBack = data.FBMessage;

  }

  onClear() {
    this.studentFeedbackForm.form.markAsUntouched();
    this.studentFeedbackForm.form.markAsPristine();
    this.studentName = null;
    this.hostelName = null;
    this.feedBack = null;
    this.replyMessage = null;
  }

}
