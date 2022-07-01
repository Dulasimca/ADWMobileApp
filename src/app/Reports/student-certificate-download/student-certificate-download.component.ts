import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { saveAs } from 'file-saver';
import { Dialog } from 'primeng/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-student-certificate-download',
  templateUrl: './student-certificate-download.component.html',
  styleUrls: ['./student-certificate-download.component.css']
})
export class StudentCertificateDownloadComponent implements OnInit {
  districtOptions: SelectItem[];
  talukOptions: SelectItem[];
  hostelOptions: SelectItem[];
  hostel: string;
  taluk: string;
  district: string;
  districts?: any;
  taluks?: any;
  hostels?: any;
  loading: boolean;
  logged_user: User;
  studentDocCols: any = [];
  studentDocData: any[] = [];
  showDialog: boolean = false;
  ImageUrl: any;
  imgHeader: string;
  showImg: boolean;
  showPdf: boolean;
  constructor(private _tableConstants: TableConstants, private _masterService: MasterService,
    private _authService: AuthService, private _restApiService: RestAPIService,
    private _datepipe: DatePipe, private _messageService: MessageService,
    protected _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.studentDocCols = this._tableConstants.StudentDocumentColumns;
    this.districts = this._masterService.getMaster('DT');
    this.taluks = this._masterService.getMaster('TK');
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
          break;
      }
    }
  }

  loadHostelList() {
    let hostelSelection = [];
    const params = {
      'Type': 0,
      'DCode': this.district,
      'TCode': this.taluk,
      'HostelId': ((this.logged_user.roleId * 1) === 4) ? this.logged_user.hostelId : 0
    }
    if (this.district !== null && this.district !== undefined && this.district !== 'All' &&
      this.taluk !== null && this.taluk !== undefined) {
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
  }

  loadStudentDetails() {
    this.studentDocData = [];
    this.loading = true;
    const params = {
      'DCode': this.district,
      'TCode': this.taluk,
      'HCode': ((this.logged_user.roleId * 1) === 4) ? this.logged_user.hostelId : this.hostel
    }
    this._restApiService.getByParameters(PathConstants.StudentCertificate_Get, params).subscribe(res => {
      if (res !== null && res !== undefined) {
        if (res.length !== 0) {
          res.forEach(i => {
            i.isTCPDF = this.checkFileType(i.TcFilename) ? 'Y' : 'N';
            i.isINCPDF = this.checkFileType(i.IncomeCertificateFilename) ? 'Y' : 'N';
            i.isCOMPDF = this.checkFileType(i.DeclarationFilename) ? 'Y' : 'N';
            i.isBNKPDF = this.checkFileType(i.BankPassbookFilename) ? 'Y' : 'N';
            i.studentURL = (i.StudentFilename !== undefined && i.StudentFilename !== null) ?
             (i.StudentFilename.toString().trim() !== '') ?
                'assets/layout/' + i.HostelID + '/Documents/' + i.StudentFilename : null : null;
            i.tcURL = (i.TcFilename !== undefined && i.TcFilename !== null) ?
             (i.TcFilename.toString().trim() !== '') ?
             'assets/layout/' + i.HostelID + '/Documents/' + i.TcFilename : null : null;
            i.communityURL = (i.DeclarationFilename !== undefined && i.DeclarationFilename !== null) ?
             (i.DeclarationFilename.toString().trim() !== '') ?
             'assets/layout/' + i.HostelID + '/Documents/' + i.DeclarationFilename : null : null;
            i.passbookURL = (i.BankPassbookFilename !== undefined && i.BankPassbookFilename !== null) ?
             (i.BankPassbookFilename.toString().trim() !== '') ?
             'assets/layout/' + i.HostelID + '/Documents/' + i.BankPassbookFilename : null : null;
            i.incomeURL = (i.IncomeCertificateFilename !== undefined && i.IncomeCertificateFilename !== null) ?
             (i.IncomeCertificateFilename.toString().trim() !== '') ?
             'assets/layout/' + i.HostelID + '/Documents/' + i.IncomeCertificateFilename : null : null;
            i.Dob = this._datepipe.transform(i.Dob, 'dd/MM/yyyy');
          });
          this.studentDocData = res;
          this.loading = false;
        } else {
          this.loading = false;
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
          })
        }
      } else {
        this.loading = false;
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
        })
      }
    });
  }

  checkFileType(filename: string): boolean {
    if (filename.trim() !== '') {
      const types = filename.split('.');
      const fileType = types[1].toLowerCase();
      if (fileType === 'pdf') {
        return true;
      } else {
        return false;
      }
    }
  }

  refreshFields(id: string) {
    if (id === 'D') {
      this.talukOptions = [];
      this.taluk = null;
      this.hostel = null;
      this.hostelOptions = [];
    } else {
      this.hostel = null;
      this.hostelOptions = [];
    }
    this.loadHostelList();
  }

  showFile(url: string, isPDF: string, type: string) {
    if (url !== null && url !== undefined) {
      this.showDialog = true;
      if (isPDF === 'Y') {
        this.showPdf = true;
        this.showImg = false;
        this.ImageUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url);
      } else {
        this.showImg = true;
        this.showPdf = false;
        this.ImageUrl = url
      }
      switch (type) {
        case 'ST':
          this.imgHeader = 'Student Picture';
          break;
        case 'TC':
          this.imgHeader = 'Transfer Certificate';
          break;
        case 'IN':
          this.imgHeader = 'Income Certificate';
          break;
        case 'CM':
          this.imgHeader = 'Community Certificate';
          break;
        case 'BP':
          this.imgHeader = 'Bank Passbook';
          break;
      }
    }
  }

  onDownload() {
    let filename: any = this.imgHeader.split(' ');
    filename = filename[0] + filename[1];
    saveAs(this.ImageUrl, filename);
  }
}
