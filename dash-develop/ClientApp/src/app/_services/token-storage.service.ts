import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { MyGlobal } from '../_services/myglobal.service';
import { LoginService } from '../_services/login.service';

const TOKEN_KEY = 'auth-token';
const OTPTOKEN_KEY = 'auth-o-token';
const RefID = 'RefID';
const USER_KEY = 'auth-user';
const DeviceID = 'auth-deviceid';
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

    constructor(private GlobalVariables: MyGlobal,private login:LoginService) { }

    signOut(): void {
        window.localStorage.clear();
      this.GlobalVariables.encryptdecryptMobile = "";
      this.GlobalVariables.encryptdecryptCode = "";
      this.GlobalVariables.deviceID = "";
      this.GlobalVariables.tokenID = "";
      this.GlobalVariables.otpTokenID = "";
      this.GlobalVariables.accesskey = "";
      this.GlobalVariables.accesstoken = "";
      this.GlobalVariables.active = "";
      this.GlobalVariables.dlr_img_logo = "";
      this.GlobalVariables.refreshToken = "";
      this.GlobalVariables.userType = "";
      this.GlobalVariables.contactName = "";
      this.login.logout();

  }
    public saveRefId(token: string): void {
        window.localStorage.removeItem(RefID);
        window.localStorage.setItem(RefID, token);
    }

    public getRefId(): string {
        const serializableState: string | any = localStorage.getItem(RefID);
        return serializableState !== null || serializableState === undefined ? serializableState : undefined;
    }
  public saveToken(token: string): void {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.setItem(TOKEN_KEY, token);
  }

    public getToken(): string {
        const serializableState: string | any = localStorage.getItem(TOKEN_KEY);
        return serializableState !== null || serializableState === undefined ? serializableState : undefined;
  }
    public saveOtpToken(token: string): void {
        window.localStorage.removeItem(OTPTOKEN_KEY);
        window.localStorage.setItem(OTPTOKEN_KEY, token);
    }

    public getOtpToken(): string {
        const serializableState: string | any = localStorage.getItem(OTPTOKEN_KEY);
        return serializableState !== null || serializableState === undefined ? serializableState : undefined;
    }
  public saveUser(user): void {
      window.localStorage.removeItem(USER_KEY);
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

    public getUser(): any {
        const serializableState: string | any = localStorage.getItem(USER_KEY);
        return serializableState !== null || serializableState === undefined ? JSON.parse(serializableState) : undefined;
    }
    public saveDeviceID(deviceid): void {
        window.localStorage.removeItem(DeviceID);
        window.localStorage.setItem(DeviceID, deviceid);
    }

    public getDeviceID(): any {
        const serializableState: string | any = localStorage.getItem(DeviceID);
        return serializableState !== null || serializableState === undefined ? serializableState : undefined;
    }
}
