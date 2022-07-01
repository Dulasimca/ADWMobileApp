import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from '../Common-Modules/messages';
import { PathConstants } from '../Common-Modules/PathConstants';
import { TableConstants } from '../Common-Modules/table-constants';
import { MasterService } from '../services/master-data.service';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-hostel-closingdate-entry',
  templateUrl: './hostel-closingdate-entry.component.html',
  styleUrls: ['./hostel-closingdate-entry.component.css']
})
export class HostelClosingdateEntryComponent implements OnInit {
  yearRange: string;
  openingDate: any;
  closingDate: any;
  extendDate: any;
  hostelOpeningDate: any;
  hostelClosingDate: any;
  entryId: any;
  academicYear: any;
  years?: any;
  yearOptions: SelectItem[];
  data: any = [];
  showTable: boolean;
  @ViewChild('f', { static: false }) _closingentry: NgForm;
  cols: any;


  constructor(private restApiService: RestAPIService, private datePipe: DatePipe, private messageService: MessageService,
    private masterService: MasterService, private tableConstants: TableConstants) { }

  ngOnInit(): void {
    const current_year = new Date().getFullYear();
    const start_year_range = current_year - 10;
    this.yearRange = start_year_range + ':' + current_year;
    this.years = this.masterService.getMaster('AY');
    this.cols = this.tableConstants.HstlClosingdateEntryCols;
  }

  onSelect(type) {
    let yearSelection = [];
    switch(type){
    case 'Y':
      this.years.forEach(y => {
        yearSelection.push({ label: y.name, value: y.type });
      })
      this.yearOptions = yearSelection;
      this.yearOptions.unshift({ label: '-select', value: null });
      break;
    }
  }

  onSubmit() {
    const params = {
      'Id': this.entryId,
      'AcademicYear': this.academicYear,
      'AppOpenDate': this.datePipe.transform(this.openingDate, 'MM/dd/yyyy'),
      'AppCloseDate': this.datePipe.transform(this.closingDate, 'MM/dd/yyyy'),
      'AppExtendDate': this.datePipe.transform(this.extendDate, 'MM/dd/yyyy'),
      'HstlOpenDate': this.datePipe.transform(this.hostelOpeningDate, 'MM/dd/yyyy'),
      'HstlCloseDate': this.datePipe.transform(this.hostelClosingDate, 'MM/dd/yyyy'),
      'Flag': 1
    }
    this.restApiService.post(PathConstants.HostelClosingDateEntry_Post, params).subscribe(res => {
      if (res) {
        this.clearform();
        this.onView();
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
      }
    })

  }

  onEdit(rowData) {
    if (rowData !== null && rowData !== undefined) {
      this.entryId = rowData.Id;
      this.academicYear = rowData.AcademicYear;
      this.yearOptions = [{ label: rowData.ShortYear, value: rowData.AcademicYear }];
      this.openingDate = rowData.AppOpendate;
      this.closingDate =rowData.AppClosedate;
      this.extendDate = rowData.AppExtendDate;
      this.hostelOpeningDate = rowData.HstlOpenDate;
      this.hostelClosingDate = rowData.HstlCloseDate;
    }

  }
  onView() {
    this.showTable = true;
    this.restApiService.get(PathConstants.HostelClosingDateEntry_Get).subscribe(res => {
      this.data = res;
    })
  }

  clearform() {
    this._closingentry.reset();
    this._closingentry.form.markAsUntouched();
    this._closingentry.form.markAsPristine();

  }

}
