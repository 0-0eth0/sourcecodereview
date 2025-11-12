import { Component,  OnInit } from '@angular/core';
import { PopupDialogService } from './popup-dialog.service';
import { ReportService } from '../_services/report.service';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { formatDate } from '@angular/common';

@Component({
    selector: 'popup-dialog',
    templateUrl: 'popup-dialog.component.html',
    styleUrls: ['popup-dialog.component.scss']
})
export class PopupDialogComponent implements OnInit {
    moduleData:any;
    dealerId:string;
    dapId:string;
    data: any;
    title:string="";
    subtitle:string="";
    ageingReportData:any={};
    ageingCompany=[];
    ReportData=[];
    totalOs="";
    public refreshTime:any;
    selectedComboValue="";
    constructor(private confirmDialogService: ConfirmDialogService,private reportService: ReportService,private popupDialogService: PopupDialogService) { }

    ngOnInit(): any {
        this.popupDialogService.getData().subscribe(data => {
            this.dealerId=this.popupDialogService.getDealerId();
            this.dapId=this.popupDialogService.getDapId();
    
            this.data = data;
            if(this.data){
                this.title=this.data.reportTitle;
                this.subtitle=this.data.subTitle;
                if(this.data.type=="companywiseaging"){
                    this.getCompanywiseAgingData();
                }
            }
        });
    }
    getCompanywiseAgingData(){
        this.reportService.getCompanywiseAgingDetails(this.dealerId).subscribe(
            rdata => {
                if (rdata.response_code == "DM1002") {
                    this.moduleData = rdata.response_body.company_wise_agings;
                    this.refreshCurrentTime();
                    this.ageingCompany=[];
                    this.moduleData.forEach(element => {
                        if(!this.ageingCompany.find(x=>x.name==element.companyName)){
                            let obj:any={};
                            obj.name=element.companyName;
                            this.ageingCompany.push(obj);
                        }
                    });
                    if(this.ageingCompany.length>0){
                        this.selectChangeHandler("companywiseaging",this.ageingCompany[0].name);
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
    
    selectChangeHandler(type,val){
        this.selectedComboValue=val;
        this.ReportData=[];
        if(type=="companywiseaging"){
            this.moduleData.forEach(element => {
                if(element.companyName==this.selectedComboValue){
                    if(element.aging_days== "Total OS"){
                        this.totalOs=element.amount;
                    }else{
                        var obj:any={};
                        obj.ageing=element.aging_days;
                        obj.amount=element.amount;
                        this.ReportData.push(obj);
                    }
                    if(!this.ageingCompany.find(x=>x.name==element.companyName)){
                        let obj:any={};
                        obj.name=element.companyName;
                        this.ageingCompany.push(obj);
                    }
                }
            }); 
        }
    }
    refreshCurrentTime(){
        this.refreshTime= formatDate(new Date(), 'dd/MM/yyyy hh:mm:ss a', 'en-US', '+0530');
    }
}
