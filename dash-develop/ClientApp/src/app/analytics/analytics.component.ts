import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DealerService } from '../_services/dealer.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { MyGlobal } from '../_services/myglobal.service';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { PopupDialogService } from '../popup-detail/popup-dialog.service';


@Component({
  selector: 'analytics-detail',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
    dealerData: any;
    selectedDealerAddress: string;
    selectedScreen: string = "order";
    dealerId:string="";
    dapId:string;
    constructor(
        private route: ActivatedRoute,
        private popupDialogService: PopupDialogService,
        private confirmDialogService: ConfirmDialogService, 
        private GlobalVariable: MyGlobal, 
        private router: Router, 
        private dealerService: DealerService, 
        private tokenStorage: TokenStorageService) { }

    ngOnInit(): void {
        document.body.classList.remove('bg-img');
        const routeParams = this.route.snapshot.paramMap;
        const dealerIdFromRoute = routeParams.get('dealerid');
        this.dealerId = dealerIdFromRoute;
        this.getDealerData();
    }
    getDealerData(): void {
        this.dealerService.getdealercheatsheetdata(this.dealerId).subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002" ) {
                    this.dealerData = rdata.response_body;
                    this.dapId=this.dealerData.dapId;
                } else {
                    this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    }
    salesSummary(): void {
        this.popupDialogService.showDataDialog("salesanalysissummary","","",this.dealerId,this.dealerId);
    }
    QDandCDData(){
        this.popupDialogService.showDataDialog("qdcd","QD and CD","",this.dealerId,this.dealerId);
    }
    salesTrend(){
        this.popupDialogService.showDataDialog("salestrend","Sales Trend","Sales Overview",this.dealerId,this.dealerId);
    }
    salesComparewithLastyear(){
        this.popupDialogService.showDataDialog("saleshistory","Sales History","",this.dealerId,this.dealerId);
    }
    collectionTrend(){
        this.popupDialogService.showDataDialog("collectiontrend","Collection Trend","Collection Overview",this.dealerId,this.dealerId);
    }
    collectionComparewithLastyear(){
        this.popupDialogService.showDataDialog("paymenthistory","Payment History","Payment Overview",this.dealerId,this.dealerId);
    }
    daySalesOutstanding(){
        this.popupDialogService.showDataDialog("salesoutstanding","Sales Outstanding","",this.dealerId,this.dealerId);
    }
    
    productWiseSale(){
        this.popupDialogService.showDataDialog("productwisesales","Product wise sale","",this.dealerId,this.dapId);
    }
    collectionSummary(){
        this.popupDialogService.showDataDialog("salesanalysissummary","","",this.dealerId,this.dealerId);
    }
    salesAgeingOutstanding(){
        this.popupDialogService.showDataDialog("companywiseaging","Aging Outstanding","",this.dealerId,"");
    }
    
    
     
}
