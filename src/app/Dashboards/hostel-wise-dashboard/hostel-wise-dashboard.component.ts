import { LocationStrategy, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-hostel-wise-dashboard',
  templateUrl: './hostel-wise-dashboard.component.html',
  styleUrls: ['./hostel-wise-dashboard.component.css']
})
export class HostelWiseDashboardComponent implements OnInit {
  items: any[] = [];
  data: any[] = [];
  tcode: any;

	constructor(private _restApiService: RestAPIService, private _activatedRoute: ActivatedRoute,
    private _location: LocationStrategy, private _router: Router) {}
		
  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(params => {
      this.tcode = params["tcode"];
      this._location.replaceState('','','hostel-wise-dashboard','')
    })
    var code = (this.tcode !== undefined && this.tcode !== null) ? this.tcode : 0;
    this.loadData(code);
  }

  loadData(id) {
    this._restApiService.getByParameters(PathConstants.HostelDashboard_Get, {'Code': id}).subscribe((res: any) => {
      if(res !== undefined && res !== null) {
        if(res.length !== 0) {
          res.forEach((x: any) => {
            var temp = x.name.toString().split('^');
            var arr: string = temp[0].toString().split(',');
            x.hname = (arr.length > 1) ? arr[0] + ' - ' + arr[arr.length-1] : arr[0];
            x.type = temp[1];
            x.studentCount = (x.genderType === 1) ? x.boysCount : x.girlsCount;
            x.sanctionedCount = (x.genderType === 1) ? x.sanctionedBoysCount : x.sanctionedGirlsCount;
          })
          this.data = res;
        }
      }
    })
  }

  gotoHostel(id, name) {
    if(id !== undefined && id !== null) {
    this._router.navigate(['/hostel-dashboard'],{queryParams:{'hcode': id, 'hname': name} , replaceUrl: true});
    }
  }

}
