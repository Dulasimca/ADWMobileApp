import { Component, OnInit, ViewChild } from '@angular/core';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/Interfaces/user';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { MessageService } from 'primeng/api';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CameraCaptureComponent } from 'src/app/camera-capture/camera-capture.component';

enum CameraStatuses {
  disabled = 'disabled',
  enabled = 'enabled',
  taken = 'taken'
}
@Component({
  selector: 'app-hostel-image',
  templateUrl: './hostel-image.component.html',
  styleUrls: ['./hostel-image.component.css']
})
export class HostelImageComponent implements OnInit {
  login_user: User;
  hostelname: string;
  districtname: string;
  talukname: string;
  hostelImage: string;
  latitude: any;
  longitude: any;
  showBtn: boolean;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('camera', { static: false }) camera: CameraCaptureComponent;

  constructor(private restApiService: RestAPIService, private _authService: AuthService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      console.log("Let's get this party started")
    }
    navigator.mediaDevices.getUserMedia({ video: true })
    this.login_user = this._authService.UserInfo;
    this.latitude = null;
    this.longitude = null;
    this.districtname = this.login_user.districtName;
    this.talukname = this.login_user.talukName;
    this.hostelname = this.login_user.hostelName;
    this.showBtn = true;
    this.getLocation();
    const params = {
      'Type': 0,
      'DCode': this.login_user.districtCode,
      'TCode': this.login_user.talukId,
      'HostelId': this.login_user.hostelId
    }
    this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
      if (res !== null && res !== undefined) {
        if (res.length !== 0) {
          this.blockUI.stop();
          res.Table.forEach(i => {
            if (i.HostelImage !== undefined && i.HostelImage !== null) {
              if (i.HostelImage.trim() !== '') {
                this.hostelImage = this.login_user.domainUrl + 'assets/layout/' + this.login_user.hostelId + '/' + i.HostelImage;
                this.showBtn = false;
              } else {
                this.hostelImage = '';
                this.showBtn = true;
              }
            } else {
              this.hostelImage = '';
              this.showBtn = true;
            }
          })
        } else {
          this.blockUI.stop();
          this.showBtn = true;
          this.messageService.clear();
          this.messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
          })
        }
      } else {
        this.blockUI.stop();
        this.showBtn = true;
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
        });
      }
    })
    this.blockUI.stop();
  }

  public getCapture(url) {
    this.blockUI.start('Fetching Location...');
    if (this.latitude !== null && this.longitude !== null) {
      if (url !== undefined && url !== null) {
        const params = {
          'HostelId': this.login_user.hostelId,
          'HostelImage': '',
          '_imageAsDataUrl': url,
          '_mimeType': 'image/png',
          'isMobile': 1,
          'Longitude': (this.longitude !== undefined) ? this.longitude : null,
          'Latitude': (this.latitude !== undefined) ? this.latitude : null,
        }
        this.restApiService.put(PathConstants.Hostel_put, params).subscribe(res => {
          if (res) {
            this.blockUI.stop();
            this.messageService.clear();
            this.messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
              summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.CaptureSuccess
            });
          } else {
            this.blockUI.stop();
            this.messageService.clear();
            this.messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
              summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.CaptureFail
            });
          }
        });
        this.blockUI.stop();
      } else {
        this.blockUI.stop();
        alert('Picture is not captured properly, Please retake the picture!');
        this.camera.status = CameraStatuses.disabled;
        this.camera.getButtonName();
        this.camera.executeButtonAction();
      }
    } else {
      this.camera.status = CameraStatuses.disabled;
      this.camera.getButtonName();
      this.camera.executeButtonAction();
      alert(ResponseMessage.GPSError);
    }
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(position => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
    }
    );
    this.blockUI.stop();
  }

}
