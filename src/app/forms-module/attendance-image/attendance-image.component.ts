import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { LocationService } from 'src/app/services/location.service';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { DatePipe } from '@angular/common';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { NgForm } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CameraCaptureComponent } from 'src/app/camera-capture/camera-capture.component';

enum CameraStatuses {
  disabled = 'disabled',
  enabled = 'enabled',
  taken = 'taken'
}
@Component({
  selector: 'app-attendance-image',
  templateUrl: './attendance-image.component.html',
  styleUrls: ['./attendance-image.component.css']
})
export class AttendanceImageComponent implements OnInit {
  date: Date = new Date();
  districts: any;
  remarks: any;
  login_user: User;
  districtName: string;
  talukName: string;
  hostelName: any;
  data: any;
  noOfStudent: number;
  attendanceId: number;
  Slno: any;
  cols: any;
  showDialog: boolean;
  hostelImage: string;
  imagecount: number;
  latitude: any;
  longitude: any;
  capturedImage: any;
  timeStamp: string;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) attendanceimageForm: NgForm;
  @ViewChild('camera', { static: false }) camera: CameraCaptureComponent;
  constructor(private restApiService: RestAPIService, private _authService: AuthService, private masterService: MasterService, private datepipe: DatePipe
    , private _messageService: MessageService) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'DistrictName', header: 'District', width: '100px' },
      { field: 'TalukName', header: 'Taluk', width: '100px' },
      { field: 'HostelName', header: 'Hostel', width: '100px' },
      { field: 'CreatedDate', header: 'Date', width: '100px' },
      { field: 'Latitude', header: 'Latitude', width: '100px' },
      { field: 'Longitude', header: 'Longitude', width: '100px' },
      { field: 'Remarks', header: 'Remarks', width: '100px' },
    ];
    this.Slno = 0;
    this.imagecount = 0;
    this.noOfStudent = 0;
    this.login_user = this._authService.UserInfo;
    this.hostelName = this.login_user.hostelName;
    this.districtName = this.login_user.districtName;
    this.talukName = this.login_user.talukName;
    this.latitude = null;
    this.longitude = null;
    this.GetAttendanceInfo();
    this.onView();
    this.getLocation();
  }

  onSubmit() {
    this.blockUI.start();
    if (this.imagecount === 5) {
      this.blockUI.stop();
      this._messageService.clear();
      this._messageService.add({
        key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
        summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.AttendanceimageRestrict
      });
    }
    else {
      const params = {
        'Slno': this.Slno != undefined ? this.Slno : 0,
        'Id': 0,
        'Uploaddate': this.date,
        'Districtcode': this.login_user.districtCode,
        'Talukid': this.login_user.talukId,
        'HostelID': this.login_user.hostelId,
        'AttendanceId': this.attendanceId,
        'Remarks': this.remarks,
        'Latitute': this.latitude,
        'Longitude': this.longitude,
        'uploadImage': '',
        '_imageAsDataUrl': this.capturedImage,
        '_mimeType': 'image/png',
        'isMobile': 1,
        'Flag': 1,
      }
      this.restApiService.post(PathConstants.AttendanceImage_Post, params).subscribe(res => {
        if (res.Item1) {
          this.blockUI.stop();
          this.onView();
          //  this.blockUI.stop();
          //  this.onClear();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          });
        }
        else {
          this.blockUI.stop();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: res.Item2
          });
        }
      });
    }
  }

  public getCapture(url) {
    this.blockUI.start('Fetching Location...');
    if (this.latitude !== null && this.longitude !== null) {
      if (url !== undefined && url !== null) {
        this.capturedImage = url;
        this.blockUI.stop();
      } else {
        this.blockUI.stop();
        alert('Picture is not captured properly, Please retake the picture!');
      }
    } else {
      this.camera.status = CameraStatuses.disabled;
      this.camera.getButtonName();
      this.camera.executeButtonAction();
      this.blockUI.stop();
      alert(ResponseMessage.GPSError);
      }
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(position => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.blockUI.stop();
    }
    );
  }

  GetAttendanceInfo() {
    var hasBiomteric = this.login_user.hasBiometric;
    let biometricId = null;
    this.noOfStudent = 0;
    this.blockUI.start();
    if (hasBiomteric) {
      const params = {
        'HostelId': this.login_user.hostelId,
        'FromDate': '',
        'ToDate': '',
        'Type': 1
      }
      this.restApiService.getByParameters(PathConstants.Consumption_Get, params).subscribe(res => {
        if (res) {
          biometricId = res[0].DeviceId;
        } else {
          biometricId = null;
        }
        const BM_params = {
          'Code': biometricId,
          'Date': this.datepipe.transform(this.date, 'MM/dd/yyyy'),
          'Type': 2
        }
        this.restApiService.getByParameters(PathConstants.BioMetricsForConsumption_Get, BM_params).subscribe(res => {
          if (res !== undefined && res !== null) {
            if (res.length !== 0) {
              this.blockUI.stop();
              this.noOfStudent = (res[0].StudentCount !== undefined && res[0].StudentCount !== null) ? (res[0].StudentCount * 1) : 0;
            } else {
              this.noOfStudent = 0;
              this.blockUI.stop();
            }
          } else {
            this.noOfStudent = 0;
            this.blockUI.stop();
          }
        })
      })
    } else {
      const params = {
        'HostelID': (this.login_user.hostelId != undefined && this.login_user.hostelId != null) ? this.login_user.hostelId : 0,
        'Districtcode': (this.login_user.districtCode != undefined && this.login_user.districtCode != null) ? this.login_user.districtCode : 0,
        'Talukid': (this.login_user.talukId != undefined && this.login_user.talukId != null) ? this.login_user.talukId : 0,
        'FromDate': this.datepipe.transform(this.date, 'MM/dd/yyyy'),
        'Todate': this.datepipe.transform(this.date, 'MM/dd/yyyy')
      }
      this.restApiService.getByParameters(PathConstants.Attendance_Get, params).subscribe(res => {
        if (res !== null && res !== undefined && res.length !== 0) {
          res.Table.forEach(element => {
            this.noOfStudent = element.NOOfStudent;
            this.attendanceId = element.Id
            this.blockUI.stop();
          });;
        }
        else {
          this.blockUI.stop();
          this.noOfStudent = 0;
          this.attendanceId = 0;
        }
      });
    }
  }

  onView() {
    this.data = [];
    const params = {
      'HostelID': this.login_user.hostelId,
      'Districtcode': this.login_user.districtCode,
      'Talukid': this.login_user.talukId,
      'FromDate': this.datepipe.transform(this.date, 'MM/dd/yyyy'),
      'Todate': this.datepipe.transform(this.date, 'MM/dd/yyyy'),
    }
    this.restApiService.getByParameters(PathConstants.AttendanceImage_Get, params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        res.Table.forEach(i => {
          i.url = this.login_user.domainUrl + 'assets/layout/' + i.HostelID + '/' + i.ImageName;
        })
        this.data = res.Table;
        this.imagecount = res.Table.length;
      }
      else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_ALERT, detail: ResponseMessage.SelectUploadDate
        });
      }
    });
  }

  showImage(url) {
    this.showDialog = true;
    this.hostelImage = url;
  }

  onClear() {
    this.attendanceimageForm.form.markAsUntouched();
    this.attendanceimageForm.form.markAsPristine();
    this.date = new Date();
    this.data = [];
    // this.latitude = null;
    // this.longitude = null;
    this.capturedImage = null;
    this.camera.status = CameraStatuses.taken;
    this.camera.getButtonName();
    this.camera.executeButtonAction();
  }
}

