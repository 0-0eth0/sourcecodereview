import { Component, Input, OnInit,AfterViewChecked, OnDestroy} from '@angular/core';
import { CalllogDialogService } from './calllog-dialog.service';
import { DealerService } from '../../_services/dealer.service';
import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';
import {  Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { CalllogService } from '../calllog.service';
import { DatePipe } from '@angular/common'
import { PriceCaptureDialogService } from '../pricecapture/pricecapture-dialog.service';
import { formatDate } from '@angular/common';

@Component({
    selector: 'calllog-dialog',
    templateUrl: 'calllog-dialog.component.html',
    styleUrls: ['calllog-dialog.component.scss'],
    providers: [DatePipe]
})
export class CalllogDialogComponent implements OnInit,AfterViewChecked,OnDestroy {
    @Input() formData;
    form: any = {};
    dealerId:string;
    dealerName:string;
    dapId:string;
    data: any;
    currentDate:string;
    lastCallId:string;
    lastCallDateTime:string;
    //formData:any;
    public rowData=new Subject<boolean>();
    contentLoaded:boolean=false;
    selectedProduct:string="";
    selectedProductValues:any;
    constructor(
        private confirmDialogService: ConfirmDialogService,
        private dealerService: DealerService,
        private calllogDialogService: CalllogDialogService,
        private calllogService:CalllogService,
        private priceCaptureService:PriceCaptureDialogService,
        public datepipe: DatePipe
        ) 
        { }
    ngOnDestroy(): void {
        this.rowData.unsubscribe();
    }
    
        get f() { 
            return this.form.controls; 
        }
    ngOnInit(): any {
        this.calllogDialogService.getData().subscribe(data => {
            this.data = data;
            if(data){
                this.dealerId=this.data.subject.dealerId;
                this.dealerName=this.data.subject.dealerName+" ("+this.data.subject.dealerId+")";
                this.selectedProduct="";
                this.selectedProductValues=undefined;
                //this.getNoteFormData();
                if(data.mode=="new"){
                    this.getLastCallId(this.data.subject.dealerId);
                    this.form.notes="";
                    this.form.CK0001="";
                    this.form.CK0002="";
                    this.form.CK0003="";
                    this.form.CK0004="";
                    this.form.CK0005="";
                    this.form.CK0006="";
                    this.form.CK0007="";
                    this.form.select_CK0001="";
                    this.form.select_CK0002="";
                    this.form.select_CK0003="";
                    this.form.select_CK0004="";
                    this.form.select_CK0005="";
                    this.form.select_CK0006="";
                     
                    this.form.nextFollowupDate="";//this.datepipe.transform(new Date(), 'yyyy-MM-dd');
                    this.form.save_note_id=null;
                }else{
                    this.contentLoaded=false;
                    this.rowData.next(data);
                }
            }
        });
        
    }
    ngAfterViewChecked(): void {
        if(!this.contentLoaded){
            this.rowData.pipe(take(1)).
            subscribe
            (data => {
                if(data ){
                    this.form.save_note_id
                    this.dealerId=this.data.subject.dealer_id;
                    this.dealerName=this.data.subject.dealer_name+" ("+this.data.subject.dealer_id+")";
                    this.lastCallDateTime=this.data.subject.note_creation_time;
                    this.lastCallId=this.data.subject.call_id;
                    this.form.callid=this.data.subject.call_id;
                    this.form.notes=this.data.subject.note;
                    this.form.CK0001=this.data.subject.check_non_billing_churn_id;
                    this.form.CK0002=this.data.subject.check_complaint_sr_id;
                    this.form.CK0003=this.data.subject.check_scheme_id;
                    this.form.CK0004=this.data.subject.check_outstaing_collection_id;
                    this.form.CK0005=this.data.subject.check_others_id;
                    this.form.CK0006=this.data.subject.check_order_discussion_id;
                    this.form.select_CK0001=this.data.subject.non_billing_reason_id;
                    this.form.select_CK0002=this.data.subject.complaint_sr_id;
                    this.form.select_CK0003=this.data.subject.scheme_id;
                    this.form.select_CK0004=this.data.subject.outstanding_collection_id;
                    this.form.select_CK0005=this.data.subject.others_id;
                    this.form.select_CK0006=this.data.subject.order_discussion_id;
                    this.form.nextFollowupDate=this.datepipe.transform(this.data.subject.next_followUp_date, 'yyyy-MM-dd');
            }
        });
            this.contentLoaded=true;
        }
        
    }
    getLastCallId(dealerid){
        this.lastCallId="";
        this.dealerService.getLastCallId(dealerid).subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002") {
                    this.lastCallId = rdata.resp_body.callId;
                    this.lastCallDateTime=rdata.resp_body.endTime;
                    this.form.callid=this.lastCallId;
                } else {
                    this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                }
                if(!this.lastCallId && this.lastCallId==""){
                    this.confirmDialogService.showMessage("Call not started", () => { });
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    }
    
    isAllSelected(row,e) {
        if (e.target.checked) {
            if(row=="CK0006"){
                //this.form.CK0006.isChecked=true;
            }else if(row=="CK0001"){
                //this.form.CK0001.isChecked=true;
            }
            
        }else{
            if(row=="CK0006"){
                //this.form.CK0006.isChecked=false;
            }else if(row=="CK0001"){
                //this.form.CK0001.isChecked=false;
            }
        }
    }
    saveData(){
        if(!this.form.notes || this.form.notes=="" ){
            this.confirmDialogService.showMessage("Please add note", () => { });
            return;
        }
        if(this.form.CK0007 ){
            this.savePriceCapture();
            return;
        }else{
            this.saveNote();
        }
    }
    saveNote(){
        
        if(this.form.CK0006 ){
            if(!this.form.select_CK0006 || this.form.select_CK0006==""){
                this.confirmDialogService.showMessage("Please select order discussion reason", () => { });
                return;
            }
        }
        
        if(this.form.CK0001 ){
            if(!this.form.select_CK0001 || this.form.select_CK0001==""){
                this.confirmDialogService.showMessage("Please select Non-billing reason", () => { });
                return;
            }
        }
        if(this.form.CK0002 ){
            if(!this.form.select_CK0002 || this.form.select_CK0002==""){
                this.confirmDialogService.showMessage("Please select Complaint & SR reason", () => { });
                return;
            }
        }
       
        if(this.form.CK0004 ){
            if(!this.form.select_CK0004 || this.form.select_CK0004==""){
                this.confirmDialogService.showMessage("Please select Outstanding & Collection reason", () => { });
                return;
            }
        }
        if(this.form.CK0003 ){
            if(!this.form.select_CK0003 || this.form.select_CK0003==""){
                this.confirmDialogService.showMessage("Please select Scheme", () => { });
                return;
            }
        }
        if(this.form.CK0005 ){
            if(!this.form.select_CK0005 || this.form.select_CK0005==""){
                this.confirmDialogService.showMessage("Please select Others reason", () => { });
                return;
            }
        }
        
        this.dealerService.saveNote(this.dealerId,this.form).subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002") {
                    //if(this.form.CK0007 ){
                    //     this.savePriceCapture();
                    //}else{
                        this.selectedProduct="";
                        this.selectedProductValues=[];
                        this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                        this.data.okFn();
                        this.calllogService.executeAction(true);
                    //}
                    
                } else {
                    this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                    this.data.okFn();
                    this.calllogService.executeAction(true);
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    }
    changeStartDate(event) {
        this.form.nextFollowupDate = event.value;
    }
    callPriceCaptureDlg(){
        if(this.data.mode!="edit"){
            var obj:any={};
            obj.dealerId=this.dealerId;
            obj.dealerName=this.dealerName;
            obj.note_creation_time=this.lastCallDateTime;
            obj.call_id=this.lastCallId;
            obj.productid="";
            obj.saveddate=undefined;
            if(this.selectedProduct &&this.selectedProduct!=""){
                obj.productid=this.selectedProduct;
                obj.saveddata=this.selectedProductValues;
            }
            this.priceCaptureService.showDialog("new",obj,()=>{
                this.selectedProduct=this.priceCaptureService.getSelectedProduct();
                this.selectedProductValues=this.priceCaptureService.getSavedData();
            },()=>{this.selectedProduct="";
                this.selectedProductValues=undefined;});
        }
    }
    savePriceCapture(){
        var dataArray:any=[];
        var d=this.priceCaptureService.getSavedData();
        if(!d || d.length==0){
            this.saveNote();
            return;
        }
        d.forEach(element=>{
            if(Number(element.WSP)>0 || Number(element.RSP)>0){
                var data:any={};
                data.companyName=element.Company;
                data.productName=element.Product;
                data.dealerId=this.dealerId;
                data.dealerName=this.data.subject.dealerName;
                data.dapId=this.data.subject.dapId;
                data.stockBagsQty=element.Stock;
                data.wsp=element.WSP;
                data.rsp=element.RSP;
                data.billing=element.Billing;
                data.priceDiscount=element.Discount;
                data.callId=this.lastCallId
                data.beatdate=formatDate(new Date(), 'yyyy-MM-dd', 'en-US', '+0530');
                data.visitdate=formatDate(new Date(), 'yyyy-MM-dd', 'en-US', '+0530');
                data.visittype="A"
                data.isPlanned="U"
                data.vendorType=element.DealerType;
                data.latitude=null;
                data.longitude=null
                dataArray.push(data);
            }
        });
        if(dataArray.length==0){
            this.saveNote();
            return;
        }
        
        this.dealerService.postPriceCompareData(dataArray).subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002") {
                    //this.data.okFn();
                    //this.calllogService.executeAction(true);
                    this.saveNote();
                } else {
                    this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                    //this.data.okFn();
                    //this.calllogService.executeAction(true);
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    }
}
