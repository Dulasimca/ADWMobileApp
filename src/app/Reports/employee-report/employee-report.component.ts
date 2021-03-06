import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MasterService } from 'src/app/services/master-data.service';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-employee-report',
  templateUrl: './employee-report.component.html',
  styleUrls: ['./employee-report.component.css']
})
export class EmployeeReportComponent implements OnInit {

  hostel: any;
  district: any;
  taluk: any;
  HostelId: number
  Hosteltamilname: string;
  Hosteltype: number;
  Hosteltypes?: any;
  talukOptions: SelectItem[];
  districtOptions: SelectItem[];
  DistrictId: number
  Districtcode: number;
  Districtcodes?: any;
  TalukId: number;
  TalukIds?: any;
  hostelOptions: SelectItem[];
  Buildingno: any;
  Street: any;
  Landmark: string;
  upload: any;
  pincode: any;
  Longitude: any;
  Latitude: any;
  Radius: any;
  Totalstudent: any;
  mobileNo: any;
  daysOptions: SelectItem[];
  disableTaluk: boolean = true;
  masterData?: any = [];
  days?: any = [];
  data: any = [];
  Table2?: any;
  Slno: any;
  cols: any;
  login_user: User;
  districts?: any;
  taluks?: any;
  hostels?: any = [];
  role: number;
  isDistrict: boolean;
  isTaluk: boolean;
  isHostel: boolean;
  hostelCols: any;
  hostelData: any = [];
  loading: boolean;
  disableExcel: boolean = true;
  showDialog: boolean;
  employeeImage: string;
  constructor(private http: HttpClient, private restApiService: RestAPIService,
    private masterService: MasterService, private _authService: AuthService,
    private _messageService: MessageService, private tableConstants: TableConstants, private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.hostelCols = this.tableConstants.employeeReportCols
    this.Slno = 0;
    this.login_user = this._authService.UserInfo;
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    //  this.districtname = this.login_user.districtName;
    //  this.talukname = this.login_user.talukName;
    //  this.hostelname=this.login_user.hostelName;
    // this.role=this.login_user.roleId;

  }

  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    let hostelSelection = [];
    if (this.login_user.roleId !== undefined && this.login_user.roleId !== null) {
      switch (type) {
        case 'D':
          this.districts.forEach(d => {
            districtSelection.push({ label: d.name, value: d.code });
          })
          this.districtOptions = districtSelection;
          if ((this.login_user.roleId * 1) === 1) {
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
          if ((this.login_user.roleId * 1) === 1 || (this.login_user.roleId * 1) === 2) {
            this.talukOptions.unshift({ label: 'All', value: 0 });
          }
          this.talukOptions.unshift({ label: '-select-', value: null });
          break;
      }
    }
  }

  reloadFields(value) {
    if(value === 'D') {
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
      'DCode': this.district,
      'TCode': this.taluk,
      'HostelId': (this.login_user.hostelId !== undefined && this.login_user.hostelId !== null) ? 
      this.login_user.hostelId : 0,
    }
    if (this.district !== null && this.district !== undefined && this.district !== 'All' &&
    this.taluk !== null && this.taluk !== undefined && this.taluk !== 'All') {
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
    if((this.login_user.roleId * 1) !== 4) {
      this.hostelOptions.unshift({ label: 'All', value: 0 });
    }
    this.hostelOptions.unshift({ label: '-select-', value: null });
  }

  loadTable() {
    this.hostelData = [];
    if (this.district !== null && this.district !== undefined && this.taluk !== null && this.taluk !== undefined &&
      this.hostel !== null && this.hostel !== undefined && this.hostel !== undefined) {
      this.loading = true;
      const params = {
        'DCode': this.district,
        'TCode': this.taluk,
        'HostelId': this.hostel,
        
      }
      this.restApiService.getByParameters(PathConstants.EmployeeDetails_Get,params).subscribe(res =>{
        if (res !== null && res !== undefined && res.length !== 0) {
          res.Table.forEach(i => {
            i.Flag = (i.Flag) ? 'Active' : 'Inactive';
            i.url = this.login_user.domainUrl + 'assets/layout/' + this.login_user.hostelId + '/Documents' + '/' + i.EmployeeImage;
            i.status = i.DistrictApproval;
            console.log('i',i.status)
          })
            this.hostelData = res.Table;
            this.disableExcel = false;
            this.loading = false;
    } else {
      this._messageService.clear();
      this._messageService.add({
        key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
        summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
      })
    }
  });

      }
    }

    showImage(url) {
      this.showDialog = true;
      this.employeeImage = url;
    }


}

