import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from '../Common-Modules/messages';
import { PathConstants } from '../Common-Modules/PathConstants';
import { TableConstants } from '../Common-Modules/table-constants';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { MasterService } from '../services/master-data.service';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-employee-confirmation',
  templateUrl: './employee-confirmation.component.html',
  styleUrls: ['./employee-confirmation.component.css']
})
export class EmployeeConfirmationComponent implements OnInit {

  district: any;
  taluk: any;
  hostelName: any;
  employeeCols: any;
  employeeDetails: any[] = [];
  districtOptions: SelectItem[];
  talukOptions: SelectItem[];
  hostelOptions: SelectItem[];
  districts?: any;
  taluks?: any;
  hostels?: any;
  loading: boolean;
  logged_user: User;
  disableExcel: boolean = true;
  val: any;
  ji: any;

  constructor(private masterService: MasterService, private restApiService: RestAPIService, private _tableConstants: TableConstants,
    private _messageService: MessageService, private _authService: AuthService, private _datePipe: DatePipe) { }

  ngOnInit(): void {
    this.employeeCols = this._tableConstants.employeeReportCols;
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    this.logged_user = this._authService.UserInfo;
  }

  onSelect(value) {
    let districtSelection = [];
    let talukSelection = [];
    if (this.logged_user.roleId !== undefined && this.logged_user.roleId !== null) {
      switch (value) {
        case 'D':
          this.districts.forEach(d => {
            districtSelection.push({ label: d.name, value: d.code });
          })
          this.districtOptions = districtSelection;
          if ((this.logged_user.roleId * 1) === 1) {
            this.districtOptions.unshift({ label: 'All', value: 0 });
          }
          this.districtOptions.unshift({ label: '-select-', value: 'null' });
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
            this.talukOptions.unshift({ label: '-select-', value: 'null' });
          break;
         
      }
    }
  }

  loadHostelList() {
    let hostelSelection = [];
    const params = {
      'Type' : 0,
      'DCode': this.district,
      'TCode': this.taluk,
      'HostelId': ((this.logged_user.roleId * 1) === 4) ? this.logged_user.hostelId : 0
    }
    if (this.district !== null && this.district !== undefined && this.district !== 'All' &&
    this.taluk !== null && this.taluk !== undefined) {
      this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
        if (res !== null && res !== undefined && res.length !== 0) {
          this.hostels = res.Table;
            this.hostels.forEach(h => {
              hostelSelection.push({ label: h.HostelName, value: h.Slno });
            })
        }
      })
    }
      this.hostelOptions = hostelSelection;
      if((this.logged_user.roleId * 1) !== 4) {
      this.hostelOptions.unshift({ label: 'All', value: 0 });
    }
      this.hostelOptions.unshift({ label: '-select-', value: null });
    }
   
    refreshFields(value) {
      if(value === 'D') {
        this.taluk = null;
        this.talukOptions = [];
      } 
      this.loadHostelList();
    }
//approval button functions
    onClick(data, value) {
      this.loading = true;
      if (value === 0) {
        ///Confirm
        this.employeeDetails.forEach(i => {
          if (i.Id === data.Id)
            i.Dapproval = 1; // pending to confirm
          this.loading = false;
        })
      } 
      if (value === 1) {
        ///decline
        this.employeeDetails.forEach(i => {
          if (i.Id === data.Id)
            i.Dapproval = 2; // confirm to decline
          this.loading = false;
        })
      }else {
        ///absent
        this.employeeDetails.forEach(i => {
          if (i.Id === data.Id)
            i.Dapproval = 1; // decline to confirm
          this.loading = false;
        })
      }
      const params = {
        'Id': data.Id,
        'districtApproval': data.Districtapproval,
      }
      this.restApiService.post(PathConstants.EmployeeApproval_Put, params).subscribe(res => {
        if (res) {
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.UpdateMsg
          });
        } else {
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          });
        }
      })
    }

    loadTable() {
      this.employeeDetails = [];
      if(this.district !== null && this.district !== undefined && this.taluk !==null && this.taluk !==undefined &&
        this.hostelName !== null && this.hostelName !== undefined && this.hostelName !==undefined) {
      this.loading = true;
      const params = {
        'DCode': this.district,
        'TCode': this.taluk,
        'HostelId': this.hostelName ,
      }
      this.restApiService.getByParameters(PathConstants.EmployeeDetails_Get, params).subscribe(res => {
        if (res.Table !== undefined && res.Table !== null && res.Table.length !== 0) {
          res.Table.forEach(r => {
            r.ConsumptionDate = this._datePipe.transform(r.ConsumptionDate, 'dd/MM/yyyy');
            r.Dapproval =  r.DistrictApproval ;
            console.log('h',r.Districtapproval)

          })
          this.employeeDetails = res.Table;
          this.disableExcel = false;
          this.loading = false;
        } else {
          this.loading = false;
          this.disableExcel = true;
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
          })
        }
       })
      }
    }
  }

