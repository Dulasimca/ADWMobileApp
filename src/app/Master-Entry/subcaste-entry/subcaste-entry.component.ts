import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from '../../Common-Modules/messages';
import { PathConstants } from '../../Common-Modules/PathConstants';
import { MasterService } from '../../services/master-data.service';
import { RestAPIService } from '../../services/restAPI.service';

@Component({
  selector: 'app-subcaste-entry',
  templateUrl: './subcaste-entry.component.html',
  styleUrls: ['./subcaste-entry.component.css']
})
export class SubcasteEntryComponent implements OnInit {

  subcasteName: any;
  caste: any;
  casteOptions: SelectItem[];
  selectedType: number;
  data: any = [];
  castes?: any;

  @ViewChild('f', { static: false }) _subCaste: NgForm;
  subCasteId: any = 0;


  constructor(private restApiService: RestAPIService, private messageService: MessageService, private masterService: MasterService) { }

  ngOnInit(): void {
    this.castes = this.masterService.getMaster('CS');

  }
  onSelect() {
    let casteSelection =  []
      this.castes.forEach(c => {
        casteSelection.push({ label: c.name, value: c.code });
      })
      this.casteOptions = casteSelection;
      this.casteOptions.unshift({ label: '-select-', value: null });
  }
 
  onSave(){

  const params = {
    'SubId': this.subCasteId,
    'CasteId': this.caste,
    'Name': this.subcasteName,
    'Flag': (this.selectedType * 1)
  };

  this.restApiService.post(PathConstants.SubcasteMaster_Post,params).subscribe(res => {
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
    this._subCaste.reset();
    this._subCaste.form.markAsUntouched();
    this._subCaste.form.markAsPristine();
  }
  onView() {
     this.restApiService.get(PathConstants.SubcasteMaster_Get).subscribe(res => {
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
      this.caste = selectedRow.Id;
      this.casteOptions = [{ label: selectedRow.CasteName, value: selectedRow.Id }];
      this.subCasteId = selectedRow.SubId;
      this.subcasteName = selectedRow.Name;
      this.selectedType =selectedRow.Flag;
    }
  }
}



