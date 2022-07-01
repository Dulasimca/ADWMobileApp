import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-commoditygroup-entry',
  templateUrl: './commoditygroup-entry.component.html',
  styleUrls: ['./commoditygroup-entry.component.css']
})
export class CommoditygroupEntryComponent implements OnInit {

  commodityGroup: string;
  commoditygroupTamilName: string;
  selectedType: number;
  commodityGroupId: number;
  data: any = [];

  @ViewChild('f', { static: false }) _commodityGroup: NgForm;


  constructor(private restApiService: RestAPIService, private messageService: MessageService, private masterService: MasterService) { }

  ngOnInit(): void {
    this.commodityGroupId = 0;
  }
 
  onSave(){

  const params = {
    'Id': this.commodityGroupId,
    'Name': this.commodityGroup,
    'NameTamil': this.commoditygroupTamilName,
    'Flag': (this.selectedType * 1)
  };

  this.restApiService.post(PathConstants.CommodityGroup_Post,params).subscribe(res => {
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
    this._commodityGroup.reset();
  }
  onView() {
     this.restApiService.get(PathConstants.CommodityGroup_Get).subscribe(res => {
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
      this.commodityGroupId = selectedRow.Id;
      this.commodityGroup = selectedRow.Name;
      this.commoditygroupTamilName = selectedRow.NameTamil;
      this.selectedType =selectedRow.Flag;
    }
  }
}



