import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-unit-master-entry',
  templateUrl: './unit-master-entry.component.html',
  styleUrls: ['./unit-master-entry.component.css']
})
export class UnitMasterEntryComponent implements OnInit {

  unitName: string;
  selectedType: number;
  unitId: number;
  data: any = [];

  @ViewChild('f', { static: false }) _unitMasterGroup: NgForm;


  constructor(private restApiService: RestAPIService, private messageService: MessageService, private masterService: MasterService) { }

  ngOnInit(): void {
    this.unitId = 0;
  }
 
  onSave(){

  const params = {
    'Id': this.unitId,
    'Name': this.unitName,
    'Flag': (this.selectedType * 1)
  };

  this.restApiService.post(PathConstants.UnitMasterEntry_Post,params).subscribe(res => {
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
  clearform() {
    this._unitMasterGroup.reset();
  }
  onView() {
     this.restApiService.get(PathConstants.UnitMasterEntry_Get).subscribe(res => {
       if (res !== null && res !== undefined && res.length !== 0){
         res.forEach(i => {
           i.status = (i.Flag) ? 'Active' : 'Inactive';
         })
         this.data = res;
       }
     })
  }
  onEdit(selectedRow) {
    if(selectedRow !== null && selectedRow !==undefined){
      this.unitId = selectedRow.Id;
      this.unitName = selectedRow.Name;
      this.selectedType =selectedRow.Flag;
    }
  }
}





