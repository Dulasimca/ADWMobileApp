import { LocationStrategy, ViewportScroller } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MessageService } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-taluk-wise-dashboard',
  templateUrl: './taluk-wise-dashboard.component.html',
  styleUrls: ['./taluk-wise-dashboard.component.css']
})
export class TalukWiseDashboardComponent implements OnInit {
  data: any[] = [];
  dcode: any;
  @BlockUI() blockUI: NgBlockUI;

  constructor(private _restApiService: RestAPIService, private _messageService: MessageService,
    private _activatedRoute: ActivatedRoute, private _router: Router, private location: LocationStrategy) { }

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(params => {
      this.dcode = params["dcode"];
      console.log('url', this._activatedRoute.url);
      this.location.replaceState('','','taluk-wise-dashboard','')
    });
    var code = (this.dcode !== undefined && this.dcode !== null) ? this.dcode : 0;
    this.loadData(code);  
  }

  loadData(id) {
    this.blockUI.start();
    this._restApiService.getByParameters(PathConstants.TalukDashboard_Get, { 'code': id }).subscribe((res: any) => {
      if (res !== undefined && res !== null) {
        if (res.length !== 0) {
          this.data = res;
          this.blockUI.stop();
        } else {
          this.blockUI.stop();
        }
      } else {
        this.blockUI.stop();
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

  gotoHostel(id) {
    this._router.navigate(['/hostel-wise-dashboard'], {queryParams: {'tcode': id}, skipLocationChange: true});
  }
}