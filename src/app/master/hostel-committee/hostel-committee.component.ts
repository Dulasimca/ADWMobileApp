import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-hostel-committee',
  templateUrl: './hostel-committee.component.html',
  styleUrls: ['./hostel-committee.component.css']
})
export class HostelCommitteeComponent implements OnInit {

  districtName: string;
  talukName: string;
  hostelName: string;
  login_user: User;
  Districtcode: number;
  TalukId: number;
  HostelId: number;
  Committee: string;
  member: any;
  MemberOptions: SelectItem[];
  CommitteeOptions: SelectItem[];
  committeeName?:any = [];
  committeeMember?:any = [];
  name: any;
  NameOptions: SelectItem[];
  cols: any;
  data: any = [];
  onDataCheckingId : number;
  memberName: any;
  memberValue: number;
  disableName: boolean;
  RowId: number;

  @ViewChild ('f', { static: false }) facilityForm: NgForm;
  constructor(private _authService: AuthService,private _restApiService: RestAPIService,private _messageService: MessageService) { }

  ngOnInit(): void {
    this.memberValue=0;
    this.login_user = this._authService.UserInfo;
    this.districtName = this.login_user.districtName;
    this.talukName = this.login_user.talukName;
    this.hostelName = this.login_user.hostelName;
    this.Districtcode = this.login_user.districtCode;
    this.TalukId = this.login_user.talukId;
    this.HostelId = this.login_user.hostelId;
    
    this._restApiService.get(PathConstants.CommitteeMaster_Get).subscribe(committeeName => {
      this.committeeName = committeeName;
    })
    this._restApiService.get(PathConstants.CommitteeMember_Get).subscribe(committeeMember => {
      this.committeeMember = committeeMember;
    })
    this.cols = [
      { field: 'Districtname', header: 'District Name', width: '200px', align: 'left !important'},
      { field: 'Talukname', header: 'Taluk Name', width: '200px', align: 'left !important'},
      { field: 'HostelName', header: 'Hostel Name', width: '200px', align: 'left !important'},
      { field: 'CommitteeName', header: 'Committee Name', width: '200px', align: 'left !important'},
      { field: 'CommitteeMember', header: 'Committee Member', width: '200px', align: 'left !important'},
      { field: 'MemberName', header: 'Name', width: '200px', align: 'left !important'},
    ];
    
  }

  onSelect(type){
    let committeeSelection = [];
    let commiteememberSelection = [];
    switch (type) {
      case 'CN':
            this.committeeName.forEach(c => {
              committeeSelection.push({ label:c.Name, value: c.CommitteeId });
          })
          this.CommitteeOptions = committeeSelection;
          this.CommitteeOptions.unshift({ label: '-select', value: null });
      break;
      case 'CM':
        this.committeeMember.forEach(c => {
          commiteememberSelection.push({ label:c.Name, value: c.MemberId });
      })
      this.MemberOptions = commiteememberSelection;
      this.MemberOptions.unshift({ label: '-select', value: null });
  break;
    }
  }

  onSubmit() {
    const params = {
      'Slno': this.RowId,
      'HostelId': this.HostelId,
      'DistrictId': this.Districtcode,
      'TalukId': this.TalukId,
      'Committee': this.Committee,
      'CommitteeMembers': this.member,
      'Name': this.memberValue,
      'MemberName': this.memberName,
      'Flag': 1,
    };
    this._restApiService.post(PathConstants.HostelCommittee_Post,params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res) {
           // this.blockUI.stop();
              this.onView();
              this.onClear();          
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

  onDropDownChecking() {
    this.onDataCheckingId = this.member;
    if(this.onDataCheckingId ===1){
      this.NameOptions = [];
      this.disableName = false;
      this.onLoadStudent();
    } else if(this.onDataCheckingId ===2) {
      this.NameOptions = [];
      this.disableName = false;
      this.onLoadEmployee();
    } else if(this.onDataCheckingId ===3) {
      this.NameOptions = [];
      this.disableName = false;
      this.onLoadWarden();
    } else if(this.onDataCheckingId ===4) {
      this.disableName = true;
      this.name = '0';
    } else if(this.onDataCheckingId ===5) {
      this.disableName = true;
      this.name = '0';
    } else if(this.onDataCheckingId ===6) {
      this.disableName = true;
      this.name = '0';
    } else if(this.onDataCheckingId ===7) {
      this.disableName = true;     
      this.name = '0';
    }
    
  }

  NameChanges()
  {
    this.memberName = this.name.label;
    this.memberValue= this.name.value;
  }
  onLoadStudent() {
    this.NameOptions = [];
    let studentSelection = [];
  
    const params = {
      'DCode': this.login_user.districtCode,
      'TCode': this.login_user.talukId,
      'HCode': this.login_user.hostelId
    }
    this._restApiService.getByParameters(PathConstants.Registration_Get, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        res.forEach(r => {
          studentSelection.push({ label: r.studentName, value: r.studentId });

        })
        this.NameOptions = studentSelection;
        this.NameOptions.unshift({ label: '-select-', value: null })
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: 'Student Details Not Available'
        })
      }
    })
  }

  onLoadEmployee() {
    let employeeSelection = [];
    const params = {
      'DCode' : this.login_user.districtCode,
      'TCode' : this.login_user.talukId,
      'HostelId' : this.login_user.hostelId,
       }
       this._restApiService.getByParameters(PathConstants.EmployeeDetails_Get,params).subscribe(res =>{
        if (res !== undefined && res !== null && res.Table.length !== 0) {
          res.Table.forEach(r => {
            employeeSelection.push({ label: r.FirstName, value: r.Id });
  
          })
          this.NameOptions = employeeSelection;
          this.NameOptions.unshift({ label: '-select-', value: null })
        } else {
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: 'Employee Details Not Available'
          })
        }
      })
    }

    onLoadWarden() {
      console.log(true);
      let wardenSelection = [];
      const params = {
        'DCode': (this.login_user.districtCode !== undefined && this.login_user.districtCode !== null) 
        ? this.login_user.districtCode : 0,
        'TCode': (this.login_user.talukId !== undefined && this.login_user.talukId !== null) ?
         this.login_user.talukId : 0,
        'Value': (this.login_user.hostelId !== undefined && this.login_user.hostelId !== null) ? this.login_user.hostelId : 0
      }
      this._restApiService.getByParameters(PathConstants.Warden_Get, params).subscribe(res => {
        if (res !== undefined && res !== null && res.Table.length !== 0) {
          res.Table.forEach(r => {
            wardenSelection.push({ label: r.Name, value: r.WardenId });
  
          })
          this.NameOptions = wardenSelection;
          this.NameOptions.unshift({ label: '-select-', value: null })
        } else {
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: 'Warden Details Not Available'
          })
        }
      }) 
    } 

  onView() {
    this.data = [];
    const params = {
   'DCode' : this.login_user.districtCode,
   'TCode' : this.login_user.talukId,
   'HostelId' : this.login_user.hostelId,
    }
    this._restApiService.getByParameters(PathConstants.HostelCommittee_Get,params).subscribe(res =>{
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



  onClear() {
    this.facilityForm.form.markAsUntouched();
    this.facilityForm.form.markAsPristine();
    this.name = null;
    this.NameOptions = [];
    this.member = null;
    this.MemberOptions = [];
    this.Committee = null;
    this.CommitteeOptions = [];
    this.memberName = null;
    this.RowId = 0;
    this.disableName  = false;
  }

  onRowSelect(selectedRow) {
    
    this.RowId = selectedRow.Slno;
    this.Committee = selectedRow.Committee;
    this.CommitteeOptions = [{ label: selectedRow.CommitteeName, value: selectedRow.Committee}];
    this.member = selectedRow.CommitteeMembers;
    this.MemberOptions = [{ label: selectedRow.CommitteeMember, value: selectedRow.CommitteeMembers}];
    this.name = selectedRow.Name;
    this.NameOptions = [{ label: selectedRow.MemberName, value: selectedRow.Name}];
    this.memberName = selectedRow.MemberName;
    this.memberValue = selectedRow.Name;
    this.onDropDownCheckingOnSelect();
  }

  onDropDownCheckingOnSelect() {
    this.onDataCheckingId = this.member;
    if(this.onDataCheckingId ===1){
      this.disableName = false;
    } else if(this.onDataCheckingId ===2) {
      this.disableName = false;
    } else if(this.onDataCheckingId ===3) {
      this.disableName = false;
    } else if(this.onDataCheckingId ===4) {
      this.disableName = true;
      this.name = '0';
    } else if(this.onDataCheckingId ===5) {
      this.disableName = true;
      this.name = '0';
    } else if(this.onDataCheckingId ===6) {
      this.disableName = true;
      this.name = '0';
    } else if(this.onDataCheckingId ===7) {
      this.disableName = true;     
      this.name = '0';
    }
    
  }

}
