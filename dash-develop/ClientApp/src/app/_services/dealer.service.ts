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
export class DealerService  {
    encryptdecryptMobile: string;
    encryptdecryptCode: string;

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

    
    getdealerlist(stateid:string): Observable<any> {
        return this.http.get(AUTH_API + 'dash/agent_customers_list?isMyCallList=N&stateId='+stateid, this.getHeaders());
    }
    getdealerdata(dealerid): Observable<any> {
        return this.http.get(AUTH_API + 'orders/getDealerData/v2?dealerId=' + dealerid, this.getHeaders());
    }
    
    /*mappingset(dealerid,incogroup,producttype,material,shiptoparty,transportType): Observable<any> {
        return this.http.post(AUTH_API + 'orders/l1mappingset', {
            dealerId: dealerid,
            incoGroup: incogroup,
            transportType:transportType,
            productType: producttype,
            material: material,
            shipToParty: shiptoparty
      }, this.getHeaders());
    }*/
    mappingset(mappingData): Observable<any> {
        return this.http.post(AUTH_API + 'orders/l1mappingset/v2', 
            mappingData
        , this.getHeaders());
    }
    submitorder(dealerid, orders): Observable<any> {
        return this.http.post(AUTH_API + 'orders/placeOrder/v2', {
            dealerId: dealerid,
            orders: orders
        }, this.getHeaders());
    }
    getOrderStatus(orderId, orderNumber, orderStatus, creationTime, receivedDateTime): Observable<any> {
        return this.http.post(AUTH_API + 'orders/get_order_status', {
            orderId: orderId,
            orderNumber: orderNumber?orderNumber:null,
            status: orderStatus,
            creationTime: creationTime,
            orderReceiveDateTime:receivedDateTime
        }, this.getHeaders());
    }
    getAllOrders(dealerid,pageid): Observable<any> {
        return this.http.post(AUTH_API + 'orders/getAllOrders', {
            dealerId: dealerid,
            page: pageid,
            dateFrom: "",
            dateTo: "",
        }, this.getHeaders());
    }
    confirmEpod(invoiceid): Observable<any> {
        return this.http.post(AUTH_API + 'orders/pod-confirm-invoices', {
            invoice_id_list: invoiceid
        }, this.getHeaders());
    }
    downloadInvoice(invoiceid): Observable<any> {
        return this.http.get(AUTH_API + 'orders/invoice_download?invoiceId=' + invoiceid, this.getHeaders());
    }

    getMapUrlInvoice(invoiceid): Observable<any> {
        return this.http.post(AUTH_API_DOMAIN + '/DalmiaBharat/dalmiabharat/GenericWebService/v9/invoice-tracking-map-view',
            {
            accessToken:this.gVaraible.accesstoken,
            appName: environment.appName,
            referenceId: this.gVaraible.xrefid,
            invoiceNo:invoiceid
            } , this.getHeaders());
    }
    getdealercheatsheetdata(dealerId): Observable<any> {
        return this.http.get(AUTH_API + 'user/webservice/v1/getDealerCheatSheetData/' + dealerId,this.getHeaders());
    }
    getperformancedata(dealerId): Observable<any> {
        return this.http.get(AUTH_API + 'orders/getperformancedetails/' + this.gVaraible.userType + '/' + dealerId + '/' + dealerId, this.getHeaders());
    }
    getProfiledata(dealerId): Observable<any> {
        return this.http.get(AUTH_API + 'DalmiaBharat/dalmiabharat/DealerWebservice/v13/getProfileDetails/' + this.gVaraible.userType + '/' + dealerId + '/' + dealerId, this.getHeaders());
    }

    getSOAppdata(dealerId,mobileno): Observable<any> {
        return this.http.post(AUTH_API + 'user/webservice/v1/so-app-data',  {
            mobile_number: mobileno,
            so_id:"",
            type:this.gVaraible.userType
        }, this.getHeaders());
    }
    
    getShipToPartyDetailsByTzone(dealerId): Observable<any> {
        return this.http.get(AUTH_API + 'orders/getShipToPartyDetailsByTzone?dealerId=' + dealerId , this.getHeaders());
        //return this.http.get(AUTH_API + 'orders/getShipToPartyDetailsByDistance?dealerId=' + dealerId , this.getHeaders());
    }
    getSOTSEData(dealerId): Observable<any> {
        return this.http.get(AUTH_API + 'dash/get_so_tse_info?dealerId=' + dealerId , this.getHeaders());
    }
    getAuthorisedStaffMemberDetails(dealerId):Observable<any>  {
        return this.http.get(AUTH_API + 'user/webservice/v1/getAuthorisedStaffMemberDetails/' + dealerId , this.getHeaders());
    }

    getDealerProfileDetails(dealerId, profiletype):Observable<any> {
        return this.http.get(AUTH_API_DOMAIN + '/DalmiaBharat/dalmiabharat/DealerWebservice/v14/getProfileTypeDetails/DEALER/' + dealerId , this.getProfileHeaders(profiletype));
    }
    getDealerAddressDetails(dealerId):Observable<any> {
        return this.http.get(AUTH_API + 'user/webservice/v1/getDealerLocation/' + dealerId , this.getHeaders());
    }
    getLastCallId(dealerId): Observable<any> {
        return this.http.get(AUTH_API + 'dash/get_last_call_id?dealerId=' + dealerId , this.getHeaders());
    }
    getNoteFormData(): Observable<any> {
        return this.http.get(AUTH_API + 'dash/get_note_form_data'  , this.getHeaders());
    }
    saveNote(dealerId,formdata): Observable<any> {
        return this.http.post(AUTH_API + 'dash/save_note', {
            dealerId: dealerId,
            check_order_discussion_id: formdata.CK0006?"CK0006":"",
            order_discussion_id: formdata.select_CK0006?formdata.select_CK0006:"",
            next_followUp_date: formdata.nextFollowupDate?formdata.nextFollowupDate:"",
            note: formdata.notes,
            check_non_billing_churn_id: formdata.CK0001?"CK0001":"",
            non_billing_reason_id:formdata.select_CK0001?formdata.select_CK0001:"",
            check_complaint_sr_id: formdata.CK0002?"CK0002":"",
            check_scheme_id: formdata.CK0003?"CK0003":"",
            check_others_id: formdata.CK0005?"CK0005":"",
            call_id: formdata.callid,
            check_outstaing_collection_id: formdata.CK0004?"CK0004":"",
            complaint_sr_id:formdata.select_CK0002?formdata.select_CK0002:"",
            outstanding_collection_id:formdata.select_CK0004?formdata.select_CK0004:"",
            scheme_id:formdata.select_CK0003?formdata.select_CK0003:"",
            others_id:formdata.select_CK0005?formdata.select_CK0005:"",
            save_note_id:formdata.save_note_id
      }, this.getHeaders());
    }  
    getCallerData(dealerMobileNo,dealerId): Observable<any> {
        return this.http.get('http://dialdesk.co.in/dalmia/api.php?source=test&agent_user='+this.gVaraible.referenceId+'&function=external_dial&value='+dealerMobileNo+'&phone_code=1&delear_id='+dealerId);
    }
    
    getCallerWrapperData(dealerMobileNo,dealerId): Observable<any> {
        return this.http.post(AUTH_API+'dash/dialer_call_end_start',  {
            dealer_id: dealerId,
            dialer_phone_numer:dealerMobileNo,
            is_Call_Start: 'Y',
        },this.getHeaders());
    }
    getCDData(dealerId): Observable<any> {
        return this.http.post(AUTH_API_DOMAIN+'/DalmiaBharat/dalmiabharat/GenericWebService/v8/cd_dealer_data',  {
            dealerId: dealerId,
            accessToken:this.gVaraible.accesstoken,
            appName: environment.appName,
            referenceId: this.gVaraible.xrefid,
        },this.getCDHeaders());
    }
    getOrderReason(): Observable<any> {
        return this.http.get(AUTH_API +'cancleOrderReason/getOrderReasons',this.getHeaders() );
    } 
    editCancelOrder(data): Observable<any> {
        return this.http.post(AUTH_API +'orders/editCancleOrder' ,  {
        message: data.message,
        orderId: data.orderId,
        orderNo: data.orderNo,
        orderStatus: data.orderStatus,
        quantity: data.quantity,
        reason: data.reason,
        reasonId: data.reasonId
        },this.getHeaders());
    }
    getPriceCapture(dealerId): Observable<any> {
        return this.http.get(AUTH_API +'dash/get_price_capture?dealerId='+dealerId,this.getHeaders() );
    } 
    postPriceCompareData(data:any): Observable<any> {
        return this.http.post(AUTH_API +'dash/price_capture',data,this.getHeaders() );
    } 
}
