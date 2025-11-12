import { Component, Input, OnInit,AfterViewChecked, OnDestroy, HostListener} from '@angular/core';
import { PriceCaptureDialogService } from './pricecapture-dialog.service';
import { DealerService } from '../../_services/dealer.service';
import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';
import {  Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { DatePipe } from '@angular/common'


@Component({
    selector: 'pricecapture-dialog',
    templateUrl: 'pricecapture-dialog.component.html',
    styleUrls: ['pricecapture-dialog.component.scss'],
    providers: [DatePipe]
})
export class PriceCaptureDialogComponent implements OnInit,AfterViewChecked,OnDestroy {
    @Input() formData;
    regexStr = '^[0-9]*$';
    form: any = {};
    dealerId:string;
    dealerName:string;
    dapId:string;
    data: any;
    lastCallId:string;
    lastCallDateTime:string;
    public rowData=new Subject<boolean>();
    pccontentLoaded:boolean=false;
    priceCaptureData:any;
    priceCompareData:any;
    dealerExclusive:boolean=false;
    mainProducts:any;
    selectedIndex:number=0;
    priceComparisionData:any;
    priceComparisionDispData:any;
    selectedMainProduct:string="";
    previousProduct:string=""
    showDealearValidationMsg:boolean=false;
    constructor(
        private confirmDialogService: ConfirmDialogService,
        private dealerService: DealerService,
        private pricecaptureDialogService: PriceCaptureDialogService,
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
        this.pccontentLoaded=false;
        this.showDealearValidationMsg=false;
        this.pricecaptureDialogService.getData().subscribe(data => {
            this.data = data;
            if(data){
                this.dealerId=this.data.subject.dealerId;
                this.dealerName=this.data.subject.dealerName ;
                this.lastCallDateTime=this.data.subject.note_creation_time;
                this.lastCallId=this.data.subject.call_id;
                this.previousProduct="";
                if(this.data.subject.productid) {
                    this.previousProduct=this.data.subject.productid;
                }
                //this.getNoteFormData();
                if(data.mode=="new"){
                    this.dealerExclusive=false;
                     this.getPriceCapture(this.dealerId);
                }else{
                    this.pccontentLoaded=false;
                    this.rowData.next(data);
                }
            }
        });
        
    }
    ngAfterViewChecked(): void {

        if(!this.pccontentLoaded){
            this.rowData.pipe(take(1)).
            subscribe
            (data => {
                if(data ){
                    this.dealerId=this.data.subject.dealer_id;
                    this.dealerName=this.data.subject.dealer_name+" ("+this.data.subject.dealer_id+")";
                    this.lastCallDateTime=this.data.subject.note_creation_time;
                    this.lastCallId=this.data.subject.call_id;
            }
            this.pccontentLoaded=true;
        });
            
        }
        
    }
    selectProduct(idx){
        this.selectedIndex=idx;
        this.selectedMainProduct=this.mainProducts[idx].productCode;
 
        this.priceComparisionData.forEach(element => {
            if(element.mainProduct ==this.selectedMainProduct){
                 
                    
                    element.showProduct=1;
                 
            }else{
                element.showProduct=0;
            }
             
         });
          
    }
    getPriceCapture(dealerid){
        this.priceComparisionData=[];
         this.dealerService.getPriceCapture(dealerid).subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002") {
                    var selectedIndex=0;
                    this.priceCaptureData = rdata.resp_body 
                     this.mainProducts=[];
                     var index=0;
                     this.priceCaptureData.forEach(element => {
                        this.mainProducts.push(element.mainProduct);
                        if(this.previousProduct!="" && this.previousProduct==element.mainProduct.productCode){
                            selectedIndex=index;
                        }
                        index++;
                         
                        var data:any={};
                            data.mainProduct=element.mainProduct.productCode;
                            data.ProductCode=element.mainProduct.productCode;
                            data.Company=element.mainProduct.companyName;
                            data.Product=element.mainProduct.productName;
                            data.DealerType="";
                            data.Stock="";
                            data.WSP="";
                            data.RSP="";
                            data.Billing="";
                            data.Discount="";
                            data.ShowRow=1;
                            data.isError=false;
                            data.showProduct=true;
                            this.priceComparisionData.push(data);
                            element.childProductList.forEach(child => {
                                var data:any={};
                                data.mainProduct=element.mainProduct.productCode;
                                data.ProductCode=child.productCode
                                data.Company=child.companyName;
                                data.Product=child.productName;
                                data.DealerType="";
                                data.Stock="";
                                data.WSP="";
                                data.RSP="";
                                data.Billing="";
                                data.Discount="";
                                data.ShowRow=1;
                                data.isError=false;
                                data.showProduct=true;
                                this.priceComparisionData.push(data);
                            });

                     });
                     this.priceComparisionData.forEach(element => {
                         
                            var previousVal=this.data.subject.saveddata?this.data.subject.saveddata.find(x=>x.ProductCode==element.ProductCode && x.mainProduct==element.mainProduct):null;
                                if(previousVal){
                                    element.DealerType=previousVal.DealerType;
                                    element.Stock=previousVal.Stock;
                                    element.WSP=previousVal.WSP;
                                    element.RSP=previousVal.RSP;
                                    element.Billing=previousVal.Billing;
                                    element.Discount=previousVal.Discount;
                                }
                             
 
                         
                     });
                     selectedIndex=0;
                     this.selectProduct(selectedIndex);
                } else {
                    this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                }
                 
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    }
     
   validateData(closewindow){
       var res=true;
       this.showDealearValidationMsg=false;
       this.priceComparisionData.forEach(element => {
           element.isError=false;
           if(element.ShowRow==1){
               if(Number(element.RSP)>0 || Number(element.WSP)>0)
               {
                   if(element.DealerType==""){
                    res=false;
                    //this.confirmDialogService.showMessage("Dealer/Sub-Dealer selection is mandatory if WSP or RSP is captured", () => { });
                    element.isError=true;
                    this.showDealearValidationMsg=true;
                   }
               }
           }
       });
        
       if(res && closewindow){
            this.pricecaptureDialogService.setSeletedProduct(this.selectedMainProduct);
            this.pricecaptureDialogService.setSavedData(this.priceComparisionData);
            this.data.okFn();
       }
   }
   updateDealerExclusive(){
       var i=0;
        this.priceComparisionData.forEach(element => {
            if(element.Company.toLowerCase()=="dalmia"){
                element.ShowRow=1;
            }else{
                element.ShowRow=this.dealerExclusive?0:1;
            }
            i++;
        });
    }
    @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
        e.preventDefault();
      }
      @HostListener('keydown', ['$event']) onKeyDown(event: { stopPropagation: () => void; }) {
          let e = <KeyboardEvent> event;
           
              if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
              // Allow: Ctrl+A
              (e.keyCode == 65 && e.ctrlKey === true) ||
              // Allow: Ctrl+C
              //(e.keyCode == 67 && e.ctrlKey === true) ||
              // Allow: Ctrl+V
              (e.keyCode == 86 && e.ctrlKey === true) ||
              // Allow: Ctrl+X
              (e.keyCode == 88 && e.ctrlKey === true) ||
              // Allow: home, end, left, right
              (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
              }
            let ch = String.fromCharCode(e.keyCode);
            let regEx =  new RegExp(this.regexStr);    
            if(regEx.test(ch) || (e.keyCode>=96 && e.keyCode<=105))
              return;
            else
               e.preventDefault();
             
        }
}
