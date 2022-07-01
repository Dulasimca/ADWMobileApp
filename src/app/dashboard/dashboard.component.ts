import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PathConstants } from '../Common-Modules/PathConstants';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { MasterService } from '../services/master-data.service';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  hostelCount: any;
  wardenCount: any;
  studentCount: any;
  totalStudent: any;
  totalPresent: any;
  totalDevice: any;
  chartOptions: any;
  studentCountData: any;
  consumptionData: any;
  expensesToday: any;
  expensesMonthly: any;
  roleId: number;
  login_user: User;
  isTypeNumber: boolean;
  barChartOptions: any;
  constructor(private _authService: AuthService, private _restApiService: RestAPIService,
    private _router: Router) { }

  ngOnInit(): void {
    this.login_user = this._authService.UserInfo;
    this.hostelCount = 0;
    this.wardenCount = 0;
    this.studentCount = 0;
    this.totalDevice = 0;
    this.totalPresent = 0;
    this.totalStudent = 0;
    this.expensesToday = 0;
    this.expensesMonthly = 0;
    this.roleId = (this.login_user.roleId * 1);
    this.loadCount();
    this.loadChart();
    this.loadBarChart();
  }

  loadCount() {
    const params = {
      'RoleId': this.roleId,
      'DCode': (this.login_user.districtCode !== null) ? this.login_user.districtCode : 0,
      'TCode': (this.login_user.talukId !== null) ? this.login_user.talukId : 0,
      'HCode': (this.login_user.hostelId !== null) ? this.login_user.hostelId : 0
    }
    this._restApiService.getByParameters(PathConstants.Dashboard_Get, params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res.Table !== undefined && res.Table !== null && res.Table.length !== 0) {
          if ((this.login_user.roleId * 1) != 4) {
            this.hostelCount = res.Table[0].hostelcount;
          } else {
            this.totalPresent = res.Table[0].TotalPresent;
          }
        }
        if (res.Table1 !== undefined && res.Table1 !== null && res.Table1.length !== 0) {
          if ((this.login_user.roleId * 1) != 4) {
            this.wardenCount = res.Table1[0].wardencount;
          } else {
            this.totalDevice = res.Table1[0].TotalDevice;
          }
        }
        if (res.Table2 !== undefined && res.Table2 !== null && res.Table2.length !== 0) {
          if ((this.login_user.roleId * 1) != 4) {
            var str: string = (res.Table2[0].studentcount !== null && res.Table2[0].studentcount !== undefined) ? 
            res.Table2[0].studentcount as string : '';
            var hasSlash = str.includes('/');
            this.isTypeNumber = (hasSlash) ? !hasSlash : hasSlash;
            this.studentCount = res.Table2[0].studentcount;
          } else {
            this.totalStudent = res.Table2[0].TotalStudent;
          }
        }
        if (res.Table3 !== undefined && res.Table3 !== null && res.Table3.length !== 0) {
          if ((this.login_user.roleId * 1) === 1) {
            this.expensesToday = res.Table3[0].Today;
          }
        }
        if (res.Table4 !== undefined && res.Table4 !== null && res.Table4.length !== 0) {
          if ((this.login_user.roleId * 1) === 1) {
            this.expensesMonthly = res.Table4[0].Monthly;
          }
        }
      }
    })
  }

  loadChart() {
    this.consumptionData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
          {
              label: 'Expenses in rupees',
              data: [4500, 5121, 4451.99, 6784.44, 7812.08, 7411.33, 8457.74, 6548.5, 7455.10, 5466.11, 0,0],
              fill: false,
              borderColor: '#42A5F5',
              tension: 0,
              bezierCurve: false,
    },
      ]
  };
    this.chartOptions = {
      responsive: true,
      type: 'line',
      bezierCurve: false,
      plugins: {
        legend: {
            labels: {
                color: '#495057'
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#495057'
            },
            grid: {
                color: '#ebedef'
            }
        },
        y: {
            ticks: {
                color: '#495057'
            },
            grid: {
                color: '#ebedef'
            }
        }
    }

    }
  }

  loadBarChart() {
    let max_value = 0;
    this._restApiService.get(PathConstants.StudentCount_Get).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        var labels = [];
        var data = [];
        res.forEach(i => {
          labels.push(i.Districtname);
          data.push(i.Count);
          max_value = (max_value < i.Count) ? i.Count : max_value;
        })
        this.studentCountData = {
          labels: labels,
          datasets: [
            {
              label: 'Student count',
              backgroundColor: '#a186c1',
              data: data
            },
          ]
        };
      }
    })
    this.barChartOptions = {
      scales: {
        yAxes: [{
          ticks: {
            stepSize: 1,
            beginAtZero: true,
            min: 0,
            max: max_value
          }
        }]
      }
    };
  }

  gotoCMDashboard() {
    this._router.navigate(['/total-count-dashboard']);
  }
}
