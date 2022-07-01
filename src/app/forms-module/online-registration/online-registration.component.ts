import { DatePipe } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService, SelectItem } from 'primeng/api';
import { OnlineRegistration } from 'src/app/interfaces/onlineRegistration';
import { User } from 'src/app/interfaces/user';
import { MasterService } from 'src/app/services/master-data.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver';
import { Dialog } from 'primeng/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-online-registration',
  templateUrl: './online-registration.component.html',
  styleUrls: ['./online-registration.component.css']
})
export class OnlineRegistrationComponent implements OnInit {
  yearRange: string;
  genderOptions: SelectItem[];
  genders?: any;
  bloodGroupOptions: SelectItem[];
  bloodgroups?: any;
  motherTongueOptions: SelectItem[];
  languages?: any;
  religionOptions: SelectItem[];
  religions?: any;
  casteOptions: SelectItem[];
  castes?: any;
  schoolOptions: SelectItem[];
  districtOptions: SelectItem[];
  districts?: any;
  talukOptions: SelectItem[];
  taluks?: any;
  institutionType: string = '1';
  classOptions: SelectItem[];
  classes?: any;
  mediumOptions: SelectItem[];
  mediums?: any;
  subCasteOptions: SelectItem[];
  subcastes?: any;
  courseYearOptions: SelectItem[];
  isDisability: boolean = false;
  studentImage: any;
  incomeImg: any;
  tcImg: any;
  declarationImg: any;
  passbookImg: any;
  disableTaluk: boolean;
  ageTxt: string;
  logged_user: User;
  registeredCols: any;
  registeredDetails: any[];
  loading: boolean;
  showDialog: boolean;
  enableScholarship: boolean;
  aadharNo: string;
  aadharValidationMsg: string;
  maxDate: Date = new Date();
  existingAadhar: any;
  response: any;
  district: any;
  taluk: any;
  hostelName: any;
  hostelDistrictOptions: SelectItem[];
  hostelTalukOptions: SelectItem[];
  hostelOptions: SelectItem[];
  hostels?: any;
  hostel: any;
  hostelId: any;
  pdfDialog: boolean;
  yearSelection: any[] = [];
  studentId: any;
  accountingYear: string;
  accountingYearId: any = 0;
  instituteDcode: any;
  instituteOptions: SelectItem[];
  isInsAddrAvailable: boolean;
  isSaved: boolean;
  titleOptions: SelectItem[];
  titles?: any;
  schoolSelection: any[] = [];
  filteredSchoolData: any[] = [];
  obj: OnlineRegistration = {} as OnlineRegistration;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) _onlineRegistrationForm: NgForm;
  @ViewChild('bankPassBook', { static: false }) _bankPassBook: ElementRef;
  @ViewChild('transferCertificate', { static: false }) _transferCertificate: ElementRef;
  @ViewChild('incomeCertificate', { static: false }) _incomeCertificate: ElementRef;
  @ViewChild('userFile', { static: false }) _studentImg: ElementRef;
  @ViewChild('declarationForm', { static: false }) _declarationForm: ElementRef;
  @ViewChild('dialog', { static: false }) _dialog: Dialog;

  constructor(private _masterService: MasterService, private _d: DomSanitizer,
    private _datePipe: DatePipe, private _messageService: MessageService,
    private _restApiService: RestAPIService, private _authService: AuthService,
    private _tableConstants: TableConstants, private http: HttpClient, private router: Router) {
    this.blockUI.start();
    let master = new Observable<any[]>();
    master = this._masterService.initializeMaster();
    master.subscribe(response => {
      this.response = response;
    });
  }

  ngOnInit(): void {
    const current_year = new Date().getFullYear() - 5;
    const start_year_range = current_year - 50;
    this.yearRange = start_year_range + ':' + current_year;
    this.logged_user = this._authService.UserInfo;

    this.bloodgroups = this._masterService.getMaster('BG');
    this.taluks = this._masterService.getTalukAll();
    this.genders = this._masterService.getMaster('GD');
    this.districts = this._masterService.getDistrictAll();
    this.languages = this._masterService.getMaster('MT');
    this.castes = this._masterService.getMaster('CS');
    this.classes = this._masterService.getMaster('CL');
    this.religions = this._masterService.getMaster('RL');
    this.mediums = this._masterService.getMaster('MD');
    this.subcastes = this._masterService.getMaster('SC');
    this.titles = this._masterService.getMaster('NT')
    this.registeredCols = this._tableConstants.registrationColumns;

    setTimeout(() => {
      this.districts = this._masterService.getDistrictAll();
      this.taluks = this._masterService.getTalukAll();
      this.bloodgroups = this._masterService.getMaster('BG');
      this.genders = this._masterService.getMaster('GD');
      this.languages = this._masterService.getMaster('MT');
      this.castes = this._masterService.getMaster('CS');
      this.classes = this._masterService.getMaster('CL');
      this.religions = this._masterService.getMaster('RL');
      this.mediums = this._masterService.getMaster('MD');
      this.subcastes = this._masterService.getMaster('SC');
      this.titles = this._masterService.getMaster('NT')
      this.yearSelection = this._masterService.getMaster('AY');
      this.loadAccYear();
      this.blockUI.stop();
    }, 500);
    this.defaultValues();
    this._restApiService.get(PathConstants.HostelOnlineApplication_Get).subscribe(res => {
      if (res !== null && res !== undefined) {
        if(res.length === 0) {
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: 'Registration Closed'
          })
          setTimeout(() => {
            this.router.navigate(['/home']);
          },1000)
        }
      } else {
        this.router.navigate(['/home']);
      }
    }) 
  }

  onSelectType(id: number) {
    this.schoolOptions = [];
    this.obj.currentInstituteId = null;
    this.filteredSchoolData.length = 0;
    if (id === 1) {
      this.filteredSchoolData = this.schoolSelection.filter(s => {
        return s.type === 1;
      })
    } else {
      this.filteredSchoolData = this.schoolSelection.filter(s => {
        return s.type === 2;
      })
    }
    this.classOptions = [];
  }

  onSelect(value, id) {
    let districtSelection = [];
    let genderSelection = [];
    let talukSelection = [];
    let hostelTalukSelection = [];
    let bloodGroupSelection = [];
    let languageSelection = [];
    let casteSelection = [];
    let religionSelection = [];
    let classSelection = [];
    let mediumSelection = [];
    let subcasteSelection = [];
    let courseYearSelection = [];
    let titleSelection = [];
    switch (value) {
      case 'GD':
        this.genders.forEach(g => {
          genderSelection.push({ label: g.name, value: g.code });
        })
        this.genderOptions = genderSelection;
        break;
      case 'BG':
        this.bloodgroups.forEach(b => {
          bloodGroupSelection.push({ label: b.name, value: b.code });
        })
        this.bloodGroupOptions = bloodGroupSelection;
        break;
      case 'MT':
        this.languages.forEach(m => {
          languageSelection.push({ label: m.name, value: m.code });
        })
        this.motherTongueOptions = languageSelection;
        break;
      case 'DT':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection.slice(0);
        this.hostelDistrictOptions = districtSelection.slice(0);
        this.hostelDistrictOptions.unshift({ label: '-select-', value: null });
        if (this.obj.distrctCode !== null && this.obj.distrctCode !== undefined) {
          this.disableTaluk = false;
        } else {
          this.disableTaluk = true;
        }
        break;
      case 'TK':
        if (id === 1) {
          if (this.district !== undefined && this.district !== null) {
            this.taluks.forEach(t => {
              if (t.dcode === this.district) {
                hostelTalukSelection.push({ label: t.name, value: t.code });
              }
            })
            this.hostelTalukOptions = hostelTalukSelection.slice(0);
            this.hostelTalukOptions.unshift({ label: '-select-', value: null });
          }
        } else {
          if (this.obj.distrctCode !== undefined && this.obj.distrctCode !== null) {
            this.taluks.forEach(t => {
              if (t.dcode === this.obj.distrctCode) {
                talukSelection.push({ label: t.name, value: t.code });
              }
            })
            this.talukOptions = talukSelection.slice(0);
          }
        }
        break;
      case 'CT':
        this.castes.forEach(c => {
          casteSelection.push({ label: c.name, value: c.code });
        })
        this.casteOptions = casteSelection;
        break;
      case 'RL':
        this.religions.forEach(r => {
          religionSelection.push({ label: r.name, value: r.code });
        })
        this.religionOptions = religionSelection;
        break;
      case 'CL':
        var filtered_data = [];
        var courseYear = [];
        if (this.institutionType === '1') {
          filtered_data = this.classes.filter(f => {
            return f.type === 1; //school class name
          })
        } else {
          courseYear = this.classes.filter(c => {
            return (c.code * 1) <= 5; // college studying year
          })
          filtered_data = this.classes.filter(f => {
            return f.type === 2; //college course title
          })
        }
        filtered_data.forEach(c => {
          classSelection.push({ label: c.name, value: c.code });
        })
        courseYear.forEach(y => {
          courseYearSelection.push({ label: y.name + ' Year', value: y.code });
        })
        this.courseYearOptions = courseYearSelection;
        this.classOptions = classSelection;
        break;
      case 'MD':
        this.mediums.forEach(m => {
          mediumSelection.push({ label: m.name, value: m.code });
        })
        this.mediumOptions = mediumSelection;
        break;
      case 'SC':
        if (this.obj.caste !== null && this.obj.caste !== undefined) {
          this.subcastes.forEach(m => {
            if ((m.casteId * 1) === (this.obj.caste * 1)) {
              subcasteSelection.push({ label: m.name, value: m.code });
            }
          })
        } else {
          subcasteSelection = [];
        }
        this.subCasteOptions = subcasteSelection;
        break;
      case 'SH':
        this.schoolOptions = [];
        this.schoolOptions = this.filteredSchoolData.slice(0);
        break;
      case 'TO':
        this.titles.forEach(c => {
          titleSelection.push({ label: c.name, value: c.code });
        })
        this.titleOptions = titleSelection;
        break;
    }
  }

  refreshFields(value) {
    if (value === 'D') {
      if (this.obj.distrctCode !== null && this.obj.distrctCode !== undefined) {
        this.disableTaluk = false;
      } else {
        this.disableTaluk = true;
      }
      this._onlineRegistrationForm.form.controls['_taluk'].reset();
      this.obj.talukCode = null;
      this.talukOptions = [];
    } else if (value === 'C') {
      this._onlineRegistrationForm.form.controls['_subcaste'].reset();
      this.obj.subCaste = null;
      this.subCasteOptions = [];
    }
  }

  checkScholardhipEligibility() {
    if (this.institutionType === '1') {
      if (this.obj.classId !== undefined && this.obj.classId !== null && (this.obj.classId * 1) > 7) {
        this.enableScholarship = true;
      } else {
        this.enableScholarship = false;
        this.obj.scholarshipId = '';
      }
    } else if (this.institutionType === '0') {
      this.enableScholarship = true;
    } else {
      this.enableScholarship = false;
    }
  }

  calculateAge() {
    let timeDiff = Math.abs(Date.now() - this.obj.dob.getTime());
    let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    this.obj.age = age;
    this.ageTxt = age + ' Years';
  }

  maskInput(value) {
    this.obj.aadharNo = value;
    var len = value.length;
    if (len > 11) {
      this.aadharNo = '*'.repeat(len - 4) + value.substr(8, 4);
    }
  }

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    var formData = new FormData()
    let fileToUpload: any = <File>files[0];
    let actualFilename = '';
    const folderName = this.hostelName.value + '/' + 'Documents';
    var curr_datetime = this._datePipe.transform(new Date(), 'ddMMyyyyhmmss') + new Date().getMilliseconds();
    var etxn = (fileToUpload.name).toString().split('.');
    var filenameWithExtn = curr_datetime + '.' + etxn[1];
    const filename = fileToUpload.name + '^' + folderName + '^' + filenameWithExtn;
    formData.append('file', fileToUpload, filename);
    actualFilename = fileToUpload.name;
    this.http.post(this._restApiService.BASEURL + PathConstants.FileUpload_Post, formData)
      .subscribe((event: any) => {
      }
      );
    return filenameWithExtn;
  }

  onFileUpload($event, id) {
    const selectedFile = $event.target.files[0];
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    switch (id) {
      case 1:
        const s_url = window.URL.createObjectURL(selectedFile);
        this.studentImage = this._d.bypassSecurityTrustUrl(s_url);
        this.obj.studentFilename = this.uploadFile($event.target.files);
        break;
      case 2:
        const i_url = window.URL.createObjectURL(selectedFile);
        this.incomeImg = this._d.bypassSecurityTrustUrl(i_url);
        this.obj.incomeCertificateFilename = this.uploadFile($event.target.files);
        break;
      case 3:
        const t_url = window.URL.createObjectURL(selectedFile);
        this.tcImg = this._d.bypassSecurityTrustUrl(t_url);
        this.obj.tcFilename = this.uploadFile($event.target.files);
        break;
      case 4:
        const p_url = window.URL.createObjectURL(selectedFile);
        this.passbookImg = this._d.bypassSecurityTrustUrl(p_url);
        this.obj.bankPassbookFilename = this.uploadFile($event.target.files);
        break;
      case 5:
        const d_url = window.URL.createObjectURL(selectedFile);
        this.declarationImg = this._d.bypassSecurityTrustUrl(d_url);
        this.obj.declarationFilename = this.uploadFile($event.target.files);
        break;
    }
  }

  loadInstitute(id: number) {
    let params = {};
    let instituteSelection = [];
    if (id === 1) {
      params = { 'Dcode': this.district };
    } else {
      params = { 'Dcode': this.instituteDcode };
    }
    if ((this.instituteDcode !== undefined && this.instituteDcode !== null) ||
      (this.district !== undefined && this.district !== null)) {
      this._restApiService.getByParameters(PathConstants.Institute_Get, params).subscribe(res => {
        if (res !== undefined && res !== null) {
          if (res.length !== 0) {
            res.forEach(i => {
              instituteSelection.push({
                label: i.Name, value: i.InstituteCode, address: i.Addressinfo,
                id: i.Id, type: i.IType
              })
            })
            if (id === 1) {
              this.schoolSelection = instituteSelection.slice(0);
              this.onSelectType(1);
            } else {
              this.instituteOptions = instituteSelection.slice(0);
            }
          } else {
            this._messageService.clear();
            this._messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
              summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoInstituteFound
            })
          }
        } else {
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoInstituteFound
          })
        }
      })
    }
  }

  onSelectInstitute(type: number) {
    if (type === 1) {
      if (this.obj.currentInstituteInfo !== undefined && this.obj.currentInstituteInfo !== null) {
        var curr_instid = (this.obj.currentInstituteInfo.id !== undefined && this.obj.currentInstituteInfo.id !== null)
          ? this.obj.currentInstituteInfo.id : 0;
        var curr_instname = (this.obj.currentInstituteInfo.label !== undefined && this.obj.currentInstituteInfo.label !== null)
          ? this.obj.currentInstituteInfo.label : '';
        this.obj.instituteName = curr_instname;
        this.obj.currentInstituteId = curr_instid;
      } else {
        this.obj.instituteName = '';
        this.obj.currentInstituteId = 0;
      }
    } else {
      if (this.obj.instituteInfo !== null && this.obj.instituteInfo !== undefined) {
        const address: string = this.obj.instituteInfo.address;
        this.obj.lastStudiedInstituteCode = this.obj.instituteInfo.id;
        this.obj.lastStudiedInstituteAddress = (address !== undefined && address !== null && address.trim() !== '') ?
          address : '';
        this.isInsAddrAvailable = (address !== undefined && address !== null && address.trim() !== '') ? true : false;
      } else {
        this.isInsAddrAvailable = false;
      }
    }
  }

  clearForm() {
    this._onlineRegistrationForm.reset();
    this._onlineRegistrationForm.form.markAsUntouched();
    this._onlineRegistrationForm.form.markAsPristine();
    this._studentImg.nativeElement.value = null;
    this._bankPassBook.nativeElement.value = null;
    this._incomeCertificate.nativeElement.value = null;
    this._transferCertificate.nativeElement.value = null;
    this._declarationForm.nativeElement.value = null;
    this._onlineRegistrationForm.controls._refugeesNo.setValue(0);
    this.casteOptions = []; this.hostelOptions = [];
    this.classOptions = []; this.mediumOptions = [];
    this.genderOptions = []; this.schoolOptions = [];
    this.talukOptions = []; this.districtOptions = [];
    this.religionOptions = []; this.subCasteOptions = [];
    this.instituteOptions = []; this.bloodGroupOptions = [];
    this.courseYearOptions = []; this.hostelTalukOptions = [];
    this.motherTongueOptions = []; this.hostelDistrictOptions = [];
    this.defaultValues();
  }

  defaultValues() {
    this.maxDate = new Date();
    this.obj = {} as OnlineRegistration;
    this.studentImage = '';
    this.disableTaluk = true;
    this.isDisability = false;
    this.enableScholarship = true;
    this.isInsAddrAvailable = false;
    this.isSaved = false;
    this.institutionType = '1';
    this.obj.incomeCertificateFilename = '';
    this.obj.bankPassbookFilename = '';
    this.obj.tcFilename = '';
    this.obj.studentFilename = '';
    this.obj.tcFilename = '';
    this.obj.bankPassbookFilename = '';
    this.obj.declarationFilename = '';
    this.obj.districtApproval = '0';
    this.obj.talukApproval = '0';
    this.obj.studentId = 0;
    this.obj.parentId = 0;
    this.obj.bankId = 0;
    this.obj.documentId = 0;
    this.obj.studentAccId = 0;
    this.obj.refugeeId = '-';
    this.obj.refugeeSelectedType = 0;
    this.obj.orphanageSelectedType = 0;
    this.obj.isNewStudent = 0;
  }

  onSubmit() {
    this.blockUI.start();
    this.obj.dob = this._datePipe.transform(this.obj.dob, 'MM/dd/yyyy');
    this.obj.hostelId = this.hostelName.value;
    this.obj.motherYIncome = 0;
    this.obj.fatherYIncome = 0;
    this.obj.altMobNo = (this.obj.altMobNo !== undefined && this.obj.altMobNo !== null) ? this.obj.altMobNo : '-';
    this.obj.disabilityType = (this.obj.disabilityType !== undefined && this.obj.disabilityType !== null) ? this.obj.disabilityType : 0;
    this.obj.landmark = (this.obj.landmark !== undefined && this.obj.landmark !== null) ? this.obj.landmark : '-';
    this.obj.remarks = (this.obj.remarks !== undefined && this.obj.remarks !== null) ? this.obj.remarks : '-';
    this.obj.fatherName = (this.obj.fatherName !== undefined && this.obj.fatherName !== null) ? this.obj.fatherName : '-';
    this.obj.fatherOccupation = (this.obj.fatherOccupation !== undefined && this.obj.fatherOccupation !== null) ? this.obj.fatherOccupation : '-';
    this.obj.fatherQualification = (this.obj.fatherQualification !== undefined && this.obj.fatherQualification !== null) ? this.obj.fatherQualification : '-';
    this.obj.fatherMoileNo = (this.obj.fatherMoileNo !== undefined && this.obj.fatherMoileNo !== null) ? this.obj.fatherMoileNo : '-';
    this.obj.motherName = (this.obj.motherName !== undefined && this.obj.motherName !== null) ? this.obj.motherName : '-';
    this.obj.motherQualification = (this.obj.motherQualification !== undefined && this.obj.motherQualification !== null) ? this.obj.motherQualification : '-';
    this.obj.motherOccupation = (this.obj.motherOccupation !== undefined && this.obj.motherOccupation !== null) ? this.obj.motherOccupation : '-';
    this.obj.motherMoileNo = (this.obj.motherMoileNo !== undefined && this.obj.motherMoileNo !== null) ? this.obj.motherMoileNo : '-';
    // this.obj.medium = (this.obj.medium !== undefined && this.obj.medium !== null) ? this.obj.medium : 0;
    this.obj.courseTitle = (this.obj.courseTitle !== undefined && this.obj.courseTitle !== null) ? this.obj.courseTitle : '-';
    this.obj.scholarshipId = (this.obj.scholarshipId !== undefined) ? this.obj.scholarshipId : '';
    this.obj.micrNo = (this.obj.micrNo !== undefined && this.obj.micrNo !== null) ? this.obj.micrNo : '';
    this.obj.branchName = (this.obj.branchName !== undefined && this.obj.branchName !== null) ? this.obj.branchName : '-';
    this.obj.courseYearId = (this.institutionType === '1') ? 1 : (this.obj.courseYearId !== undefined && this.obj.courseYearId !== null) ? this.obj.courseYearId : 1;
    this.obj.village = (this.obj.village !== undefined && this.obj.village !== null) ? this.obj.village : '-';
    this.obj.guardianName = (this.obj.guardianName !== undefined && this.obj.guardianName !== null) ? this.obj.guardianName : '-';
    this.obj.guardianQualification = (this.obj.guardianQualification !== undefined && this.obj.guardianQualification !== null) ? this.obj.guardianQualification : '-';
    this.obj.guardianOccupation = (this.obj.guardianOccupation !== undefined && this.obj.guardianOccupation !== null) ? this.obj.guardianOccupation : '-';
    this.obj.guardianMobileNo = (this.obj.guardianMobileNo !== undefined && this.obj.guardianMobileNo !== null) ? this.obj.guardianMobileNo : '-';
    this.obj.accYearId = this.accountingYearId;

    this._restApiService.post(PathConstants.OnlineStudentRegistration_Post, this.obj).subscribe(response => {
      if (response !== undefined && response !== null) {
        if (response) {
          this.blockUI.stop();
          this.isSaved = true;
          this.onView();
          this.onDialogShow();
          this._messageService.clear();
          this._messageService.add({
            key: 'd-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          })
        } else {
          this.isSaved = false;
          this.blockUI.stop();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          })
        }
      } else {
        this.isSaved = false;
        this.blockUI.stop();
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
      }
    }, (err: HttpErrorResponse) => {
      this.isSaved = false;
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

  onClosingView() {
    if (this.isSaved) {
      this.clearForm();
    }
    this.showDialog = false;
  }

  saveAccountingYear() {
    const params = {
      'Id': 0,
      'DCode': this.obj.distrctCode,
      'TCode': this.obj.talukCode,
      'HCode': this.obj.hostelId,
      'StudentId': this.obj.studentId,
      'Flag': 1,
      'AccYearId': this.accountingYearId
    }
    this._restApiService.post(PathConstants.OnlineStudentRegistration_Post, params).subscribe(response => {
      if (response !== undefined && response !== null) {
        if (response) {
          this.blockUI.stop();
        } else {
          this.blockUI.stop();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          })
        }
      } else {
        this.blockUI.stop();
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
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

  onView() {
    this.showDialog = true;
    this.registeredDetails = [];
    this.loading = true;
    const params = {
      'AadharNo': this.obj.aadharNo,
      'MobileNo': this.obj.mobileNo,
      'Dob': this._datePipe.transform(this.obj.dob, 'MM/dd/yyyy')
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
        this.registeredDetails = res.slice(0);
        this.loading = false;
      } else {
        this.loading = false;
        this._messageService.clear();
        this._messageService.add({
          key: 'd-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
        })
      }
    })
  }

  validateAadhaar(aadhaarString) {
    // The multiplication table
    if (aadhaarString.length != 12) {
      this.aadharValidationMsg = 'Aadhaar numbers should be 12 digits !';
    } else {
      this.aadharValidationMsg = '';
    }
    if (aadhaarString.match(/[^$,.\d]/)) {
      this.aadharValidationMsg = 'Aadhaar numbers must contain only numbers !';
    } else {
      this.aadharValidationMsg = '';
    }
    var aadhaarArray = aadhaarString.split('');
    var toCheckChecksum = aadhaarArray.pop();
    if (this.generate(aadhaarArray) == toCheckChecksum) {
      this.aadharValidationMsg = '';
      this.maskInput(aadhaarString)
      return true;
    } else {
      this.aadharValidationMsg = 'Invalid Aadhar No!';
      this._onlineRegistrationForm.form.controls._aadharno.invalid;
      if (this.aadharNo.length === 12) {
        setTimeout(() => {
          this.aadharNo = null;
          this.aadharValidationMsg = 'Please enter valid Aadhar No!';
        }, 300);
      }
      return false;
    }
  }

  // generates checksum
  generate(array) {
    var d = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
      [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
      [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
      [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
      [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
      [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
      [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
      [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];
    // permutation table p
    var p = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
      [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
      [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
      [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
      [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
      [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
      [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];
    // inverse table inv
    var inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];
    var c = 0;
    var invertedArray = array.reverse();
    for (var i = 0; i < invertedArray.length; i++) {
      c = d[c][p[((i + 1) % 8)][invertedArray[i]]];
    }
    return inv[c];
  }

  checkAadhar() {
    const params = {
      'AadharNo': this.obj.aadharNo,
      'studentId': this.obj.studentId
    }
    this._restApiService.getByParameters(PathConstants.AadharCheck_Get, params).subscribe(res => {
      if (res.Table.length === 0) {
        this.onSubmit();
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: 'Aadhar number is already exist'
        })
      }
    });
  }

  refreshField(value) {
    if (value === 'D') {
      this.taluk = null;
      this.talukOptions = [];
      this.loadInstitute(1);
    }
    this.loadHostelList();
  }

  showGender() {
    if (this.hostelName !== undefined && this.hostelName !== null) {
      if (this.hostelName.gender !== null && this.hostelName.gender !== undefined) {
        this.genderOptions = (this.hostelName.gender === 1) ? [{ label: 'Male', value: 1 }] : [{ label: 'Female', value: 2 }]
        this.obj.gender = this.hostelName.gender;
      }
    }
  }

  loadHostelList() {
    this.hostel = null;
    this.hostelOptions = [];
    let hostelSelection = [];
    const params = {
      'DCode': this.district,
      'TCode': this.taluk,
    }
    if (this.district !== null && this.district !== undefined && this.district !== 'All' &&
      this.taluk !== null && this.taluk !== undefined && this.taluk !== 'All') {
      this._restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
        if (res !== null && res !== undefined && res.length !== 0) {
          this.hostels = res.Table;
          this.hostels.forEach(h => {
            hostelSelection.push({ label: h.HostelName, value: h.Slno, gender: h.HGenderType });
          })
        }
      })
    }
    this.hostelOptions = hostelSelection;
    this.hostelOptions.unshift({ label: '-select-', value: null });
  }

  onDialogShow() {
    var src = this.logged_user.domainUrl + 'assets/layout/Reports/' + this.hostelId + '/' + this.obj.aadharNo + '_' + this.studentId + '.pdf';
    if(document.getElementById("embedPDF") !== undefined) {
    document.getElementById("embedPDF").setAttribute('src', src);
    }
    this.clearForm();
  }

  loadAccYear() {
    if (this.yearSelection.length !== 0) {
      const _currDate = new Date();
      this.yearSelection.forEach(y => {
        if (new Date(y.fDate) <= _currDate && new Date(y.tDate) >= _currDate) {
          this.accountingYear = y.name;
          this.accountingYearId = y.code;
          this.obj.accYearId = this.accountingYearId;
        }
      })
    }
  }
}

