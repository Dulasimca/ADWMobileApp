import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
// import * as HighchartsMore from "highcharts/highcharts-more";
// import More from 'highcharts/highcharts-more'
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';
// More(Highcharts)

@Component({
  selector: 'app-total-count-dashboard',
  templateUrl: './total-count-dashboard.component.html',
  styleUrls: ['./total-count-dashboard.component.css']
})
export class TotalCountDashboardComponent implements OnInit {
  data: any[] = [];
  tempArr: any[] = [];
  ugArr: any[] = [];
  pgArr: any[] = [];
  highcharts = Highcharts;
  chartOptions: any;
  barchartOptions: any;
  chartLabels: any[];
  pgChartOptions: any;
  ugChartOptions: any;

  constructor(private restApiService: RestAPIService, private _router: Router) { }

  ngOnInit(): void {
    this.loadChartData();
    this.restApiService.get(PathConstants.CMMainDashBoard_Get).subscribe(res => {
      res.forEach(x => {
        var obj = x;
        var keys = Object.keys(obj);
        for (let k = 0; k < keys.length; k++) {
          var name: string = x['name'];
          if (name.toLowerCase() === 'school') {
            if (keys[k] !== 'name' && keys[k] !== 'Id' && keys[k] !== 'genderType') {
              var label = keys[k];
              label = label.charAt(0).toUpperCase() + label.slice(1);
              label = label.replace(/([A-Z])/g, ' $1').trim();
              label = (label.toLowerCase() !== 'hcount') ? label : 'Total Hostel Count';
              this.tempArr.push({
                name: label,
                y: x[keys[k]],
              })
            }
          }
          if (name.toLowerCase() === 'college-ug') {
            if (keys[k] !== 'name' && keys[k] !== 'Id' && keys[k] !== 'genderType') {
              var label = keys[k];
              label = label.charAt(0).toUpperCase() + label.slice(1);
              label = label.replace(/([A-Z])/g, ' $1').trim();
              label = (label.toLowerCase() !== 'hcount') ? label : 'Total Hostel Count';
              this.ugArr.push({
                name: label,
                y: x[keys[k]],
              })
            }
          }
          if (name.toLowerCase() === 'college-pg') {
            if (keys[k] !== 'name' && keys[k] !== 'Id' && keys[k] !== 'genderType') {
              var label = keys[k];
              label = label.charAt(0).toUpperCase() + label.slice(1);
              label = label.replace(/([A-Z])/g, ' $1').trim();
              label = (label.toLowerCase() !== 'hcount') ? label : 'Total Hostel Count';
              this.pgArr.push({
                name: label,
                y: x[keys[k]],
              })
            }
          }
        }
      })
      this.data = this.tempArr;
      this.chartOptions = {
        colors:
          [' #00ffff', '#1fe8f0', '#5cbad1', '#998cb2', '#b875a3', '#cc6699'],

        credits: {
          enabled: false
        },
        chart: {
          plotBorderWidth: null,
          plotShadow: false,
          backgroundColor: '#3c3c3c',
        },
        title: {
          text: 'School Hostel',
          style: {
            color: '#fff'
          }
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y:.0f}</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false,
              format: '<b>{point.name}%</b>:{point.y:.0f}',
              distance: '-30%',
            },
            showInLegend: true,
            events: {
              click: (event) => {
                this._router.navigate(['/district-wise-dashboard']);
              }
            }
          }
        },
        series: [{
          type: 'pie',
          name: 'Count',
          colorByPoint: true,
          data: this.tempArr,
        }],
        legend: {
          itemStyle: {
            color: '#fff'
          },
          itemHoverStyle: {
            color: '#fff'
          }
        }
      };
      //pie-chart 2 - College-UG Hostel
      this.ugChartOptions = {
        colors: ['#ccff33', ' #99ff59', '#66ff80', '#3dff9e', '#14ffbd', '#00ffcc'],

        credits: {
          enabled: false
        },
        chart: {
          plotBorderWidth: null,
          plotShadow: false,
          backgroundColor: '#3c3c3c',
        },
        title: {
          text: 'College-UG Hostel',
          style: {
            color: '#fff'
          }
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y:.0f}</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false,
              format: '<b>{point.name}%</b>:{point.y:.0f}',
              distance: '-30%',
            },
            showInLegend: true,
            events: {
              click: (event) => {
                this._router.navigate(['/district-wise-dashboard']);
              }
            }
          },
        },
          series: [{
            type: 'pie',
            name: 'Count',
            colorByPoint: true,
            data: this.ugArr,
          }],
          legend: {
            itemStyle: {
              color: '#fff'
            },
            itemHoverStyle: {
              color: '#fff'
            }
          }
      };

      //clge PG 
      this.pgChartOptions = {
        colors: ['#ffc6d7' , '#fca1bc', '#f681a3', '#f35d88', '#f44275', '#bc3159'],
        credits: {
          enabled: false
        },
        chart: {
          plotBorderWidth: null,
          plotShadow: false,
          backgroundColor: '#3c3c3c',
        },
        title: {
          text: 'College-PG Hostel',
          style: {
            color: '#fff'
          }
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y:.0f}</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false,
              format: '<b>{point.name}%</b>:{point.y:.0f}',
              distance: '-30%',
            },
            showInLegend: true,
            events: {
              click: (event) => {
                this._router.navigate(['/district-wise-dashboard']);
              }
            }
          }
          },
          series: [{
            type: 'pie',
            name: 'Count',
            colorByPoint: true,
            data: this.pgArr,
          }],
          legend: {
            itemStyle: {
              color: '#fff'
            },
            itemHoverStyle: {
              color: '#fff'
            }
          }
      };
    })
  }


  //bar chart
  loadChartData() {
    this.restApiService.get(PathConstants.CMDashboardGraph_Get).subscribe((response: any[]) => {
      if (response !== undefined && response !== null && response.length !== 0) {
        this.chartLabels = response[1];
        console.log('l', this.chartLabels)
        this.barchartOptions = {
          title: {
            text: 'Hostel Employee Count',
            style: {
              color: '#fff'
            }
          },
          series: [{ data: response[2], name: 'Chef/Cook', color: '#2d6b6a' },
          { data: response[3], name: 'Deputy Warden', color: '#c7c714' },
          { data: response[4], name: 'Sweeper', color: '#921740' },
          { data: response[5], name: 'Watchman', color: '#98696f' },

          ],

          plotOptions: {
            bar: {
              dataLabels: {
                enabled: true,
                style: {
                  color: '#fff'
                }
              }
            },
            series: {
              stacking: 'normal',
              pointWidth: '25',
              pointPadding: 0,
              borderWidth: 0
            }
          },
          chart: {
            type: "column",
            backgroundColor: '#3c3c3c',
          },
          credits: {
            enabled: false
          },
          xAxis: {
            categories: this.chartLabels,
            labels: {
              style: {
                color: '#fff'
              }
            }
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Total Count in No s',
              align: 'high',
              style: {
                color: '#fff'
              },
            },
            labels: {
              style: {
                color: '#fff'
              }
            },
            stackLabels: {
              enabled: true,
              style: {
                fontWeight: 'bold',
                overflow: 'justify',
                color: '#fff',
              }
            }
          },
          legend: {
            align: 'right',
            x: -10,
            verticalAlign: 'top',
            y: 5,
            floating: false,
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false,
            itemStyle: {
              color: '#fff',
            },
            itemHoverStyle: {
              color: '#fff'
            }
          },
        };
      }
    })
  }

  gotoDistrictDashboard() {
    this._router.navigate(['/district-wise-dashboard']);
  }
}

