import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MessageService, SelectItem } from 'primeng/api';
import { User } from 'src/app/interfaces/user';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-employee-strength',
  templateUrl: './employee-strength.component.html',
  styleUrls: ['./employee-strength.component.css']
})
export class EmployeeStrengthComponent implements OnInit {
  districtName: string;
  talukName: string;
  hostelName: string;
  designationName: number;
  designationOptions: SelectItem[];
  login_user: User;
  employeeDesignation?:any = [];
  allotmentStrength: any;
  goNumber: string;
  availability: any;
  required: string;
  Districtcode: number;
  TalukId: number;
  HostelId: number;
  cols: any;
  data: any = [];
  RowId: 0;
  
  @ViewChild ('f', { static: false }) EmployeeStrengthForm: NgForm;
  @BlockUI() blockUI: NgBlockUI;
  constructor(private _authService: AuthService,private _restApiService: RestAPIService,
    private _datepipe: DatePipe, private _messageService: MessageService) { }

  ngOnInit(): void {
    this.login_user = this._authService.UserInfo;
    this.districtName = this.login_user.districtName;
    this.talukName = this.login_user.talukName;
    this.hostelName = this.login_user.hostelName;
    this.Districtcode = this.login_user.districtCode;
    this.TalukId = this.login_user.talukId;
    this.HostelId = this.login_user.hostelId;
    this._restApiService.get(PathConstants.EmployeeDesignation_Get).subscribe(employeeDesignation => {
      this.employeeDesignation = employeeDesignation;
    })
    this.cols = [
      { field: 'district', header: 'District Name', width: '100px', align: 'left !important'},
      { field: 'Talukname', header: 'Taluk Name', width: '100px', align: 'left !important'},
      { field: 'HostelName', header: 'Hostel Name', width: '100px', align: 'left !important'},
      { field: 'DesignationName', header: 'Designation', width: '100px', align: 'left !important'},
      { field: 'GoNumber', header: 'Go Number', width: '100px', align: 'center !important'},
      { field: 'AllotmentStrength', header: 'Allotment Strength', width: '100px', align: 'center !important'},
      { field: 'Availability', header: 'Availability', width: '100px', align: 'center !important'},
      { field: 'Required', header: 'Required', width: '100px', align: 'center !important'},
    ];
    this.onView();
  }

  onSelect(type) {
    let designationSelection =[];
    switch (type) {
      case 'ED':
        this.employeeDesignation.forEach(c => {
          designationSelection.push({ label:c.Name, value: c.Id });
      })
      this.designationOptions = designationSelection;
      this.designationOptions.unshift({ label: '-select', value: null });
      break;
    }
  }

  onSubmit() {
    const params = {
      'EmpStrengthId': this.RowId,
      'HostelID': this.HostelId,
      'Districtcode': this.Districtcode,
      'Talukid': this.TalukId,
      'Designation': this.designationName,
      'GoNumber': this.goNumber,
      'AllotmentStrength': this.allotmentStrength,
      'Availability': this.availability,
      'Required': this.required,
      'Flag': 1,
    };
    this._restApiService.post(PathConstants.EmployeeStrength_Post,params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res) {
          this.blockUI.stop();
           this.onClear();
           this.onView();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          });

        } else {
          this.blockUI.stop();
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
      this.blockUI.stop();
      if (err.status === 0 || err.status === 400) {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })

      }
    })
  }

  calculateTotal() {
    if (this.availability !== undefined && this.availability !== null && this.allotmentStrength !== undefined && this.allotmentStrength !== null) 
    {
        this.required = ((this.allotmentStrength * 1) - (this.availability * 1)).toFixed();
    }
  }

  onView() {
    this.data = [];
    const params = {
   'DCode' : this.login_user.districtCode,
   'TCode' : this.login_user.talukId,
   'HostelId' : this.login_user.hostelId,
    }
    this._restApiService.getByParameters(PathConstants.EmployeeStrength_Get,params).subscribe(res =>{
      if (res !== null && res !== undefined && res.length !== 0) {
        res.Table.forEach(i => {
        this.data = res.Table;
    })
    
  } else {
    this._messageService.clear();
    this._messageService.add({
      key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
      summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
    })
  }
});
  }

  onRowSelect(event, selectedRow) {
    this.RowId = selectedRow.EmpStrengthId;
    this.designationName = selectedRow.Designation;
    this.designationOptions = [{ label: selectedRow.DesignationName, value: selectedRow.Designation}];
    this.goNumber = selectedRow.GoNumber;
    this.allotmentStrength = selectedRow.AllotmentStrength;
    this.availability = selectedRow.Availability;
    this.required = selectedRow.Required;
  }

  onClear() {
  this.EmployeeStrengthForm.form.markAsUntouched();
  this.EmployeeStrengthForm.form.markAsPristine();
  this.designationName = null;
  this.designationOptions = [];
  this.goNumber = null;
  this.allotmentStrength = null;
  this.availability = null;
  this.required = null;
  }

}
