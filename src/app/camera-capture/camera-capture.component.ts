import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
enum CameraStatuses {
  disabled = 'disabled',
  enabled = 'enabled',
  taken = 'taken'
}
@Component({
  selector: 'app-camera-capture',
  templateUrl: './camera-capture.component.html',
  styleUrls: ['./camera-capture.component.css']
})
export class CameraCaptureComponent {
  @ViewChild('video') public video: ElementRef;
  @ViewChild('canvas') public canvas: ElementRef;
  @Output() public capture: EventEmitter<any> = new EventEmitter<any>();
  @Input() showButton: boolean = true;
  public captured: Blob;
  public enabled: boolean;
  public status: CameraStatuses;
  public statuses = CameraStatuses;
  private stream: MediaStream;
  public showImage: boolean;
  isRear: boolean;
  showFlip: any;

  constructor() {
    this.status = CameraStatuses.disabled;
    this.enabled = false;
    this.showImage = false;
    this.isRear = true;
    }

  public ngOnDestroy(): void {
    if (this.stream) {
      this.stream.getVideoTracks()[0].stop();
    }
  }

  public getButtonName(): string {
    switch (this.status) {
      case CameraStatuses.disabled:
        return 'Open';
      case CameraStatuses.enabled:
        return 'Capture';
      case CameraStatuses.taken:
        return 'Retake';
      default:
        break;
    }
  }

  public getMobileName(): string {
    return this.captured ? 'Retake' : 'Capture';
  }

  public executeButtonAction(): void {
    switch (this.status) {
      case CameraStatuses.disabled:
        this.enableCamera();
        break;
      case CameraStatuses.enabled:
        this.makeCapture();
        break;
      case CameraStatuses.taken:
        this.resetCanvas();
        break;
      default:
        break;
    }
  }

  public onFileSelected(event) {
    const file = event.target.files[0];
    const img = new Image();

    if (file.type.match('image.*')) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (evt: any) => {
        if (evt.target.readyState === FileReader.DONE) {
          img.src = evt.target.result;
          img.onload = () => this.canvas.nativeElement.getContext('2d').drawImage(img, 0, 0, 640, 480);

          this.captured = this.canvas.nativeElement.toDataURL('image/png');
          this.dataURItoBlob(this.canvas.nativeElement.toDataURL('image/png'));
        }
      };
    }
  }

  private enableCamera(): void {
    this.status = CameraStatuses.enabled;
    this.showFlip = true;
    this.enabled = true;
    this.showImage = false;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(stream => {
        this.stream = stream;
        try {
          this.video.nativeElement.srcObject = stream;
        } catch (error) {
          this.video.nativeElement.src = URL.createObjectURL(stream);
        }
        this.video.nativeElement.play();
      }).catch(() => {
        alert('Please give access to camera');
        this.status = CameraStatuses.disabled;
      });
    }
  }

  private makeCapture(): void {
    this.enabled = false;
    this.showFlip = false;
    this.showImage = true;
    this.status = CameraStatuses.taken;
    this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0, 300, 300);
    this.captured = this.canvas.nativeElement.toDataURL('image/png');
    this.dataURItoBlob(this.canvas.nativeElement.toDataURL('image/png'));
  }

  private resetCanvas() {
    this.enabled = false;
    this.showImage = false;
    this.showFlip = false;
    this.status = CameraStatuses.disabled;
    this.captured = undefined;
    const context = this.canvas.nativeElement.getContext('2d');

    context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.capture.emit();
  }

  private dataURItoBlob(url): void {
    alert('url'+url)
    this.capture.emit(url);
  }

  public flipCam() {
    this.isRear = !this.isRear;
    var mode = (this.isRear) ? 'environment' : 'user';
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: {exact: mode} } }).then(stream => {
        this.stream = stream;
        try {
          this.video.nativeElement.srcObject = stream;
        } catch (error) {
          this.video.nativeElement.src = URL.createObjectURL(stream);
        }
        this.video.nativeElement.play();
      }).catch(() => {
        alert('Please give access to camera');
        this.status = CameraStatuses.disabled;
      });
    }
      }
}