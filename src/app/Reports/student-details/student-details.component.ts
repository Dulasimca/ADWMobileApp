import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent implements OnInit {

  district: any;
  taluk: any;
  hostel: any;
  studentData: any[] = [];
  studentCols: any;
  districtOptions: SelectItem[];
  talukOptions: SelectItem[];
  hostelOptions: SelectItem[];
  districts?: any;
  taluks?: any;
  hostels?: any;
  logged_user: User;
  loading: boolean;
  showDialog: boolean;
  studentName: string;
  studentId: any;
  student: any = {};
  roleId: number;
  dApproval: any;
  tApproval: number;
  wApproval: any;
  hostelName: string;
  @BlockUI() blockUI: NgBlockUI;
  value: any;
  disableExcel: boolean = true;
  items: any;
  tabIndex: number;
  data: any[] = [];
  totalRecords: number;
  openDialog: boolean;
  pdfDialog: boolean;
  aadharNo: any;
  mobileNo: any;
  dob: any;
  hostelId: any;
  reason: any;
  aReason: string;
  wEnableTick: boolean;
  tEnableTick: boolean;
  tCrossTick: boolean;
  dEnableTick: boolean;
  dCrossTick: boolean;
  academicYear: any;


  constructor(private _masterService: MasterService, private _restApiService: RestAPIService, private _tableConstants: TableConstants,
    private _messageService: MessageService, private _authService: AuthService, private _datePipe: DatePipe) { }

  ngOnInit(): void {
    this.studentCols = this._tableConstants.studentDetailsColumns;
    this.districts = this._masterService.getMaster('DT');
    this.taluks = this._masterService.getMaster('TK');
    this.logged_user = this._authService.UserInfo;
    this.roleId = (this.logged_user.roleId * 1);
    // this.items = [
    //   {'header': 'Approved'},
    //   {'header': 'Disapproved'}
    // ]
  }

  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    if (this.roleId !== undefined && this.roleId !== null) {
      switch (type) {
        case 'D':
          this.districts.forEach(d => {
            districtSelection.push({ label: d.name, value: d.code });
          })
          this.districtOptions = districtSelection;
          if ((this.logged_user.roleId * 1) === 1) {
            this.districtOptions.unshift({ label: 'All', value: 0 });
          }
          this.districtOptions.unshift({ label: '-select-', value: null });
          break;
        case 'T':
          this.taluks.forEach(t => {
            if (t.dcode === this.district) {
              talukSelection.push({ label: t.name, value: t.code });
            }
          })
          this.talukOptions = talukSelection;
          if ((this.logged_user.roleId * 1) === 1 || (this.logged_user.roleId * 1) === 2) {
            this.talukOptions.unshift({ label: 'All', value: 0 });
          }
          this.talukOptions.unshift({ label: '-select-', value: null });
          break;
      }
    }
  }

  reloadFields(value) {
    if (value === 'D') {
      this.taluk = null;
      this.talukOptions = [];
    }
    this.loadHostelList();
  }

  loadHostelList() {
    this.hostel = null;
    this.hostelOptions = [];
    let hostelSelection = [];
    const params = {
      'Type': 0,
      'DCode': this.district,
      'TCode': this.taluk,
      'HostelId': (this.logged_user.hostelId !== undefined && this.logged_user.hostelId !== null) ?
        this.logged_user.hostelId : 0,
    }
    if (this.district !== null && this.district !== undefined && this.district !== 'All' &&
      this.taluk !== null && this.taluk !== undefined && this.taluk !== 'All') {
      this._restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
        if (res !== null && res !== undefined && res.length !== 0) {
          this.hostels = res.Table;
          this.hostels.forEach(h => {
            hostelSelection.push({ label: h.HostelName, value: h.Slno });
          })
        }
      })
    }
    this.hostelOptions = hostelSelection;
    if ((this.logged_user.roleId * 1) !== 4) {
      this.hostelOptions.unshift({ label: 'All', value: 0 });
    }
    this.hostelOptions.unshift({ label: '-select-', value: null });
  }


  loadTable() {
    this.studentData = [];
    if (this.district !== null && this.district !== undefined && this.taluk !== null && this.taluk !== undefined &&
      this.hostel !== null && this.hostel !== undefined && this.hostel !== undefined) {
      this.loading = true;
      const params = {
        'DCode': this.district,
        'TCode': this.taluk,
        'HCode': this.hostel,
        'Roleid': this.logged_user.roleId
      }
      this._restApiService.getByParameters(PathConstants.OnlineStudentRegistrationDetails_Get, params).subscribe(res => {
        if (res !== undefined && res !== null && res.length !== 0) {
          res.forEach(r => {
            this.aadharNo = r.aadharNo;
            this.hostelId = r.hostelId;
            this.studentId = r.studentId;
            this.academicYear = r.AcademicYear;
            r.dob = r.dob,
              r.isDApproved = (r.districtApproval !== null && r.districtApproval !== 0 && (r.districtApproval)) ? 'true' : 'false';
            r.isTAprroved = (r.talukApproval !== null && r.talukApproval !== 0 && (r.talukApproval)) ? 'true' : 'false';
            r.isWApproved = (r.wardenApproval !== null && r.wardenApproval !== 0 && (r.wardenApproval)) ? 'true' : 'false';
            if (this.roleId === 1) {
              if (r.districtApproval !== null && r.districtApproval !== undefined) {
                if (r.districtApproval === 1) {
                  r.dstatus = 'Selected !';
                } else if (r.districtApproval === 2) {
                  r.dstatus = 'Rejected';
                } else {
                  r.dstatus = 'Pending !';
                }
              } else {
                r.dstatus = 'Pending !';
              }
              if (r.talukApproval !== null && r.talukApproval !== undefined) {
                if (r.talukApproval === 1) {
                  r.tstatus = 'Selected !';
                } else if (r.talukApproval === 2) {
                  r.tstatus = 'Rejected';
                } else {
                  r.tstatus = 'Pending !';
                }
              } else {
                r.tstatus = 'Pending !';
              }
              if (r.wardenApproval !== null && r.wardenApproval !== undefined) {
                if (r.wardenApproval === 1) {
                  r.wstatus = 'Selected !';
                  // this.wEnableTick = true;
                } else if (r.wardenApproval === 2) {
                  r.wstatus = 'Rejected';
                } else {
                  r.wstatus = 'Pending !';
                }
              } else {
                r.wstatus = 'Pending !';
              }
            } else if (this.roleId === 2) {
              ///district approval
              if (r.districtApproval !== null && r.districtApproval !== undefined) {
                if (r.districtApproval === 2) {
                  // r.dAStatus = '-';
                  r.enableApprove = true;
                  r.enableDisapprove = false;
                  this.dCrossTick = true;
                  // r.dDAStatus = 'DisApproved !';
                } else if (r.districtApproval === 1) {
                  // r.dDAStatus = '-';
                  r.enableApprove = false;
                  r.enableDisapprove = true;
                  this.dEnableTick = true;
                  // r.dAStatus = 'Approved !';
                } else {
                  r.dstatus = 'Pending !';
                  r.enableApprove = false;
                  r.enableDisapprove = false;
                  r.dEnableTick = false;
                  r.dCrossTick = false;
                }
              } else {
                r.dstatus = '-';
                r.enableApprove = false;
                r.enableDisapprove = false;
                r.dEnableTick = false;
                r.dCrossTick = false;
              }
            } else if (this.roleId === 3) {
              ///Taluk approval
              if (r.talukApproval !== null && r.talukApproval !== undefined) {
                if (r.talukApproval === 2) {
                  // r.tAStatus = '-';
                  r.enableApprove = true;
                  r.enableDisapprove = false;
                  this.tCrossTick = true;
                  // r.tDAStatus = 'DisApproved !';
                } else if (r.talukApproval === 1) {
                  // r.tDAStatus = '-';
                  r.enableApprove = false;
                  r.enableDisapprove = true;
                  this.tEnableTick = true;
                  // r.tAStatus = 'Approved !';
                } else {
                  r.tstatus = 'Pending !';
                  r.enableApprove = false;
                  r.enableDisapprove = false;
                }
              } else {
                r.tstatus = '-';
                r.enableApprove = false;
                r.enableDisapprove = false;
              }
            } else if (this.roleId === 4) {
              ///warden approval
              if (r.wardenApproval !== null && r.wardenApproval !== undefined) {
                if (r.wardenApproval === 2) {
                  r.wAStatus = '-';
                  r.enableApprove = true;
                  r.enableDisapprove = false;
                  r.wDAStatus = 'Rejected !';
                } else if (r.wardenApproval === 1) {
                  // r.wDAStatus = '-';              
                  r.enableApprove = false;
                  r.enableDisapprove = true;
                  this.wEnableTick = true;
                  // r.wAStatus = 'Approved !';
                } else {
                  r.wstatus = 'Pending !';
                  r.enableApprove = false;
                  r.enableDisapprove = false;
                }
              } else {
                r.wstatus = '-';
                r.enableApprove = false;
                r.enableDisapprove = false;
              }
            }
          })
          this.studentData = res;
          this.loading = false;
          this.disableExcel = false;
        } else {
          this.disableExcel = true;
          this.loading = false;
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
          })
        }
      })
    }
  }

  checkEligibility(totalValue: number): boolean {
    let isEligible = false;
    if (totalValue !== 0) {
      var approvedValue = this.studentData.filter(f => f.districtApproval === 1).length;
      if (approvedValue < totalValue) {
        isEligible = true;
      } else {
        isEligible = false;
      }
    } else {
      isEligible = false;
    }
    return isEligible;
  }

  selectForApproval(row) {
    if (row !== undefined && row !== null) {
      const isAllowed = this.checkEligibility(row.totalStudent);
      if (isAllowed) {
        this.showDialog = true;
        this.studentName = row.studentName;
        this.hostelName = row.HostelName;
        this.student = {
          'hostelId': (row.hostelId !== undefined && row.hostelId !== null) ? row.hostelId : 0,
          'emisno': (row.emisno !== undefined) ? row.emisno : null,
          'academicYear': (row.AcademicYear !== undefined) ? row.AcademicYear : null,
        }
        this.studentId = (row.studentId !== undefined && row.studentId !== null) ? row.studentId : 0;
        this.dApproval = (this.roleId === 2) ? 1 : ((row.districtApproval !== undefined && row.districtApproval !== null) ? row.districtApproval : null);
        this.tApproval = (this.roleId === 3) ? 1 : ((row.talukApproval !== undefined && row.talukApproval !== null) ? row.talukApproval : null);
        this.wApproval = (this.roleId === 4) ? 1 : ((row.wardenApproval !== undefined && row.wardenApproval !== null) ? row.wardenApproval : null);
        this.reason = null;
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.SanctionedEligibiltyErr
        })
      }
    } else {
      this.showDialog = false;
    }
  }

  selectForDisApproval(row) {
    if (row !== undefined && row !== null) {
      this.openDialog = true;
      this.studentName = row.studentName;
      this.hostelName = row.HostelName;
      this.student = {
        'hostelId': (row.hostelId !== undefined && row.hostelId !== null) ? row.hostelId : 0,
        'emisno': (row.emisno !== undefined) ? row.emisno : null,
        'academicYear': (row.AcademicYear !== undefined) ? row.AcademicYear : null,
      }
      this.studentId = (row.studentId !== undefined && row.studentId !== null) ? row.studentId : 0;
      this.dApproval = (this.roleId === 2) ? 2 : ((row.districtApproval !== undefined && row.districtApproval !== null) ? row.districtApproval : null);
      this.tApproval = (this.roleId === 3) ? 2 : ((row.talukApproval !== undefined && row.talukApproval !== null) ? row.talukApproval : null);
      this.wApproval = (this.roleId === 4) ? 1 : ((row.wardenApproval !== undefined && row.wardenApproval !== null) ? row.wardenApproval : null);
      // this.wApproval = (row.wardenApproval !== undefined && row.wardenApproval !== null) ? ((row.wardenApproval) ? 2 : 0) : 0;
    } else {
      this.openDialog = false;
    }
  }

  onApprove() {
    this.blockUI.start();
    this.aReason = '-';
    const params = {
      'studentId': this.studentId,
      'districtApproval': (this.roleId === 2) ? 1 : this.dApproval,
      'talukApproval': (this.roleId === 3) ? 1 : this.tApproval,
      'wardenApproval': (this.roleId === 4) ? 1 : this.wApproval,
      'ReasonForDisApprove': this.aReason
    }
    this._restApiService.post(PathConstants.OnlineStudentRegistrationDetails_Post, params).subscribe(res => {
      if (res) {
        if (this.roleId === 2) {
          this.insertStudentTransferDetails();
          this.insertStudentApprovalFromOnlineReg();
        }
        if (this.roleId === 4) {
          this.insertStudentFromOnlineReg();
          this.insertStudentApprovalFromOnlineReg();
        }
        this.blockUI.stop();
        this.studentId = null;
        this.showDialog = false;
        this.loadTable();
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.ApprovalSuccess
        })
      } else {
        this.blockUI.stop();
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
      }
    })
  }

  onDisApprove() {
    this.blockUI.start();
    const params = {
      'studentId': this.studentId,
      'districtApproval': (this.roleId === 2) ? 2 : this.dApproval,
      'talukApproval': (this.roleId === 3) ? 2 : this.tApproval,
      'wardenApproval': (this.roleId === 4) ? 2 : this.wApproval,
      'ReasonForDisApprove': this.reason
    }
    this._restApiService.post(PathConstants.OnlineStudentRegistrationDetails_Post, params).subscribe(res => {
      if (res) {
        if (this.roleId === 2) {
          this.insertStudentTransferDetails();
        }
        this.blockUI.stop();
        this.reason = null;
        this.studentId = null;
        this.openDialog = false;
        this.loadTable();
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_INFO,
          summary: ResponseMessage.SUMMARY_REJECTED, detail: ResponseMessage.DisApprovedSuccess
        })
      } else {
        this.blockUI.stop();
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
      }
    })
  }

  insertStudentFromOnlineReg() {
    const params = {
      'Id': this.studentId,
      'wardenapproval': this.wApproval,
      'Districtapproval': this.dApproval,
    };
    this._restApiService.post(PathConstants.StudentFromOnlineRegistration_Post, params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res) {
          // this.blockUI.stop();
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

  insertStudentApprovalFromOnlineReg() {
    const params = {
      'Slno': 0,
      'DistrictId': this.district,
      'TalukId': this.taluk,
      'HostelId': this.hostel,
      'StudentId': this.studentId,
      'wardenapproval': this.wApproval,
      'Districtapproval': this.dApproval,
      'AccountingYear': this.academicYear,
      'ReasonForDisapprove': this.aReason,
      'Flag': 1
    };
    this._restApiService.post(PathConstants.StudentApprovalFromOnlineReg_Post, params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res) {
          // this.blockUI.stop();
          // this._messageService.clear();
          // this._messageService.add({
          //   key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          //   summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          // });

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

  insertStudentTransferDetails() {
    const params = [];
    params.push({
      'Id': 0,
      'HostelId': this.student.hostelId,
      'StudentId': this.studentId,
      'AcademicYear': this.student.academicYear,
      'EMISNO': this.student.emisno,
      'Remarks': '',
      'AcademicStatus': 1, //approved (default pass)
      'Flag': 0 // default(insert)
    })
    this._restApiService.post(PathConstants.StudentTransferDetails_Post, params).subscribe(res => {
      if (res) {
        console.log('student data is inserted successfully')
      } else {
        console.log('student data is not inserted')
      }
    })
  }
  pdfSelection() {
    const params = {
      'AadharNo': this.aadharNo,
      'MobileNo': this.mobileNo,
      'Dob': this._datePipe.transform(this.dob, 'MM/dd/yyyy')
    }
    this._restApiService.getByParameters(PathConstants.OnlineStudentRegistration_Get, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        res.forEach(r => {
          this.studentId = r.studentId;
          this.hostelId = r.hostelId;
          var len = r.aadharNo.toString().length;
          if (len > 11) {
            r.aadharNoMasked = '*'.repeat(len - 4) + r.aadharNo.substr(8, 4);
          }
        })
        this.studentData = res.slice(0);
        // this.showDialog = true;
        // this.pdfDialog = true;
        this.pdfDialog = true;
        this.loading = false;
      } else {
        this.loading = false;
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_ALERT, detail: 'Not yet registered! Please register'
        })
      }
    })
  }

  onRowSelect(event, selectedRow) {
    this.aadharNo = selectedRow.aadharNo;
    this.dob = selectedRow.dob;
    this.mobileNo = selectedRow.mobileNo;
    this.pdfSelection();
  }

  onDialogShow() {
    var src = this.logged_user.domainUrl + 'assets/layout/Reports/' + this.hostelId + '/' + this.aadharNo + '_' + this.studentId + '.pdf';
    document.getElementById("embedPDF").setAttribute('src', src);
  }

}
