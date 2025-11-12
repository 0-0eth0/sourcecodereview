import { Component, OnInit  } from '@angular/core';
import { OrderStatusDialogService } from './orderstatus-dialog.service';
import { FormBuilder } from "@angular/forms";
import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';
import { CancelorderDialogService } from '../cancel-order/cancelorder-dialog.service';
import { DealerService } from '../../_services/dealer.service';
// import { FileService } from './file.service';
// import * as fileSaver from 'file-saver';

@Component({
    selector: 'order-status-dialog',
    templateUrl: 'orderstatus-dialog.component.html',
    styleUrls: ['orderstatus-dialog.component.scss']
})


export class OrderStatusDialogComponent implements OnInit {
    message: any;
    selectedShipment:any;
    form: any = {}
    orderStatusData: any;
    orderData: any;
    selectedIndex=0;
    ContentType="product";
    constructor(public fb: FormBuilder,
        private dealerService: DealerService,
        private confirmDialogService: ConfirmDialogService,
        private orderStatusDialogService: OrderStatusDialogService,
        private cancelOrderDialogService:CancelorderDialogService
    ) {}
    
    ngOnInit(): any {

        this.orderStatusDialogService.getMessage().subscribe(message => {
            this.message = message;
            if(message){
                this.ContentType="product";
                this.selectedShipment= message.text.statusdata[0];
                this.selectedIndex=0;
            }
            
        });
        
        
    }
    selectShipment(indexOfelement){
        this.selectedIndex=indexOfelement;
        this.selectedShipment=  this.message.text.statusdata[indexOfelement];
    }
    confirmepod(lists) {
        if (lists) {
            let invoicelists = [];
            invoicelists.push(lists);

            this.dealerService.confirmEpod(invoicelists).subscribe(
                rdata => {
                    if (rdata.resp_code == "DM1002") {
                        this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                    } else {
                        this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                    }
                },
                err => {
                    this.confirmDialogService.showMessage(err.message, () => { });
                }
            );
        } else {
            this.confirmDialogService.showMessage("Invoice information not available", () => { });
        }
        
    }
    downloadinvoice(lists) {
        if (lists) {
            let invoicelists = [];
            invoicelists.push(lists);

            this.dealerService.downloadInvoice(lists).subscribe(
                rdata => {
                    if (rdata.resp_code == "DM1002") {
                        // let blob:any = new Blob([atob(rdata.resp_body.file)], { type: 'application/pdf; charset=utf-8' });
			            // const url = window.URL.createObjectURL(blob);
			            // window.open(url);
                        this.downloadPDF(rdata.resp_body.file);
                    } else {
                        this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                    }
                },
                err => {
                    this.confirmDialogService.showMessage(err.message, () => { });
                }
            );
        } else {
            this.confirmDialogService.showMessage("Invoice information not available", () => { });
        }
    }
    downloadPDF(pdf:string) {
        const linkSource = 'data:application/pdf;base64,'+pdf;
        const downloadLink = document.createElement("a");
        const fileName = "dalmiainvoice.pdf";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
        downloadLink.remove();
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
    editCancelOrder(type){
        if(this.calculateDiff(this.message.text.orderdata.orderDate)>8){
            this.confirmDialogService.showMessage("Order date exceed 8 days", () => { });
            return;
        }
        this.cancelOrderDialogService.setCancelOrderList(type,this.message.text,()=>{
            this.message.refreshFn()
        },()=>{});
        
    }
    viewTrackingMap(lists) {
        this.ContentType="map";
    }
    viewTrackingMap1(lists) {
        if (lists) {
            
            this.dealerService.getMapUrlInvoice(lists).subscribe(
                rdata => {
                    if (rdata.resp_code == "DM1002") {
			            window.open(rdata.url);
                    } else {
                        this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                        //http://localhost:4200/dealerdetail/0007000902
                    }
                },
                err => {
                    this.confirmDialogService.showMessage(err.message, () => { });
                }
            );
        } else {
            this.confirmDialogService.showMessage("Invoice information not available", () => { });
        }
    }
}
