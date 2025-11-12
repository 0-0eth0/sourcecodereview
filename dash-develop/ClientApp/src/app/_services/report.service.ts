import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MyGlobal } from './myglobal.service';


const AUTH_API = environment.apiURL + environment.apiPATH ;



@Injectable({
  providedIn: 'root'
})
export class ReportService  {
    
    constructor(private gVaraible: MyGlobal, private http: HttpClient) {  }
    result = new Observable<any>();
    getHeader(){
        const httpHeaer = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-AppName': environment.appName,
                'X-ReferenceId': this.gVaraible.xrefid,
                'X-Access-Token': this.gVaraible.accesstoken,
                'appVersion': environment.appVersion,
                'versionCode': environment.appVersion,
                'device_model': this.gVaraible.device_model,
                'device_manufacturer': this.gVaraible.device_manufacturer,
                'device_os': this.gVaraible.deviceOS,
                'deviceApiLevel': this.gVaraible.deviceApiLevel,
                'deviceVersionNumber': this.gVaraible.deviceVersionNumber,
                'deviceId': this.gVaraible.deviceID,
                'userType': this.gVaraible.userType
            })
        };
        return httpHeaer;
    }
    getCompanywiseAgingDetails(dealerId): Observable<any> {
        return this.http.get(AUTH_API + 'user/webservice/v1/company-wise-aging/'+dealerId, this.getHeader());
    }
    getSalesTrend(dealerId): Observable<any> {
        return this.http.get(AUTH_API + 'user/webservice/v1/getSalesDataByDealerId/'+dealerId, this.getHeader());
    }
    getanalytsdatabydapid(dapid): Observable<any> {
        return this.http.get(AUTH_API + 'user/webservice/v1/getAnalyticsDetailsByDapId/' + dapid, this.getHeader());
    }
    getSalesHistory(dealerid): Observable<any> {
        return this.http.get(AUTH_API + 'user/webservice/v1/getSalesHistoryByDealerId/' + dealerid, this.getHeader());
    }
    getCollectionTrend(dealerid): Observable<any> {
        return this.http.get(AUTH_API + 'user/webservice/v1/getTargetDataByDealerId/' + dealerid, this.getHeader());
    }
    getCDandDM(dealerId): Observable<any> {
        return this.http.get(AUTH_API + 'user/webservice/v1/getPartyDiscountByDealerId/'+dealerId, this.getHeader());
    }
    getPaymentHistory(dealerid): Observable<any> {
        return this.http.get(AUTH_API + 'user/webservice/v1/getPaymentHistoryByDealerId/' + dealerid, this.getHeader());
    }
    getdealerdata(dealerId): Observable<any> {
        return this.http.get(AUTH_API + 'orders/getDealerData/v2?dealerId=' + dealerId, this.getHeader());
    }
    
    getNotes(dealerId): Observable<any> {
        return this.http.get(AUTH_API + 'dash/get_notes?dealerId='+dealerId  , this.getHeader());
    }
}
