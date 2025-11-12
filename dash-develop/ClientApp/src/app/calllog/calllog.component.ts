import { Component, Input,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from '../_services/report.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import {  eventSubscriber } from '../order-details/placeorder-child.interface';
import { CalllogService } from './calllog.service';
import { CalllogDialogService } from './calllog-entry/calllog-dialog.service';

@Component({
  selector: 'calllog-detail',
  templateUrl: './calllog.component.html',
  styleUrls: ['./calllog.component.css']
})
export class CalllogComponent implements OnInit {
    @Input() dealerData;
    
    selectedDealerAddress: string;
    selectedScreen: string = "calllog";
    dealerId:string;
    callLogData:any;
    constructor(
        private confirmDialogService: ConfirmDialogService, 
        private route: ActivatedRoute,
        private reportService: ReportService, 
        private calllogService:CalllogService,
        private calllogDialogService:CalllogDialogService
        ) {  this.executeAction = this.executeAction.bind(this);
            eventSubscriber(calllogService.subscription, this.executeAction); }
            
          executeAction() {
                this.getCallList(this.dealerId);
            }
            
          ngOnDestroy(): void {
            this.calllogService.setRefreshHistory(false);
            eventSubscriber(this.calllogService.subscription, this.executeAction, true);
        
        }

    ngOnInit(): void {
        document.body.classList.remove('bg-img');
        const routeParams = this.route.snapshot.paramMap;
        const dealerIdFromRoute = routeParams.get('dealerid');
        this.dealerId = dealerIdFromRoute;
        this.getCallList(this.dealerId);
    }
    refreshCallHistory(){
        this.getCallList(this.dealerId);
    }
    getCallList(dealerId): void {
        this.reportService.getNotes(dealerId).subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002") {
                    this.callLogData = rdata.resp_body;
                } else {
                    this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    }
    editCallLog(row){
        this.calllogDialogService.showDialog("edit",row,()=>{
            if(this.selectedScreen=="calllog"){
                this.calllogService.executeAction(true);
            }
        },()=>{});
    }
    calculateDiff(sentOn){

        let todayDate = new Date();
        let sentOnDate = new Date(sentOn);
        sentOnDate.setDate(sentOnDate.getDate());
        let differenceInTime = todayDate.getTime() - sentOnDate.getTime();
        // To calculate the no. of days between two dates
        let differenceInDays = Math.floor(differenceInTime / (1000 * 3600)); 
        return differenceInDays;
  }
}
