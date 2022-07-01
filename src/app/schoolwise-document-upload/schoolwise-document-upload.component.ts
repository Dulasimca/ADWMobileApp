import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from '../Common-Modules/messages';
import { PathConstants } from '../Common-Modules/PathConstants';
import { MasterService } from '../services/master-data.service';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-schoolwise-document-upload',
  templateUrl: './schoolwise-document-upload.component.html',
  styleUrls: ['./schoolwise-document-upload.component.css']
})
export class SchoolwiseDocumentUploadComponent implements OnInit {

  district: number;
  districtOptions: SelectItem[];
  districts: any;
  school: any;
  schoolOptions: SelectItem[];
  hostel: any;
  hostelOptions: SelectItem[];
  schoolSelection: any[] = [];
  filteredSchoolData: any[] = [];
  Filename: string;


  constructor(private _restApiService: RestAPIService, private _messageService: MessageService, private _masterService: MasterService
    ,private _datePipe: DatePipe,private http: HttpClient) { }

  ngOnInit(): void {
    this.districts = this._masterService.getMaster('DT');
    // this.loadInstitute();
  }

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    var formData = new FormData()
    let fileToUpload: any = <File>files[0];
    let actualFilename = '';
    const folderName = 111+ '/' + 'Documents';
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
  onFileUpload($event) {
    const selectedFile = $event.target.files[0];
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        const s_url = window.URL.createObjectURL(selectedFile);
        // this.studentImage = this._d.bypassSecurityTrustUrl(s_url);
        this.Filename = this.uploadFile($event.target.files);
  }

  onSelect(value) {
    let districtSelection = [];

    switch (value) {
      case 'D':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection;

        this.districtOptions.unshift({ label: '-select-', value: null });
        this.loadInstitute();
        break;
      case 'SH':
        this.schoolOptions = [];
        this.schoolOptions = this.filteredSchoolData.slice(0);
        this.schoolOptions.unshift({ label: '-select-', value: null });
        break;
    }
  }
  reloadFields(type) {

  }
  onSelectType() {
    this.schoolOptions = [];
    this.filteredSchoolData.length = 0;
    this.filteredSchoolData = this.schoolSelection.filter(s => {
      return s.type === 1;
    })
  }
  loadInstitute() {
    // let params = {};
    let instituteSelection = [];
    console.log('1')
    const params = {
      'Dcode': this.district
    }
    if (this.district !== undefined && this.district !== null) {
      this._restApiService.getByParameters(PathConstants.Institute_Get, params).subscribe(res => {
        console.log('2')
        if (res !== undefined && res !== null) {
          if (res.length !== 0) {
            res.forEach(i => {
              instituteSelection.push({
                label: i.Name, value: i.InstituteCode, address: i.Addressinfo,
                id: i.Id, type: i.IType
              })
            })
            this.schoolSelection = instituteSelection.slice(0);
            this.onSelectType();
          }
        }
        else {
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoInstituteFound
          })
        }
      })
    }
  }
  loadTable() {

  }

}
