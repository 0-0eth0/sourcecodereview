import { Component,  OnInit } from '@angular/core';
import { CancelorderDialogService } from './cancelorder-dialog.service';
import { DealerService } from '../../_services/dealer.service';
import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';

@Component({
    selector: 'cancelorder-dialog',
    templateUrl: 'cancelorder-dialog.component.html'
})

export class CancelorderDialogComponent implements OnInit {
    message: any;
    selectedVal:any;
    actionType:string;
    orderReasons:any="";
    cancelReasonid:any="";
    cancelReason:any="";
    constructor(
        private cancelorderDialogService: CancelorderDialogService,
        private dealerService:DealerService,
        private confirmDialogService:ConfirmDialogService
    ) {}
    ngOnInit(): any {
        this.cancelorderDialogService.getCancelOrderList().subscribe(message => {
            this.message = message;
            if(this.message){
                this.actionType=this.cancelorderDialogService.getActionType();
                this.getOrderReason();
                this.cancelReason="";
                
            }
        });
    }
    selectChangeHandler(e) {
        this.cancelReasonid=e.target.value;
    }
    getOrderReason() {
        this.dealerService.getOrderReason().subscribe(
            rdata => {
                if (rdata.response_code == "DM1002") {
                    this.orderReasons = rdata.response_body;
                } else {
                    //this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                }
            },
            err => {
                //this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    }
    cancelOrder() {
        if((this.cancelReasonid==""|| !this.cancelReasonid) && this.actionType=="CANCEL"){
            this.confirmDialogService.showMessage("Please select reason for update", () => { });
            return;
        }
        if(Number(this.message.text.orderdata.quantity)<.5){
            this.confirmDialogService.showMessage("Order quantity should be 0.5 ton  ", () => { });
            return;
        }
        //if(((Number(item.quantity)*100.0)%5)>0){
        if(((Number(this.message.text.orderdata.quantity)*100.0)%5)>0){
            this.confirmDialogService.showMessage("Please enter quantity in multiples of 0.05 ton  ", () => { });
            return;
        }
        var reasonText="";
        if(this.orderReasons.find(x=>x.id==this.cancelReasonid)){
            reasonText=this.orderReasons.find(x=>x.id==this.cancelReasonid).reason;
        }
        var data:any={};
        data.message=this.cancelReason;
        data.orderId=this.message.text.orderdata.orderId;
        data.orderNo=this.message.text.orderdata.orderNumber?this.message.text.orderdata.orderNumber:null;
        data.orderStatus=this.actionType;
        data.quantity=this.message.text.orderdata.quantity;
        data.reason=reasonText;
        data.reasonId=this.cancelReasonid  && this.cancelReasonid!=""?this.cancelReasonid:"00";
        this.dealerService.editCancelOrder(data).subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002") {
                    this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                    this.message.yesFn();
                } else {
                    this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
        
    }
    calculateDiff(sentOn){

        let todayDate = new Date();
        let sentOnDate = new Date(sentOn);
        sentOnDate.setDate(sentOnDate.getDate());
        let differenceInTime = todayDate.getTime() - sentOnDate.getTime();
        // To calculate the no. of days between two dates
        let differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); 
        return differenceInDays;
   }
}
