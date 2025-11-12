import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DealerService } from '../_services/dealer.service';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { OrderDetailsComponent }  from '../order-details/order-details.component';
import { ShiptopartyDialogService } from '../order-details/shiptoparty/shiptoparty-dialog.service';
import { L1MappingDialogService } from '../order-details/l1mappings/l1mapping-dialog.service';
import { OrderConfirmDialogService } from '../order-details/orderconfirm/orderconfirm-dialog.service';
import { OrderStatusDialogService } from '../order-details/orderstatus/orderstatus-dialog.service';
import { CancelorderDialogService } from '../order-details/cancel-order/cancelorder-dialog.service';
import { PlaceOrderService } from '../order-details/placeorder.service';
import { CalllogDialogService } from '../calllog/calllog-entry/calllog-dialog.service';
import { MyGlobal } from '../_services/myglobal.service';
import { CalanderDialogService } from '../order-details/calander/calander-dialog.service';
import { DatePipe } from '@angular/common';
// import { profile } from 'console';


@Component({
  selector: 'app-dealer-detail',
  templateUrl: './dealer-detail.component.html',
  styleUrls: ['./dealer-detail.component.css'],
  providers: [OrderDetailsComponent,DatePipe]
})
export class DealerDetailComponent implements OnInit {
    //@ViewChild(OrderDetailsComponent ) orderChild: OrderDetailsComponent ; 

    dealerData: any = {};
    selectedDealerAddress: string;
    selectedDealerCity: string;
    selectedScreen: string = "order";
    dealerId: string;
    dealerCheatSheetData: any ;
    callLogFormData:any;
    dealerProfileData:any;
    dealerSoAppData:any;
    soTseData:any;
    dealerAddressData:any;
    dealerManagerData:any;
    lastCallDateTime:any;
    activeAddress:any;
    activeAddressIndex=0;
    dealerPersonalProfile:any;
    dealerStaffMemberProfile:any;
    isContactCollapsed:boolean=false;
    issotseCollapsed:boolean=true;
    islocaionCollapsed:boolean=true;
    isdobCollapsed:boolean=true;
    ismanagerProfileCollapsed:boolean=true;
    isPotentialCollapsed:boolean=true;
    callData:any;
    hidecall:boolean=false;
    constructor(
        private route: ActivatedRoute,
        private confirmDialogService: ConfirmDialogService, 
        private orderService:PlaceOrderService,
        private dealerService: DealerService,
        private shiptopartyDialogService: ShiptopartyDialogService,
        private l1MappingDialogService: L1MappingDialogService,
        private orderConfirmDialogService: OrderConfirmDialogService,
        private orderStatusDialogService: OrderStatusDialogService,
        private calllogDialogService: CalllogDialogService,
        private cancelorderDialogService:CancelorderDialogService,
        private GlobalVariable:MyGlobal,
        private calander:CalanderDialogService,
        private datepipe:DatePipe
        ) 
        {
            
         }
         
    ngOnInit(): void {
        this.hidecall=this.GlobalVariable.agentId.indexOf("SA")!=-1?true:false;
        document.body.classList.remove('bg-img');
        const routeParams = this.route.snapshot.paramMap;
        const dealerIdFromRoute = routeParams.get('dealerid');
        this.dealerId = dealerIdFromRoute;
        this.getCollectionData(dealerIdFromRoute);
        this.getDealerData(dealerIdFromRoute);
        this.getLastCallId(dealerIdFromRoute);
        this.getNoteFormData();
        
    }
    
    getDealerData(dealerid): void {
        this.dealerService.getdealerdata(dealerid).subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002" || rdata.resp_code == "DM6002") {
                    this.dealerData = rdata.resp_body;
                    const address = rdata.resp_body.addressList.find(dealer => dealer.addressId === dealerid);
                    this.selectedDealerAddress = address !=null ? address.addressLine1 + "," + (address.addressLine2 != "" ? address.addressLine2 + "," : "") :"";
                    this.selectedDealerCity =  address !=null ? address.city + "," + address.pincode:"";
                    const currentDealer=rdata.resp_body.dealerList.find(x=>x.dealerId==dealerid);
                    if(currentDealer){
                        this.getSOTSEdata(dealerid);
                        this.getDealerAddressDetails(dealerid);
                        this.getAuthorisedStaffMemberDetails(dealerid);
                        this.getDealerProfileDetails(dealerid,'personal');
                        this.getDealerProfileDetails(dealerid,'business');
                        //this.getCallerLink(dealerid)
                    }
                } else {
                    this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });

            }
        );
    }
    changeScreen(type) {
        this.selectedScreen = type;
    }
    getCollectionData(dealerid): void {
        this.dealerService.getdealercheatsheetdata(dealerid).subscribe(
            rdata => {
                if (rdata.response_code == "DM1002") {
                    this.dealerCheatSheetData = rdata.response_body;
                } else {
                    this.confirmDialogService.showMessage(rdata.response_msg, () => { });
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    }
    placenewOrders(){
        
        if(this.dealerCheatSheetData && this.dealerCheatSheetData.status!='Active'){
            var blockreason="";
            if(this.dealerData.blockedReason &&this.dealerData.blockedReason!=null){
                blockreason=this.dealerData.blockedReason;
            }
            this.confirmDialogService.showMessage(" "+blockreason, () => { });
            return;
        }
        if(this.selectedScreen=="order"){
            //this.orderChild.newOrder();
            this.orderService.executeAction(true);
        }else{
            this.selectedScreen="order";
            var obj=new OrderDetailsComponent(this.route,this.dealerService,this.confirmDialogService,this.shiptopartyDialogService,this.l1MappingDialogService,this.orderConfirmDialogService,this.orderStatusDialogService,this.orderService,this.cancelorderDialogService,this.calander,this.datepipe);
            this.orderService.executeAction(true);
        }
    }
     
    newCalllogEntry(){
        if(this.dealerData && this.dealerData.dealerList && this.dealerData.dealerList.length>0){
            this.calllogDialogService.showDialog("new",this.dealerData.dealerList[0],()=>{
            
            },()=>{});
        }else{
            this.confirmDialogService.showMessage("Dealer information not available", () => { });
        }
        
        
    }
    getProfiledata(dealerid){
        this.dealerService.getProfiledata(dealerid).subscribe(
            rdata => {
                if (rdata.response_code == "DM1002") {
                    this.dealerProfileData = rdata.response_body;
                } else {
                    this.confirmDialogService.showMessage(rdata.response_msg, () => { });
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    }
   

    getSOTSEdata(dealerid){
        this.dealerService.getSOTSEData(dealerid).subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002") {
                    this.soTseData = rdata.resp_body;
                } else {
                    this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    }
    getActiveAddress(index){
        this.activeAddressIndex=index;
        if(this.dealerAddressData && this.dealerAddressData.address && this.dealerAddressData.address.length>index)
            this.activeAddress=this.dealerAddressData.address[index];
            else
            this.activeAddress=null
    }
    getDealerProfileDetails(dealerid,profiletype){
        this.dealerService.getDealerProfileDetails(dealerid,profiletype).subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002") {
                    if(profiletype=="personal"){
                        this.dealerPersonalProfile = rdata.resp_body.dealerPersonalList;
                    }else{
                        this.dealerStaffMemberProfile=rdata.resp_body.dealerBusinessList.staffMemberList;
                    }
                } else {
                    this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    }
    getDealerAddressDetails(dealerid){
        this.dealerService.getDealerAddressDetails(dealerid).subscribe(
            rdata => {
                if (rdata.response_code == "DM1002") {
                    this.dealerAddressData = rdata.response_body;
                    this.getActiveAddress(0);
                } else {
                    this.confirmDialogService.showMessage(rdata.response_msg, () => { });
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    }
    getAuthorisedStaffMemberDetails(dealerid){
        this.dealerService.getAuthorisedStaffMemberDetails(dealerid).subscribe(
            rdata => {
                if (rdata.response_code == "DM1002") {
                    this.dealerManagerData = rdata.response_body;
                } else {
                    this.confirmDialogService.showMessage(rdata.response_msg, () => { });
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    }
    getLastCallId(dealerid){
        this.dealerService.getLastCallId(dealerid).subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002") {
                    this.lastCallDateTime=rdata.resp_body.endTime;
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    }
    getNoteFormData(){
        this.dealerService.getNoteFormData().subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002") {
                    this.callLogFormData = rdata.resp_body;
                } else {
                    this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    }

    
    
    
}
