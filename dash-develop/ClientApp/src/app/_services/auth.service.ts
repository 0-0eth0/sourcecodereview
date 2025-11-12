import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MyGlobal } from '../_services/myglobal.service';


const AUTH_API = environment.apiURL + environment.apiPATH + 'authenticate/';
const AUTH_GET_API = environment.apiURL + '/dash/authenticate/';
const API_KEY = environment.apiaccessKey;


const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};
const httpKeyOption = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-AppName': 'DASH',
        'accept':'*/*',
        'accessKey': API_KEY
    })
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {
    encryptdecryptMobile: string;
    encryptdecryptCode: string;

    constructor(private gVaraible: MyGlobal, private http: HttpClient) { }
    result = new Observable<any>();
    
    login(credentials): Observable<any> {
        return this.http.post(AUTH_API + 'login_otp', {
            appName: environment.appName,
            appVersion: environment.appVersion,
            deviceId: this.gVaraible.deviceID,// uniquie id for user
            deviceType: this.gVaraible.deviceType,
            mobileNumber: null, //this.gVaraible.encryptdecryptMobile,
            referenceId: this.gVaraible.referenceId,
            deviceDetails: this.gVaraible.deviceDetails
        }, httpOptions);
  }
    /* encryptmobile(credentials): Observable<any> {
        return this.http.get(AUTH_API + 'getkey?paramater=' + credentials.mobilenumber + '&type=encrypt', httpKeyOption);
    } */
    encryptcode(credentials): Observable<any> {
        return this.http.get(AUTH_API + 'getkey?paramater=' + credentials.mobileotp + '&type=encrypt', httpKeyOption);
    }
    getRefId(): Observable<any> {
        return this.http.get(AUTH_API + 'getkey?paramater=' + this.gVaraible.referenceId + '&type=encrypt', httpKeyOption);
    }
  otpretry(user): Observable<any> {
      return this.http.post(AUTH_API + 'login_otp_retry', {
          appName: environment.appName,
          appVersion: environment.appVersion,
          deviceId: this.gVaraible.deviceID,// uniquie id for user
          deviceType: this.gVaraible.deviceType,
          mobileNumber: null ,//this.gVaraible.encryptdecryptMobile,
          otpTokenId: this.gVaraible.otpTokenID,
          referenceId: this.gVaraible.referenceId,
          deviceDetails: this.gVaraible.deviceDetails
    }, httpOptions);
  }
    submit(user): Observable<any> {
        const httpOtpSubmit = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'device_os': this.gVaraible.deviceOS,
                'deviceApiLevel': this.gVaraible.deviceApiLevel,
                'deviceVersionNumber': this.gVaraible.deviceVersionNumber,
                'device_model': this.gVaraible.device_model,
                'device_manufacturer': this.gVaraible.device_manufacturer
            })
        };
        return this.http.post(AUTH_API + 'checkValidUserNewOTP', {
            referenceId:this.gVaraible.referenceId, // userid
            mobileNumber: null ,// this.gVaraible.encryptdecryptMobile,
            deviceId: this.gVaraible.deviceID,// uniquie id for user
            appName: environment.appName,
            code: this.gVaraible.encryptdecryptCode, //otp 
            imei: null,
            brand: this.gVaraible.deviceType,
            model: this.gVaraible.deviceDetails,
            userId: this.gVaraible.referenceId, // userid
            gcmId: "dgmlGXV1RAuPHeHCAWxTJz:APA91bHwy0ciouIMfkeOKrbanZ1SaP3QLdIJzFnSHC_3KhCd9zo0jp41AYpgdhGnVxOMc2ywaJ",
            otpTokenId: this.gVaraible.otpTokenID,
            appVersion: environment.appVersion
        }, httpOtpSubmit);
    }
    logout(): Observable<any> {
        const logoutOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
                'X-Access-Token': this.gVaraible.accesstoken
            })
        };
        return this.http.get(AUTH_API + 'logout', logoutOptions);
    }
    encrypt(value): Observable<any> {
        return this.http.get(AUTH_API + 'getkey?paramater=' + value + '&type=encrypt', httpKeyOption);
    }
    decrypt(value): Observable<any> {
        return this.http.get(AUTH_API + 'getkey?paramater=' + value + '&type=decrypt', httpKeyOption);
    }
    refreshToken(): Observable<any> {
        return this.http.post(AUTH_API + 'refreshToken', {
            accessToken:this.gVaraible.accesstoken,
            refreshToken: this.gVaraible.refreshToken 
        }, httpOptions);
    }
}
