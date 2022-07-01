import { ViewportScroller } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MessageService } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-district-wise-dashboard',
  templateUrl: './district-wise-dashboard.component.html',
  styleUrls: ['./district-wise-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DistrictWiseDashboardComponent implements OnInit {
  items: any[] = [];
  data: any[] = [];
  isScrollDown: boolean = true;
  @BlockUI() blockUI: NgBlockUI;
	constructor(private _restApiService: RestAPIService, private _scroller: ViewportScroller,
    private _messageService: MessageService, private _router: Router, private cdf: ChangeDetectorRef) {}
		
  ngOnInit(): void {
    document.getElementById('maincontainer').style.background = '#00293c';
    this.loadData();
  }

  loadData() {
    this.blockUI.start();
    this._restApiService.get(PathConstants.DistrictDashboard_Get).subscribe((res: any) => {
      if(res !== undefined && res !== null) {
        if(res.length !== 0) {
          res.forEach((i, index) => {
            if(index < 5) {
              this.data.push(i);
            }
          })
          this.items = res;
          this.cdf.detectChanges();
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

  scrollDown() {
    var curr_len = this.data.length;
    var max_len = curr_len + 5;
    this.items.forEach((i, index) => {
      if(index >= curr_len && index < max_len) {
        this.data.push(i)
      }
    })
    if(this.data.length === this.items.length) {
      this.isScrollDown = false;
    }
    console.log('sc', this.data, this.items)
    this._scroller.scrollToAnchor("scroller");
  }

  gotoTaluk(id) {
    if(id !== undefined && id !== null) {
    this._router.navigate(['/taluk-wise-dashboard'],{queryParams:{'dcode': id} , replaceUrl: true});
    }
  }

}
