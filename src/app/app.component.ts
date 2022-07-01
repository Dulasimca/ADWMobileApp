import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';
import { IdleService } from './services/idle.service';
import { MasterService } from './services/master-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TN-ADWHMS';
  hideHeader: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private _authService: AuthService, private router: Router, private idleService: IdleService) {
    this._authService.isLoggedIn.subscribe(value => {
      this.isLoggedIn = value;
    });
  }

  ngOnInit() { 
    this.initialIdleSettings();
  }
  private initialIdleSettings() {
    const idleTimeoutInSeconds: number = environment.idleTimeInMinutes * 60;
    this.idleService.startWatching(idleTimeoutInSeconds).subscribe((isTimeOut: boolean) => {
      if (isTimeOut) {
        this.router.navigate(['/login']);
      }
    });
  }
}
