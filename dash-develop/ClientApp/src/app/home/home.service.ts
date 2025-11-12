import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MyGlobal } from '../_services/myglobal.service';

const AUTH_API_DOMAIN = environment.apiURL;
const AUTH_API = environment.apiURL + environment.apiPATH ;

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};


@Injectable({
  providedIn: 'root'
})
export class HomeService  {

    constructor(private gVaraible: MyGlobal, private http: HttpClient) {  }
    result = new Observable<any>();
    getHeaders(){
        const httpHeaer = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-Access-Token': this.gVaraible.accesstoken,
                'X-AppName': environment.appName,
                'X-ReferenceId': this.gVaraible.xrefid,
                'appVersion': environment.appVersion,
                'versionCode': environment.appVersion,
                'device_model': this.gVaraible.device_model,
                'device_manufacturer': this.gVaraible.device_manufacturer,
                'device_os': this.gVaraible.deviceOS,
                'deviceApiLevel': this.gVaraible.deviceApiLevel,
                'deviceVersionNumber': this.gVaraible.deviceVersionNumber,
                'deviceId': this.gVaraible.deviceID,
                'userType': this.gVaraible.userType,
            })
        };
        return httpHeaer;
    }
    getCDHeaders(){
        const httpHeaer = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            })
        };
        return httpHeaer;
    }

    getProfileHeaders(profiletype){
        const httpHeaer = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'accessToken': this.gVaraible.accesstoken,
                'appName': environment.appName,
                'referenceId': this.gVaraible.xrefid,
                'userType': this.gVaraible.userType,
                'profileType':profiletype
            })
        };
        return httpHeaer;
    }

    
    getPerformanceData(fromDate,toDate): Observable<any> {
        return this.http.post(AUTH_API + 'dash/get_agent_performance',{
            fromDate: fromDate,
            toDate: toDate,
      }, this.getHeaders());
    }
    getBilledUnbilledCustomer(fromDate,toDate): Observable<any> {
        return this.http.post(AUTH_API + 'dash/get_dealers_billing_info',{
            fromDate: fromDate,
            toDate: toDate,
      }, this.getHeaders());
    }
    getPendingOrders(fromDate,toDate): Observable<any> {
        return this.http.post(AUTH_API + 'orders/get_pending_orders',{
            fromDate: fromDate,
            toDate: toDate,
            page:1
      }, this.getHeaders());
    }
    getTotalOutstanding(fromDate,toDate): Observable<any> {
        return this.http.post(AUTH_API + 'dash/get_outstanding_collections',{
            fromDate: fromDate,
            toDate: toDate,
      }, this.getHeaders());
    }
    getChurnDealers(): Observable<any> {
        return this.http.get(AUTH_API + 'dash/get_churn_dealers?page=1', this.getHeaders());
    }
    getCreditBlockedDealers(): Observable<any> {
        return this.http.get(AUTH_API + 'dash/get_credit_block_dealers', this.getHeaders());
    }
    getOtherActions(dealerid): Observable<any> {
        return this.http.get(AUTH_API + 'orders/getDealerData/v2?dealerId=' + dealerid, this.getHeaders());
    }
    getHomeWidgetData(): Observable<any> {
        return this.http.get(AUTH_API + 'dash/get_volumes_customers_billed_info', this.getHeaders());
    }
}
