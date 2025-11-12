import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { MyGlobal } from './_services/myglobal.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { v4 as uuidv4 } from 'uuid';
import { NgIdleService } from './_services/ng-idle.service';
import { AuthService } from './_services/auth.service';
import { LoaderService } from './_services/loader.service';
import { LoginService } from './_services/login.service';
import { BehaviorSubject } from 'rxjs';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
    providers: [
        NgIdleService
    ]
})
export class AppComponent implements OnInit {
    isLogIn = false;
    showAdminBoard = false;
    showModeratorBoard = false;
    username: string | undefined;
    deviceType: string | undefined;
    deviceDetails: string | undefined;
    idleTimerLeft: string;
    timeRemain: number;
    isLoggedIn: BehaviorSubject<boolean> = this.login.isLoggedIn;
    isLoading: BehaviorSubject<boolean> = this.loader.isLoading;
    
    constructor(
        private login:LoginService,
        private loader: LoaderService,
         private authService: AuthService, 
         private ngIdle: NgIdleService, 
         private GlobalVariable: MyGlobal, 
         private router: Router, 
         private tokenStorageService: TokenStorageService, 
         private deviceService: DeviceDetectorService, 
         ) { }
    
    ngOnInit(): void {
        this.username = "";
        
        this.GlobalVariable.deviceType = this.deviceService.getDeviceInfo().browser;
        this.GlobalVariable.deviceDetails = this.GlobalVariable.deviceType+"-"+this.deviceService.getDeviceInfo().browser_version;
        this.GlobalVariable.deviceOS = this.deviceService.getDeviceInfo().os;
        this.GlobalVariable.deviceApiLevel = "1.1";//this.deviceService.getDeviceInfo().userAgent;
        this.GlobalVariable.deviceVersionNumber = this.deviceService.getDeviceInfo().os_version;
        this.GlobalVariable.device_model = this.deviceService.getDeviceInfo().deviceType;
        this.GlobalVariable.device_manufacturer=this.deviceService.getDeviceInfo().os;
        this.isLogIn = !!this.tokenStorageService.getToken();
        this.initTimer(environment.idleTimeinMin, 1);
        if (this.isLogIn) {
            this.login.login();
            const user = this.tokenStorageService.getUser();
            this.GlobalVariable.deviceID = this.tokenStorageService.getDeviceID();
            if (!this.GlobalVariable.deviceID) {
                this.GlobalVariable.deviceID = uuidv4();
                this.tokenStorageService.saveDeviceID(this.GlobalVariable.deviceID);
            }
            this.GlobalVariable.accesstoken = user.resp_body.accessToken;
            this.GlobalVariable.active = user.resp_body.active;
            this.GlobalVariable.dlr_img_logo = user.resp_body.dlr_img_logo;
            this.GlobalVariable.refreshToken = user.resp_body.refreshToken;
            this.GlobalVariable.userType = user.resp_body.userType;
            this.GlobalVariable.contactName = user.resp_body.contactName;
            this.GlobalVariable.userName = user.resp_body.dealer_name;
            this.GlobalVariable.agentId=user.resp_body.dealer_id;
            this.GlobalVariable.otpTokenID = this.tokenStorageService.getOtpToken();
            this.GlobalVariable.xrefid = this.tokenStorageService.getRefId();
            this.username = this.GlobalVariable.userName;
        } else {
            this.login.logout();
            this.GlobalVariable.deviceID = uuidv4();
            this.tokenStorageService.saveDeviceID(this.GlobalVariable.deviceID);
        }
      window.addEventListener('storage', (event) => {
          if (event.storageArea == localStorage) {
              if (this.isLogIn) {
                  let token = localStorage.getItem('auth-token');
                  if (token == undefined) {
                      //alert("Ooops.... Session expired.");
                      this.isLogIn = false;
                      this.login.logout();
                        this.tokenStorageService.signOut();
                        NgIdleService.runTimer = false;
                        this.router.navigate(['/login']);
                  }
              }
                  
              }
          });
    }
    formatTimeLeft = (time: number) => {
        if (time > 0) {
            let seconds = Math.trunc(time / 1000);
            let min = 0;
            if (seconds >= 60) {
                min = Math.trunc(seconds / 60);
                seconds -= (min * 60);
            }
            return `${min}:${seconds}`;
        } else {
            return `0:0`;
        }
    }
    initiateFirstTimer = (status: string) => {
        switch (status) {
            case 'INITIATE_TIMER':
                break;

            case 'RESET_TIMER':
                break;

            case 'STOPPED_TIMER':
                this.logout();
                break;

            default:
                this.idleTimerLeft = this.formatTimeLeft(Number(status));
                break;
        }
    }

    initiateSecondTimer = (status: string) => {
        switch (status) {
            case 'INITIATE_SECOND_TIMER':
                break;

            case 'SECOND_TIMER_STARTED':
                break;

            case 'SECOND_TIMER_STOPPED':
                this.logout();
                break;

            default:
                //this.secondTimerLeft = status;
                break;
        }
    }
    initTimer(firstTimerValue: number, secondTimerValue: number): void {
        // Timer value initialization
        this.ngIdle.USER_IDLE_TIMER_VALUE_IN_MIN = firstTimerValue;
        this.ngIdle.FINAL_LEVEL_TIMER_VALUE_IN_MIN = secondTimerValue;
        // end

        // Watcher on timer
        this.ngIdle.initilizeSessionTimeout();
        this.ngIdle.userIdlenessChecker.subscribe((status: string) => {
            this.initiateFirstTimer(status);
        });

        this.ngIdle.secondLevelUserIdleChecker.subscribe((status: string) => {
            this.initiateSecondTimer(status);
        });

    }
    
    logout(): void {
        
        if (this.isLogIn) {
            this.authService.logout().subscribe(
                data => {
                    //if (data.resp_code == "DM1001") {
                    
                    //}
                },
                err => {
                    
                }
            );
            this.isLogIn = false;
            this.login.logout();
            this.tokenStorageService.signOut();
            NgIdleService.runTimer = false;
            this.router.navigate(['/login']);
        }
    }
    
}
