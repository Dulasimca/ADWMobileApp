import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.css']
})
export class EmployeeMasterComponent implements OnInit {
  designationName: number;
  designationOptions: SelectItem[];
  firstName: string;
  lastName: string;
  dateOfjoin: any;
  genderOptions: SelectItem[];
  genders?: any;
  gender: any;
  address: any;
  hostelDistrictOptions: SelectItem[];
  districts?: any;
  district: string;
  hostelNameOptions: SelectItem[];
  hostelName: any;
  mobileNo: string;
  cols: any;
  data: any = [];
  employeeDesignation?: any = [];
  login_user: User;
  RowId: 0;
  remarks: any;
  endDate: Date = new Date();
  showDialog: boolean;
  empName: string;
  designation: string;
  modeOfAppt: any;
  modeOptions: SelectItem[];
  modes?: any;
  employeeImage: any = '';
  employeeFileName: string;
  selectedType: number;
  imageDialog: boolean;
  dateOfbirth: any;
  yearRange: string;
  hostelJoin: any;
  pincode: any;
  altMobNo: number;
  nativeDistricts?: any;
  nativeDistrictOptions: SelectItem[];
  nativeDistrict: any;
  nativeTalukOptions: SelectItem[];
  nativeTaluk: any;
  nativeTaluks?: any;
  hideDropDown: boolean;
  districtOptions: SelectItem[];
  districtId: any;
  talukOptions: SelectItem[];
  talukID: any;
  hostelOptions: SelectItem[];
  hostel: any;
  loading: boolean;
  obj: any;
  dobYearRange: string;
  public formData = new FormData();
  @ViewChild('f', { static: false }) employeeForm: NgForm;
  @ViewChild('userFile', { static: false }) _employeeimage: ElementRef;
  
  constructor(private _authService: AuthService, private _masterService: MasterService
    , private _restApiService: RestAPIService, private _messageService: MessageService, private _datePipe: DatePipe,
    private http: HttpClient, private _d: DomSanitizer) { }

  ngOnInit(): void {
    const current_year = new Date().getFullYear();
    const dob_cyear = current_year - 5;
    this.dobYearRange = 1950 + ':' + dob_cyear;
    this.yearRange = 1950 + ':' + current_year;
    this.cols = [
      { field: 'hostelDistrict', header: 'District Name', width: '100px', align: 'left !important' },
      { field: 'Talukname', header: 'Taluk Name', width: '100px', align: 'left !important' },
      { field: 'HostelName', header: 'Hostel Name', width: '100px', align: 'left !important' },
      { field: 'DesignationName', header: 'Designation', width: '100px', align: 'left !important' },
      { field: 'ModeName', header: 'Mode Of Appointment', width: '100px', align: 'left !important' },
      { field: 'FirstName', header: 'First Name', width: '100px', align: 'left !important' },
      { field: 'LastName', header: 'Last Name', width: '100px', align: 'left !important' },
      { field: 'Doj', header: 'Service Joined date', width: '100px', align: 'left !important' },
      { field: 'EmployeeJoinedDate', header: 'Joined as employee in', width: '100px', align: 'left !important' },
      { field: 'GenderName', header: 'Gender', width: '100px', align: 'left !important' },
      { field: 'Address', header: 'Address', width: '100px', align: 'left !important' },
      { field: 'NativeDistrict', header: 'Native District', width: '100px', align: 'left !important' },
      { field: 'NativeTaluk', header: 'Native Taluk', width: '100px', align: 'left !important' },
      { field: 'Pincode', header: 'Pincode', width: '100px', align: 'left !important' },
      { field: 'MobileNo', header: 'Mobile No', width: '100px', align: 'left !important' },
      { field: 'Flag', header: 'Status', width: '100px', align: 'left !important' },
      { field: 'EndDate', header: 'Last Date', width: '100px', align: 'centre !important' },
    ];
    this.login_user = this._authService.UserInfo;
    this.genders = this._masterService.getMaster('GD');
    this.nativeDistricts = this._masterService.getDistrictAll();
    this.districts = this._masterService.getMaster('DT');
    this.nativeTaluks = this._masterService.getTalukAll();
    this._restApiService.get(PathConstants.EmployeeDesignation_Get).subscribe(employeeDesignation => {
      this.employeeDesignation = employeeDesignation;
    })
    this._restApiService.get(PathConstants.ModesType_Get).subscribe(res => {
      this.modes = res;
    })
  }

  selectDistrict(id: number) {
    let params = {
      'Type': 1,
      'HostelId': (this.login_user.hostelId !== undefined && this.login_user.hostelId !== null) ?
        this.login_user.hostelId : 0,
    };
    if(id === 1) {
      //district wise
     this.hostelNameOptions = [];
     params['DCode'] = (this.district !== null && this.district !== undefined) ? this.district : '0';
      this.loadHostel(params, id);
    } else {
      //view select hostel dropdown
      this.hostelOptions = [];
      params['DCode'] = (this.districtId !== null && this.districtId !== undefined) ? this.districtId : '0';
      params['TCode'] = (this.talukID !== null && this.talukID !== undefined) ? this.talukID : '0';
       this.loadHostel(params, id);
    }
  }

  loadHostel(params, type): any {
    this._restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
      if(type === 1) {
        const hostelDistrictWiseSelection = [];
        res.Table.forEach(h => {
        hostelDistrictWiseSelection.push({ label: h.HostelName, value: h.Slno, hostelTCode: h.Talukid });
      });
      this.hostelNameOptions = hostelDistrictWiseSelection;
      this.hostelNameOptions.unshift({ label: '-select', value: null });
    } else {
      const hostelSelection = [];
      res.Table.forEach(h => {
        hostelSelection.push({ label: h.HostelName, value: h.Slno });
      });
      this.hostelOptions = hostelSelection;
      if((this.login_user.roleId * 1) !== 4) {
        this.hostelOptions.unshift({ label: 'All', value: 0 });
      }
      this.hostelOptions.unshift({ label: '-select', value: null });
    }
    })
  }

  onView() {
    let params = {};
    if (this.login_user.roleId !== 4) {
      this.hideDropDown = true;
      params = this.selectDropdown();
    } else {
      this.hideDropDown = false;
      params = {
        'DCode': this.login_user.districtCode,
        'TCode': this.login_user.talukId,
        'HostelId': this.login_user.hostelId,
      }
      this.loadTable(params);
      this.loading = true;
    }
    this.data = [];
  }

  selectDropdown(): any {
    let param = {};
    if (this.districtId !== undefined && this.districtId !== null && this.talukID !== undefined && this.talukID !== null &&
      this.hostel !== undefined && this.hostel !== null) {
      param = {
        'DCode': this.districtId,
        'TCode': this.talukID,
        'HostelId': this.hostel
      }
      this.loadTable(param);
    }
    return param;
  }

  loadTable(params) {
    this._restApiService.getByParameters(PathConstants.EmployeeDetails_Get, params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        res.Table.forEach(i => {
          i.Flag = (i.Flag) ? 'Active' : 'Inactive';
          i.url = this.login_user.domainUrl + 'assets/layout/' + this.login_user.hostelId + '/Documents' + '/' + i.EmployeeImage;
          // i.EmployeeJinedDate = this._datePipe.transform(i.EmployeeJinedDate, 'dd/MM/yyyy');
          // i.DoJ = this._datePipe.transform(i.DoJ, 'dd/MM/yyyy');

        })
        this.data = res.Table;
        this.loading = false;
      } else {
        this.loading = false;
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
        })
      }
    });
  }

  onSubmit() {
    const params = {
      'Id': this.RowId,
      'HostelID': (this.login_user.roleId === 4) ? this.login_user.hostelId : this.hostelName.value,
      'Districtcode': (this.login_user.roleId === 4) ? this.login_user.districtCode : this.nativeDistrict,
      'Talukid': (this.login_user.roleId === 4) ? this.login_user.talukId : this.hostelName.hostelTCode,
      'Designation': this.designationName,
      'ModeType': this.modeOfAppt,
      'FirstName': this.firstName,
      'LastName': this.lastName,
      'Doj': this._datePipe.transform(this.dateOfjoin, 'MM/dd/yyyy'),
      'Dob': this._datePipe.transform(this.dateOfbirth, 'MM/dd/yyyy'),
      'EmployeeJoinedDate': this._datePipe.transform(this.hostelJoin, 'MM/dd/yyyy'),
      'Gender': this.gender,
      'Address': this.address,
      'NativeDistrict': this.nativeDistrict,
      'Nativetaluk': this.nativeTaluk,
      'MobileNo': this.mobileNo,
      'AltMobNo': this.altMobNo,
      'Pincode': this.pincode,
      'EmployeeImage': this.employeeFileName,
      'DApproval': 0,
      'Flag': (this.selectedType * 1),
    };
    this._restApiService.post(PathConstants.EmployeeDetails_Post, params).subscribe(res => {
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

  onSelect(type, value) {
    let genderSelection = [];
    let districtSelection = [];
    let nativedtSelection = [];
    let designationSelection = [];
    let modeSelection = [];
    let talukSelection = [];
    let nativeTalukSelection = [];
    switch (type) {
      case 'GD':
        this.genders.forEach(g => {
          genderSelection.push({ label: g.name, value: g.code });
        })
        this.genderOptions = genderSelection;
        this.genderOptions.unshift({ label: '-select-', value: null });
        break;
      case 'DT':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.hostelDistrictOptions = districtSelection.slice(0);
        this.hostelDistrictOptions.unshift({ label: '-select-', value: null });
        this.districtOptions = districtSelection.slice(0);
        if((this.login_user.roleId * 1) === 1) {
          this.districtOptions.unshift({ label: 'All', value: 0 });
        }
        this.districtOptions.unshift({ label: '-select-', value: null });
        break;
      case 'ND':
        this.nativeDistricts.forEach(d => {
          nativedtSelection.push({ label: d.name, value: d.code });
        })
        this.nativeDistrictOptions = nativedtSelection;
        this.nativeDistrictOptions.unshift({ label: '-select-', value: null });
        break;
      case 'ED':
        this.employeeDesignation.forEach(c => {
          designationSelection.push({ label: c.Name, value: c.Id });
        })
        this.designationOptions = designationSelection;
        this.designationOptions.unshift({ label: '-select', value: null });
        break;
      case 'MA':
        this.modes.forEach(m => {
          modeSelection.push({ label: m.Modes, value: m.Id });
        })
        this.modeOptions = modeSelection;
        this.modeOptions.unshift({ label: '-select', value: null });
        break;
      case 'T':
        if (value === 1) {
          this.nativeTaluks.forEach(t => {
            if (t.dcode === this.nativeDistrict) {
              nativeTalukSelection.push({ label: t.name, value: t.code });
            }
          })
          this.nativeTalukOptions = nativeTalukSelection;
          this.nativeTalukOptions.unshift({ label: '-select-', value: null });
        } else {
          this.nativeTaluks.forEach(t => {
            if (t.dcode === this.districtId) {
              talukSelection.push({ label: t.name, value: t.code });
            }
          })
          this.talukOptions = talukSelection;
          if((this.login_user.roleId * 1) !== 4) {
            this.talukOptions.unshift({ label: 'All', value: 0 });
          }
          this.talukOptions.unshift({ label: '-select-', value: null });
        }
        break;
    }
  }

  onRowSelect(selectedRow) {
    this.RowId = selectedRow.Id;
    this.designationName = selectedRow.Designation;
    this.designationOptions = [{ label: selectedRow.DesignationName, value: selectedRow.Designation }];
    this.modeOfAppt = selectedRow.ModeTypeId;
    this.modeOptions = [{ label: selectedRow.ModeName, value: selectedRow.ModeTypeId }];
    this.firstName = selectedRow.FirstName;
    this.lastName = selectedRow.LastName;
    this.dateOfjoin = new Date(selectedRow.Doj);
    this.dateOfbirth = new Date(selectedRow.DOB);
    this.hostelJoin = new Date(selectedRow.EmployeeJoinedDate);
    this.gender = selectedRow.Gender;
    this.genderOptions = [{ label: selectedRow.GenderName, value: selectedRow.Gender }];
    this.address = selectedRow.Address;
    this.district = selectedRow.DistrictCode;
    this.hostelDistrictOptions = [{ label: selectedRow.hostelDistrict, value: selectedRow.DistrictCode }];
    this.hostelName = { label: selectedRow.HostelName, value: selectedRow.HostelID, hostelTCode: selectedRow.TalukID };
    this.hostelNameOptions = [{ label: selectedRow.HostelName, value: selectedRow.HostelID }];
    this.nativeDistrict = selectedRow.NativeDistrictID;
    this.nativeDistrictOptions = [{ label: selectedRow.NativeDistrict , value: selectedRow.NativeDistrictID }];
    this.nativeTaluk = selectedRow.NativeTalukID;
    this.nativeTalukOptions = [{ label: selectedRow.NativeTaluk, value: selectedRow.NativeTalukID }];
    this.hostelOptions = [{ label: selectedRow.HostelName, value: selectedRow.HostelID }];
    this.mobileNo = selectedRow.MobileNo;
    this.altMobNo = selectedRow.AltMobNo;
    this.pincode = selectedRow.Pincode;
    this.employeeFileName = selectedRow.EmployeeImage;
    var filePath = this.login_user.domainUrl + 'assets/layout/' + this.login_user.hostelId + '/Documents' + '/' + this.employeeFileName;
    this.employeeImage = filePath;
    this.selectedType = selectedRow.Flag;
  }

  onEdit(data) {
    this.showDialog = true;
    this.RowId = data.Id;
    this.empName = data.FirstName;
    this.designation = data.DesignationName;
  }

  onUpdate() {
    const params = {
      'Id': this.RowId,
      'EndDate': this.endDate,
      'Remarks': this.remarks,
      'Flag': 1
    }
    this._restApiService.post(PathConstants.UpdateEmployeeDetails_Post, params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res) {
          //this.blockUI.stop();
          this.onView();
          this.showDialog = false;
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          });
        } else {
          //this.blockUI.stop();
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


  onClear() {
    this.employeeForm.form.markAsUntouched();
    this.employeeForm.reset();
    this.designationName = null;
    this.designationOptions = [];
    this.nativeDistrict = null;
    this.nativeDistrictOptions = [];
    this.nativeTaluk = null;
    this.nativeTalukOptions = [];
    // this.firstName = null;
    // this.lastName = null;
    // this.dateOfjoin = new Date();
    this.gender = null;
    this.genderOptions = [];
    // this.address = null;
    // this.mobileNo = null;
    this.RowId = 0;
    this.employeeImage = null;
    this.modeOfAppt = null;
    this.modeOptions = [];
    this.district = null;
    this.hostelDistrictOptions = [];
    this.hostelName = null;
    this.hostelNameOptions = [];
    this.hostel = null;
    this.hostelOptions = [];
  }

  public uploadFile = (event) => {
    const selectedFile = event.target.files[0];
    {
      const url = window.URL.createObjectURL(selectedFile);
      this.employeeImage = this._d.bypassSecurityTrustUrl(url);
    }
    this.formData = new FormData()
    let fileToUpload: any = <File>event.target.files[0];
    const folderName = this.login_user.hostelId + '/' + 'Documents';
    var curr_datetime = this._datePipe.transform(new Date(), 'ddMMyyyyhmmss') + new Date().getMilliseconds();
    var etxn = (fileToUpload.name).toString().split('.');
    var filenameWithExtn = curr_datetime + '.' + etxn[1];
    const filename = fileToUpload.name + '^' + folderName + '^' + filenameWithExtn;
    this.formData.append('file', fileToUpload, filename);
    this.employeeFileName = filenameWithExtn;
    this.http.post(this._restApiService.BASEURL + PathConstants.FileUpload_Post, this.formData)
      .subscribe(event => {
      }
      );
    return filenameWithExtn;
  }

  showImage(url) {
    this.imageDialog = true;
    this.employeeImage = url;
  }

  refreshField(value) {
    if (value === 'D') {
      this.talukID = null;
      this.talukOptions = [];
    }
  }

  //update flag
  // onDelete(rowData) {
  //   const params = {
  //     'Id': rowData.Id,
  //     'EndDate': rowData.EndDate,
  //     'Remarks': rowData.Remarks,
  //     'Flag': 0
  //   }
  //   this._restApiService.post(PathConstants.UpdateEmployeeDetails_Post,params).subscribe(res => {
  //     if (res !== undefined && res !== null) {
  //       if (res) {
  //         //this.blockUI.stop();
  //         this.onView();
  //         this.showDialog = false;
  //         this._messageService.clear();
  //         this._messageService.add({
  //           key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
  //           summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
  //         });
  //       } else {
  //         //this.blockUI.stop();
  //         this._messageService.clear();
  //         this._messageService.add({
  //           key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
  //           summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
  //         });
  //       }
  //     } else {
  //       this._messageService.clear();
  //       this._messageService.add({
  //         key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
  //         summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
  //       });
  //     }
  //   }, (err: HttpErrorResponse) => {
  //    // this.blockUI.stop();
  //     if (err.status === 0 || err.status === 400) {
  //       this._messageService.clear();
  //       this._messageService.add({
  //         key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
  //         summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
  //       })

  //     }
  //   })
  // }

}


