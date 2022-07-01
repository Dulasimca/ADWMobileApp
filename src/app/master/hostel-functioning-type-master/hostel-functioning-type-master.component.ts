import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-Ui';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-hostel-functioning-type-master',
  templateUrl: './hostel-functioning-type-master.component.html',
  styleUrls: ['./hostel-functioning-type-master.component.css']
})
export class HostelFunctioningTypeMasterComponent implements OnInit {
  data: any;
  selectedType: number;
  cols: any
  hostelFunctioningName: any;
  funcId: any = 0;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) hostelFuncForm: NgForm;

  constructor(private http: HttpClient, private restApiService: RestAPIService,
    private masterService: MasterService, private messageService: MessageService) { }

  ngOnInit(): void {  
    // this.funcId = 0;
    this.cols = [
      { field: 'Name', header: 'Hostel Functioning Names', width: '72px' },
      { field: 'Flag', header: 'Status' },
    ];

  }


  onSubmit() {
    this.blockUI.start();
    const params = {
      'Id': this.funcId,
      'Name': this.hostelFunctioningName,
      'Flag': (this.selectedType * 1),
    };
    this.restApiService.post(PathConstants.HostelFunctioningType_post, params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res) {
          this.blockUI.stop();
          this.onview();
          this.onClear();
          this.messageService.clear();
          this.messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          });
        } else {
          this.blockUI.stop();
          this.messageService.clear();
          this.messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          });
        }
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      this.blockUI.stop();
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })

      }
    })
  }

  onview() {
    this.restApiService.get(PathConstants.HostelFunctioningType_Get).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        this.data = res.Table;
        this.data.forEach(i => {
          i.Flag = (i.Flag) ? 'Active' : 'Inactive';
        })
      }
    });
  }

  onRowSelect(event, selectedRow) {
    this.funcId = selectedRow.Id;
   this.hostelFunctioningName = selectedRow.Name;
    this.selectedType = selectedRow.Flag;
  }
  onClear() {
    this.hostelFuncForm.reset();
    this.hostelFuncForm.form.markAsUntouched();
    this.hostelFuncForm.form.markAsPristine();
    this.hostelFunctioningName = null;
    this.data = [];
    this.funcId = 0;
  }
}
