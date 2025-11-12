import { Component, Input,OnDestroy,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DealerService } from '../_services/dealer.service';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { ShiptopartyDialogService } from './shiptoparty/shiptoparty-dialog.service';
import { L1MappingDialogService } from './l1mappings/l1mapping-dialog.service';
import { OrderConfirmDialogService } from './orderconfirm/orderconfirm-dialog.service';
import { CalanderDialogService } from './calander/calander-dialog.service';
import { OrderStatusDialogService } from './orderstatus/orderstatus-dialog.service';
import { CancelorderDialogService } from './cancel-order/cancelorder-dialog.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OrderModal, productlist, ShippedPartyList,  l1Mapping } from './order-modal';
import { DatePipe, formatDate } from '@angular/common';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';

import { PlaceOrderChild, eventSubscriber } from './placeorder-child.interface';
import { PlaceOrderService } from './placeorder.service';
import { SlimScrollOptions, SlimScrollEvent } from 'ngx-slimscroll';

@Component({
  selector: 'order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  providers: [ DatePipe ]
})

export class OrderDetailsComponent implements OnInit,PlaceOrderChild, OnDestroy{
    @Input() callNewOrder: Subject<boolean>;
    @Input() dealerCheatSheetData;
    orderDisplayData: any;
    form: any = {};
    dealerData: any = {};
    selectedDealerAddress: any = {};
    dropdownList = [];
    //dropdownSettings: NgMultiSelectDropDownModule = {};
    productsdata=[];
    selectedItems=[];
    shippingParty: any[];
    selectedShipping = [];
    //orderStage = "view";
    mappingData: any = {};
    l1MappingData: any = {};
    dealerId: string;
    orderPageId:number=1;
    orderProcessDetail: any[];
    dealerOrders: any;
    dealerOrdersOriginal: any;
    orderStage = 'view';
    limitSelection:any=2;
    seletedL1Mapping:any;
    shippingMessage:string="";
    targetAchieved=0;
    fromDetail=false;
    incoterms:any[]=[];
    selfTptMinQty=0;
    cdData:any;
    editOrderData:any;
    orderReasons:any;
    opts: SlimScrollOptions;
    orderDataAvailable=true;
    dropdownSettings:NgMultiSelectDropDownModule = {
        singleSelection: false,
        idField: 'productCode',
        textField: 'productName',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 1,
        allowSearchFilter: false,
        enableCheckAll:false,
    };
    selectedDate:any;
    selectedDateValue:string;
    selectedTime:any;
    timeSlots:any;
  constructor(
      private route: ActivatedRoute,
      private dealerService: DealerService,
      private confirmDialogService: ConfirmDialogService,
      private shiptopartyDialogService: ShiptopartyDialogService,
      private l1MappingDialogService: L1MappingDialogService,
      private orderConfirmDialogService: OrderConfirmDialogService,
      private orderStatusDialogService: OrderStatusDialogService,
      private neworderService:PlaceOrderService,
      private cancelorderDialogService:CancelorderDialogService,
      private calander:CalanderDialogService,
      private datepipe:DatePipe
  ) {
      this.executeAction = this.executeAction.bind(this);
    eventSubscriber(neworderService.subscription, this.executeAction); }
    
  executeAction() {
        this.newOrder();
    }
    
  ngOnDestroy(): void {
    this.neworderService.setOrderStatus(false);
    eventSubscriber(this.neworderService.subscription, this.executeAction, true);

}     
    ngOnInit() {
        this.opts = new SlimScrollOptions({
            position:'right',
            barWidth: "8",
            barBorderRadius:"20",
            alwaysVisible:true,
            visibleTimeout: 1000,
            alwaysPreventDefaultScroll: true
          });
        this.incoterms=[];
        this.incoterms.push({id:"FOR",value:"FOR Price"});
        this.incoterms.push({id:"EXW",value:"Ex Price"});
	    document.body.classList.remove('bg-img');
        const routeParams = this.route.snapshot.paramMap;
            const dealerIdFromRoute = routeParams.get('dealerid');
            this.dealerId = dealerIdFromRoute;
            this.getDealerData(dealerIdFromRoute);
            this.getCDData(this.dealerId);
            this.refreshView();
            this.initilizeObjectValues();
            if(this.dealerCheatSheetData){
              this.targetAchieved= 0 ;//((this.dealerCheatSheetData.mtdTarget-this.dealerCheatSheetData.salesTarget)/this.dealerCheatSheetData.mtdTarget)*100
            }
            if(this.neworderService.getOrderStatus()){
                this.newOrder();
            }

  }
  
    initilizeObjectValues() {
        this.editOrderData={};
        this.shippingMessage="";
        this.mappingData = new OrderModal();
        this.mappingData.dealerId = this.dealerId;
        this.mappingData.incoGroup = "FOR";
        this.mappingData.transType = "COMPANY";
        this.mappingData.transportType="company";
        this.mappingData.productType = "";
        this.mappingData.material = [];
        this.mappingData.shipToParty = [];
        this.mappingData.plant = "";
        this.mappingData.plantName = "";
        this.selectedItems = [];
        this.orderDisplayData="";
        this.seletedL1Mapping="";
        this.l1MappingData = new l1Mapping()
        this.l1MappingData.customerLzone = "";
        this.l1MappingData.distance = "";
        this.l1MappingData.districtCode = "";
        this.l1MappingData.ialesOrg = "";
        this.l1MappingData.incoGroup = "";
        this.l1MappingData.incoterm = "";
        this.l1MappingData.l1Level = "";
        this.l1MappingData.material = "";
        this.l1MappingData.plant = "";
        this.l1MappingData.plantDesc = "";
        this.l1MappingData.plantType = "";
        this.l1MappingData.quantity = "";
        this.l1MappingData.setId = "";
        this.l1MappingData.travelTime = "";
        this.l1MappingData.isChecked = false;
        this.l1MappingData.transportType="company";
        this.selectedDate="";
        this.selectedTime="";
        this.selectedDateValue="";
        if(this.timeSlots){
            this.timeSlots.forEach(x=>{
                x.isselected=false;
            });
        }
        
    }
    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }
    refreshOrderHistory(e){
        this.dealerOrders=[];
        if(e.target.value=="Pending"){
            this.dealerOrders=this.dealerOrdersOriginal.filter(x=>x.status.toString().toLowerCase()=='placed' || x.status.toString().toLowerCase()=='confirmed' || x.status.toString().toLowerCase()=='credit-review');
        }else {
            this.dealerOrders=this.dealerOrdersOriginal;
        }
    }
    getDealerOrder(dealerid): void {
        this.dealerService.getAllOrders(dealerid,this.orderPageId).subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002") {
                    this.dealerOrders = rdata.resp_body.allOrders;
                    this.dealerOrdersOriginal= rdata.resp_body.allOrders;
                    this.orderDataAvailable=this.dealerOrders.length>0?true:false;
                } else {
                    this.orderPageId--;
                    this.orderDataAvailable=false;
                    this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });

            }
        );
    }
    getDealerData(dealerid): void {
        this.dealerService.getdealerdata(dealerid).subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002"  || rdata.resp_code == "DM6002") {
                    this.dealerData = rdata.resp_body;
                    let address = rdata.resp_body.addressList.find(dealer => dealer.addressId === dealerid);
                    this.selectedDealerAddress = address.addressLine1 + "," + (address.addressLine2 != "" ? address.addressLine2 + "," : "");
                    this.selectedDealerAddress = this.selectedDealerAddress + address.city + "," + address.pincode;
                    this.productsdata = rdata.resp_body.productList;
                    this.productsdata.forEach(x=>{
                        x.productName=x.productCode+" - "+x.productName;
                      
                    })
                    this.shippingMessage=rdata.resp_body.message3;
                    this.selfTptMinQty=address.districtQty;
                    this.timeSlots=this.dealerData.timeSlot;
                } else {
                    this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
                
            }
        );
    }
    showOrderConfirmationDlg(): void {
        this.mappingData.deliveryDate=this.selectedDate;
        this.mappingData.deliveryTimeSlot=this.selectedTime;
        this.orderConfirmDialogService.setOrderData(this.mappingData, () => {
            this.confirmOrder();
        }, () => {

        });
    }
    confirmOrder(): void {
        let orders: any = [];
        let orderDisplayData=[];
        let dealer = this.mappingData.dealerId;
        let udf1 = this.mappingData.plant;
        let udf2 = this.mappingData.transType;
        let productCode = this.mappingData.material[0].productCode;
        let productName = this.mappingData.material[0].productName;
        let partyid = this.mappingData.shipToParty[0].partyId;
        let partyName = this.mappingData.shipToParty[0].partyName;
        let transportType=this.mappingData.transportType;
        let currentTime = formatDate(new Date(), 'yyyy-MM-dd', 'en-US', '+0530');
        let selDate=this.selectedDate;
        let selTime=this.selectedTime;
        if (this.mappingData.productType == "SINGLE") {
            this.mappingData.shipToParty.forEach(item=> {
                let mObj: any = {};
                mObj.dealerId = item.partyId;
                mObj.orderBy = dealer;
                mObj.orderDate = currentTime
                mObj.orderId =  item.orderId?item.orderId: "DBD" + Date.now()+""+this.mappingData.shipToParty.indexOf(item)+1;
                //mObj.orderId =  item.orderId?item.orderId: "";
                mObj.orderKey = "LATER";
                mObj.productCode = productCode;
                mObj.quantity = item.quantity;
                mObj.referenceId = item.partyId;
                mObj.status = "IN-PROGRESS";
                mObj.udf1 = udf1;
                mObj.udf2 = udf2;
                mObj.deliveryDate=selDate;
                mObj.deliveryTimeSlot=selTime;
                item.orderId = mObj.orderId;
                orders.push(mObj);
                let dObj:any={};
                dObj.orderId=mObj.orderId;
                dObj.orderDate=currentTime;
                dObj.productName=productName;
                dObj.quantity=item.quantity;
                dObj.dealerName=item.partyName;
                dObj.orderFrom="NA";
                dObj.udf2=udf2;
                dObj.ImageName=""
                dObj.deliveryDate=selDate;
                dObj.deliveryTimeSlot=selTime;
                const existProduct=this.productsdata.find(x=>x.productCode=productCode);
                if(existProduct){
                    dObj.ImageName=environment.apiURL +"/product_images/"+existProduct.imageName.toString().toLowerCase();
                }
                
                orderDisplayData.push(dObj);
            });
        } else {
            this.mappingData.material.forEach(item=> {
                let mObj: any = {};
                mObj.dealerId = partyid;
                mObj.orderBy = dealer;
                mObj.orderDate = currentTime
                mObj.orderId = item.orderId?item.orderId: "DBD" + Date.now()+""+this.mappingData.material.indexOf(item)+1;
                //mObj.orderId =  item.orderId?item.orderId: "";
                mObj.orderKey = "LATER";
                mObj.productCode = item.productCode;
                mObj.quantity = item.quantity;
                mObj.referenceId = partyid;
                mObj.status = "IN-PROGRESS";
                mObj.udf1 = udf1;
                mObj.udf2 = udf2;
                mObj.transportType= transportType;
                mObj.deliveryDate=selDate;
                mObj.deliveryTimeSlot=selTime;
    
                item.orderId = mObj.orderId;
                orders.push(mObj);
                let dObj:any={};
                dObj.orderId=mObj.orderId;
                dObj.orderDate=currentTime;
                dObj.productName=item.productName;
                dObj.quantity=item.quantity;
                dObj.dealerName=partyName;
                dObj.orderFrom="NA";
                dObj.udf2=udf2;
                dObj.ImageName=""
                dObj.deliveryDate=selDate;
                dObj.deliveryTimeSlot=selTime;
                const existProduct=this.productsdata.find(x=>x.productCode=productCode);
                if(existProduct){
                    dObj.ImageName=environment.apiURL+"/product_images/"+existProduct.imageName.toString().toLowerCase();
                }
                orderDisplayData.push(dObj);
            });
        }
        this.orderProcessDetail = orders;
        this.orderDisplayData=orderDisplayData;
         
        this.dealerService.submitorder(this.mappingData.dealerId, orders).subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002" || rdata.status== "DM1002") {
                    this.orderStage = "success";
                    this.refreshView();
                } else {
                    this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });

            }
        );
         
        
    }
    getTimeClass(d):boolean{
        if(this.selectedDate!="Other"){
            if(this.datepipe.transform(this.selectedDate, 'MMM,dd,yyyy')==this.datepipe.transform(new Date(), 'MMM,dd,yyyy')){
                if(!d.selected){
                    return true
                }
            }
        }
        
        return false;
    }
    selectTime(d):void{
        if(this.datepipe.transform(this.selectedDate, 'MMM,dd,yyyy')==this.datepipe.transform(new Date(), 'MMM,dd,yyyy')){
            if(!d.selected){
                this.confirmDialogService.showMessage("This time slot not available to book today", () => { });
                return;
            }
        }
        this.dealerData.timeSlot.forEach(x=>x.isselected=false);
        d.isselected=true;
        this.selectedTime=d.time;
    }
    selectDate(d):void{
        this.dealerData.timeSlot.forEach(x=>x.isselected=false);
        this.selectedTime="";
        this.selectedDateValue=d;
        if(d=='Other'){
            this.calander.setDate(this.selectedDate, () => {
                this.selectedDate=this.calander.getSelectedValues();
                if(this.dealerData.dates.indexOf(this.selectedDate)!=-1){
                    this.selectedDateValue=this.selectedDate;
                }
            },() =>{this.selectedDate="";this.selectedDateValue=""; });
        }
        this.selectedDate=d;
         
    }
    onGetMapping(): void {
        let material: any = [];
        let shiptoParty: any = [];
        let mapData: any = [];
        let selDate=this.selectedDate;
        let selTime=this.selectedTime;
        var incoGroup=this.mappingData.incoGroup;
        var transType=this.mappingData.transportType;
        var mData=this.mappingData;
        var mainDealer=this.dealerId;//mData.shipToParty.find(x=>x.isMainDealer==1).partyId
        this.mappingData.material.forEach(function (item: productlist) {
            /*let mObj: any = {};
            mObj.productName = item.productCode;
            if (item.quantity) {
                mObj.quantity = (item.quantity ? item.quantity : "");
            }
            material.push(mObj);*/
            
            mData.shipToParty.forEach(function (ship: ShippedPartyList) {
                let mObj: any = {};
                mObj.partyId = ship.partyId;
                mObj.quantity = item.quantity;
                shiptoParty.push(mObj);
                let mappObj:any={};
                mappObj.incoGroup= incoGroup;
                mappObj.productCode=item.productCode;
                if(mData.material.length==1){
                    mappObj.quantity=(ship.quantity ? ship.quantity : "");
                }else{
                    mappObj.quantity=(item.quantity ? item.quantity : "");
                }
                
                mappObj.shipToParty=ship.partyId;
                mappObj.soldToParty=mainDealer;
                mappObj.transportType=transType;
                mappObj.deliveryDate=selDate;
                mappObj.deliveryTimeSlot=selTime;

                mapData.push(mappObj);

            })
            
        })
        
        

        this.dealerService.mappingset(mapData).subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002") {
                    this.l1MappingData = rdata.resp_body.l1MappingSets;
                    if(rdata.resp_body && rdata.resp_body.isDepotShown=="Y"){
                        let mdata: any = [];
                        rdata.resp_body.l1MappingSets.forEach(function (items) {
                            if (!mdata.find(x => x.plant==items.plant)){
                                mdata.push(items);
                            }
                        });
                        this.l1MappingDialogService.setSelectedValues(this.seletedL1Mapping);
                        this.l1MappingDialogService.setShippingFromList(mdata, () => {
                            this.mappingData.plant = this.l1MappingDialogService.getSelectedValues();
                            this.mappingData.plantName = this.l1MappingDialogService.getPlantName();
                            this.showOrderConfirmationDlg();
                        }, () => {
                            this.l1MappingDialogService.setSelectedValues("");
                        });
                    }else{
                        this.mappingData.plant = "";
                        this.mappingData.plantName = "";
                        this.showSuccessScreen(rdata.resp_body);
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
    showSuccessScreen(data):void{
        if(!data){
            return;
        }
        let orders: any = [];
        let orderDisplayData=[];
        let dealer = this.mappingData.dealerId;
        let udf1 = this.mappingData.plant;
        let udf2 = this.mappingData.transType;
        let productCode = this.mappingData.material[0].productCode;
        let productName = this.mappingData.material[0].productName;
        let partyid = this.mappingData.shipToParty[0].partyId;
        let partyName = this.mappingData.shipToParty[0].partyName;
        let transportType=this.mappingData.transportType;
        let freight=0;
        let selDate=this.selectedDate;
        let selTime=this.selectedTime;
        let currentTime = formatDate(new Date(), 'yyyy-MM-dd', 'en-US', '+0530');
        if (this.mappingData.productType == "SINGLE") {
            this.mappingData.shipToParty.forEach(item=> {
                let mObj: any = {};
                mObj.dealerId = item.partyId;
                mObj.orderBy = dealer;
                mObj.orderDate = currentTime
                mObj.orderId = data.orderResponses && data.orderResponses.length>0? data.orderResponses.find(x=>x.dealerId==item.partyId).orderId:"";
                mObj.frieght = data.orderResponses && data.orderResponses.length>0? data.orderResponses.find(x=>x.dealerId==item.partyId).freight:"";
                mObj.orderKey = "LATER";
                mObj.productCode = productCode;
                mObj.quantity = item.quantity;
                mObj.referenceId = item.partyId;
                mObj.status = "IN-PROGRESS";
                mObj.udf1 = udf1;
                mObj.udf2 = udf2;
                mObj.deliveryDate=selDate;
                mObj.deliveryTimeSlot=selTime;
                item.orderId = mObj.orderId;
                orders.push(mObj);
                let dObj:any={};
                dObj.orderId=mObj.orderId;
                dObj.orderNumber=data.orderResponses && data.orderResponses.length>0? data.orderResponses.find(x=>x.dealerId==item.partyId).orderNumber:"";
                dObj.orderDate=currentTime;
                dObj.productName=productName;
                dObj.quantity=item.quantity;
                dObj.dealerName=item.partyName;
                dObj.orderFrom="NA";
                dObj.udf2=udf2;
                dObj.ImageName=""
                dObj.deliveryDate=selDate;
                dObj.deliveryTimeSlot=selTime;
                const existProduct=this.productsdata.find(x=>x.productCode=productCode);
                if(existProduct){
                    dObj.ImageName=environment.apiURL +"/product_images/"+existProduct.imageName.toString().toLowerCase();
                }
                freight=freight+Number(mObj.frieght);
                orderDisplayData.push(dObj);
            });
        } else {
            this.mappingData.material.forEach(item=> {
                let mObj: any = {};
                mObj.dealerId = partyid;
                mObj.orderBy = dealer;
                mObj.orderDate = currentTime
                mObj.orderId = data.orderResponses && data.orderResponses.length>0?data.orderResponses.find(x=>x.dealerId==item.partyId).orderId:"";
                mObj.frieght = data.orderResponses && data.orderResponses.length>0?data.orderResponses.find(x=>x.dealerId==item.partyId).freight:"";
                //mObj.orderId =  item.orderId?item.orderId: "";
                mObj.orderKey = "LATER";
                mObj.productCode = item.productCode;
                mObj.quantity = item.quantity;
                mObj.referenceId = partyid;
                mObj.status = "IN-PROGRESS";
                mObj.udf1 = udf1;
                mObj.udf2 = udf2;
                mObj.transportType= transportType;
                mObj.deliveryDate=selDate;
                mObj.deliveryTimeSlot=selTime;
                item.orderId = mObj.orderId;
                orders.push(mObj);
                let dObj:any={};
                dObj.orderId=mObj.orderId;
                dObj.orderNumber=data.orderResponses && data.orderResponses.length>0?data.orderResponses.find(x=>x.dealerId==item.partyId).orderNumber:"";
                dObj.orderDate=currentTime;
                dObj.productName=item.productName;
                dObj.quantity=item.quantity;
                dObj.dealerName=partyName;
                dObj.orderFrom="NA";
                dObj.udf2=udf2;
                dObj.ImageName=""
                dObj.deliveryDate=selDate;
                dObj.deliveryTimeSlot=selTime;
                const existProduct=this.productsdata.find(x=>x.productCode=productCode);
                if(existProduct){
                    dObj.ImageName=environment.apiURL+"/product_images/"+existProduct.imageName.toString().toLowerCase();
                }
                freight=freight+Number(mObj.frieght);
                orderDisplayData.push(dObj);
            });
        }
        this.orderProcessDetail = orders;
        this.orderDisplayData=orderDisplayData;
         
        this.mappingData.plantName=data.orderResponses && data.orderResponses.length>0?data.orderResponses[0].plantName:"";
        this.mappingData.freight=freight;
        this.orderStage = "success";
        this.refreshView();
    }
    removeCurrentItem(type,material): void {
        if (type =="product") {
            const isExist = this.mappingData.material.find(x => x.productCode == material.productCode);
            if (isExist) {
                this.mappingData.material.splice(this.mappingData.material.indexOf(isExist), 1);
            }
            const isExist1 = this.selectedItems.find(x => x.productCode == material.productCode);
            if (isExist1) {
                this.selectedItems.splice(this.selectedItems.indexOf(isExist1),1);
                const tempSelected=this.selectedItems;
                this.selectedItems=[];
                setTimeout(() => {
                    this.selectedItems=tempSelected;
                }, 500);
            }
        }else {
            const isPartyExist = this.mappingData.shipToParty.find(x => x.partyId == material.partyId);
            if (isPartyExist) {
                this.mappingData.shipToParty.splice(this.mappingData.shipToParty.indexOf(isPartyExist),1);
                if (this.shippingParty.find(x => x.partyId == material.partyId)) {
                    this.shippingParty.find(x => x.partyId == material.partyId).isChecked = false;
                }
            }
        }
        setTimeout(() => {
        if(this.mappingData.shipToParty.length==0 && this.selectedItems.length==1){
                    this.selectedItems =[];
                    this.mappingData.material=[];
                }
                }, 500);
        
        this.mappingData.productType = this.mappingData.material.length > 1 ? "MULTIPLE":"SINGLE" ;
        this.shiptopartyDialogService.setSelectedValues(this.mappingData.shipToParty);
        //this.shiptopartyDialogService.setNoofShipingParty((this.mappingData.material.length == 1 ? 3 : 1));
        
    }
    
    validateQtyandSubmit(): void {
        let isEmptyQty = false;
        let isQuantityError=false;
        let errorItemName=""
        var sumofQty=0;
        if (this.mappingData.productType == "SINGLE") {
            this.mappingData.shipToParty.forEach(function (item: ShippedPartyList) {
                if (!isEmptyQty) {
                    if (item.quantity == null || item.quantity == undefined || item.quantity == "" || item.quantity == "0") {
                        isEmptyQty = true;
                        return;
                    }
                    if(((Number(item.quantity)*100.0)%5)>0){
                        isQuantityError=true;
                        errorItemName=item.partyName;
                        return;
                    }
                }
                sumofQty=sumofQty+Number(item.quantity);
            })
        } else {
            this.mappingData.material.forEach(function (item: productlist) {
                if (!isEmptyQty) {
                    if (item.quantity == null || item.quantity == undefined || item.quantity == "" || item.quantity == "0") {
                        isEmptyQty = true;
                        return;
                    }
                    if(((Number(item.quantity)*100.0)%5)>0){
                        isQuantityError=true;
                        errorItemName=item.productName;
                        return;
                    }
                }
                sumofQty=sumofQty+Number(item.quantity);
            })
        }
        if (isEmptyQty) {
            this.confirmDialogService.showMessage("Please enter quantity", () => { });
            return;
        }
        if(isQuantityError){
            this.confirmDialogService.showMessage("Please enter quantity in multiples of 0.05 ton for "+errorItemName, () => { });
            return;
        }
        var stockValidation=false;
        if (this.mappingData.productType == "SINGLE" && this.mappingData.shipToParty.length==1) {
                stockValidation=true;
        }
        if(!stockValidation){
            if(this.mappingData.transType=="COMPANY" && this.dealerData.minimumQuantityList!= null){
                if( this.dealerData.minimumQuantityList.indexOf(sumofQty+"")==-1){
                    let d="";
                    this.dealerData.minimumQuantityList.forEach(element => {
                        d=d+"/"+element;
                    });
                    this.confirmDialogService.showMessage("Order quantity should be "+d+" MT", () => { });
                    return;
                }
            }else{
                if(sumofQty<Number(this.selfTptMinQty)){
                    this.confirmDialogService.showMessage("Order quantity should be "+this.selfTptMinQty+" MT", () => { });
                    return;
                }
            }
        }
        if(!this.selectedDate && this.mappingData.transType=='COMPANY'){
            this.confirmDialogService.showMessage("Select delivery date", () => { });
            return;
        }
        if(!this.selectedTime  && this.mappingData.transType=='COMPANY'){
            this.confirmDialogService.showMessage("Select delivery time slot", () => { });
            return;
        }
        /*if(this.datepipe.transform(this.selectedDate, 'MMM,dd,yyyy')==this.datepipe.transform(new Date(), 'MMM,dd,yyyy')) {
            let currenttime= new Date().getHours()+6;
            let startTime= this.selectedTime.split('to')[0];
            let endTime= this.selectedTime.split('to')[1];
            let minTime=0;
            let maxTime=0;
            if(startTime.indexOf("am")!=-1){
                minTime=Number(startTime.replace("am",""));
            }
            if(startTime.indexOf("pm")!=-1){
                minTime=Number(startTime.replace("pm",""))+12;
            }
            if(endTime.indexOf("am")!=-1){
                maxTime=Number(endTime.replace("am",""));
            }
            if(endTime.indexOf("pm")!=-1){
                maxTime=Number(endTime.replace("pm",""))+12;
            }
            if(currenttime>minTime && currenttime<maxTime){

            }else{
                this.confirmDialogService.showMessage("Select another delivery time slot after 6 hours from current time", () => { });
                return;
            }
        }*/
        this.onGetMapping();
    }
    selectPartylist(): void {
        
        if (this.mappingData.material && this.mappingData.material.length == 0) {
            this.confirmDialogService.showMessage("Please select product", () => { });
            return;
        }
        this.shippingParty = [];
        this.dealerData.dealerList.forEach(rdata => {
            let address = this.dealerData.addressList.find(dealer => dealer.addressId === rdata.dealerId);
            this.shippingParty.push({
                dapId: rdata.dapId,
                partyId: rdata.dealerId,
                isChecked: (this.orderStage == "edit")? (this.editOrderData.dealerId==rdata.dealerId?true:false) : false,
                address: address.city,//rdata.resp_body.address[i].city,
                isSelected: true,
                partyName: address.addressLine1,//rdata.resp_body.address[i].addressLine1,
                quantity: "",//rdata.resp_body.address[i].districtQty,
                region: address.district,//rdata.resp_body.address[i].district,
                isDisabled:false,
                isMainDealer:1
            });
        });
        this.shiptopartyDialogService.setNoofShipingParty(this.mappingData.material.length > 1?1:3);
        //this.shiptopartyDialogService.setNoofShipingParty(1);
        this.shiptopartyDialogService.setProductType(this.mappingData.material.length > 1 ? "MULTIPLE" : "SINGLE" );
        this.shiptopartyDialogService.setPreviousList(this.mappingData.shipToParty);
        this.shiptopartyDialogService.setPartyList(this.shippingParty, () => {
            this.mappingData.shipToParty = this.shiptopartyDialogService.getSelectedValues();
            if(this.orderStage == "edit"){
                var sParty=this.mappingData.shipToParty.find(x=>x.partyId==this.editOrderData.dealerId);
                if(sParty){
                    sParty.quantity=this.editOrderData.quantity;
                    sParty.orderId=this.editOrderData.orderId;
                } else if(this.mappingData.shipToParty.length>0){
                    this.mappingData.shipToParty[0].quantity=this.editOrderData.quantity;
                    this.mappingData.shipToParty[0].orderId=this.editOrderData.orderId;
                }
            }
            this.mappingData.productType = this.mappingData.material.length > 1 ? "MULTIPLE" : "SINGLE"  ;
            this.shippingMessage=this.shiptopartyDialogService.getShipmentMessage()?this.shiptopartyDialogService.getShipmentMessage():this.shippingMessage;
        }, () => {
            
        });
    }
    showSubDealerList(selectedDealer){
        this.dealerService.getShipToPartyDetailsByTzone(selectedDealer).subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002") {
                    this.shippingMessage=rdata.resp_body.message1
                    for (var i = 0; i < rdata.resp_body.address.length; i++) {
                        //let address = this.dealerData.addressList.find(dealer => dealer.addressId === this.dealerData.dealerList[i].dealerId);
                        this.shippingParty.push({
                            dapId: rdata.resp_body.address[i].dapId,
                            partyId: rdata.resp_body.address[i].addressId,
                            isChecked: false,
                            address: rdata.resp_body.address[i].city,
                            isSelected: true,
                            partyName: rdata.resp_body.address[i].addressLine1,
                            quantity: "",//rdata.resp_body.address[i].districtQty,
                            region: rdata.resp_body.address[i].district,
                            isDisabled:false,
                            isMainDealer:0
                        });
                    }
                    this.shiptopartyDialogService.setNoofShipingParty(this.mappingData.material.length > 1?1:rdata.resp_body.message2);

                    this.shiptopartyDialogService.setPartyList(this.shippingParty, () => {
                        this.mappingData.shipToParty = this.shiptopartyDialogService.getSelectedValues();
                        this.mappingData.productType = this.mappingData.material.length > 1 ? "MULTIPLE" : "SINGLE"  ;
                    }, () => {
                        
                    });
                } else {
                    //this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    }
    refreshProductSelection(): void {
        this.mappingData.productType = this.mappingData.material.length > 1 ? "MULTIPLE" : "SINGLE" ;
        this.shiptopartyDialogService.setSelectedValues([]);
        this.mappingData.shipToParty = this.shiptopartyDialogService.getSelectedValues();
        if(this.shippingParty && this.shippingParty.length>0){
            this.shippingParty.forEach(function (items: any) { items.isChecked = false; });
        }
        this.shippingMessage=this.dealerData.message3;
        //this.shiptopartyDialogService.setNoofShipingParty((this.mappingData.material.length == 1 ? 3 : 1));
    }
    onItemSelect(item: any) {
        const allowAdd =  (this.limitSelection > 0 && this.selectedItems.length <= this.limitSelection);
        if(!allowAdd){
            this.confirmDialogService.showMessage("You can select only "+this.limitSelection+" Product",()=>{});
            this.onDeSelect(item);
            return;
        }
        //this.selectedItems.push(item)
        this.mappingData.material.push(item);
        this.refreshProductSelection();
        
    }
    onDeSelect(item: any) {
        const index = this.mappingData.material.find(x => x.productCode == item.productCode);
        if (index) {
            this.mappingData.material.splice(this.mappingData.material.indexOf(index), 1);
            this.refreshProductSelection();
        }
        const index1 = this.selectedItems.find(x => x.productCode == item.productCode);
        if (index1) {
            this.selectedItems.splice(this.selectedItems.indexOf(index1), 1);
            const tempSelected=this.selectedItems;
            this.selectedItems=[];
            setTimeout(() => {
                this.selectedItems=tempSelected;
            }, 500);
        }
    }
    onSelectAll(items: any) {
        this.mappingData.material = items;
        //this.selectedItems = items;

        //this.mappingData.material.push(items);
        //this.selectedItems.push(items);
        this.refreshProductSelection();
    }
    onDeSelectAll(items: any) {
        this.mappingData.material = [];
        //this.selectedItems = [];
        this.refreshProductSelection();
    }
    onDropDownClose() {
        //console.log('dropdown closed');
    }
    selectChangeHandler(type, e) {

        if (type == 'transtype') {
            this.mappingData.transType = e.target.value;
            this.mappingData.transportType=e.target.value.toLowerCase();
            if(this.mappingData.transType=="COMPANY"){
                this.incoterms=[];
                this.incoterms.push({id:"FOR",value:"FOR Price"});
                this.mappingData.incoGroup = "FOR";
            }else{
                this.incoterms=[];
                this.incoterms.push({id:"FOR",value:"FOR Price"});
                this.incoterms.push({id:"EXW",value:"Ex Price"});
            }
        } else {
            this.mappingData.incoGroup = e.target.value;
        }
    }
    
    newOrder() {
        this.orderStage = "new";
        
        this.initilizeObjectValues();
    }
    
    ProductSelectionChange($event) {
        //this.selectedItems = $event;
    }
    
    trackOrder() {
        this.dealerService.getOrderStatus(this.orderDisplayData[0].orderId,"","","","").subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002") {
                    let orderStatusData: any = {};
                    orderStatusData.statusdata = rdata.resp_body;
                    orderStatusData.orderdata = this.orderDisplayData[0];
                    
                    orderStatusData.orderdata.orderFrom=orderStatusData.statusdata[0].sourceName;
                    if(!orderStatusData.orderdata.orderNumber){
                        orderStatusData.orderdata.orderNumber=orderStatusData.statusdata[0].orderNo;
                    }
                    
                    /* as per amit request on 24th march 22 sub Need request body correction of editCancleOrder api*/
                    //orderStatusData.orderdata.orderId=this.orderDisplayData[0].orderNumber;
                    //orderStatusData.orderdata.orderNumber=this.orderDisplayData[0].orderId;
                    //orderStatusData.orderdata.orderNumber=orderStatusData.statusdata[0].orderId;
                    //this.orderStatusDialogService.setOrderData(orderdata);
                    this.orderStatusDialogService.ShowOrderStatus(orderStatusData, () => {
                         
                    },() =>{this.getDealerOrder(this.dealerId);});
                } else {
                    this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    }
    trackOrderFromList(orderdata) {
        this.dealerService.getOrderStatus(orderdata.orderId, orderdata.orderNumber, orderdata.status, orderdata.creationTime, orderdata.orderReceiveDateTime).subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002") {
                    let orderStatusData :any= {};
                    orderStatusData.statusdata = rdata.resp_body;
                    orderStatusData.orderdata = orderdata;
                    orderStatusData.orderdata.orderFrom=orderStatusData.statusdata[0].sourceName;
                    orderStatusData.orderdata.orderId=orderStatusData.statusdata[0].orderId;
                    orderStatusData.orderdata.orderNumber=orderStatusData.statusdata[0].orderNo;
                    const existProduct=this.productsdata.find(x=>x.productCode=orderdata.productCode);
                    if(existProduct){
                        orderStatusData.orderdata.ImageName=environment.apiURL+"/product_images/"+existProduct.imageName.toString().toLowerCase();
                    }
                    this.orderStatusDialogService.ShowOrderStatus(orderStatusData, () => {
                        
                    },() =>{this.getDealerOrder(this.dealerId);});
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
    editOrder(data) {
        if(this.calculateDiff(data.orderDate)>8){
            this.confirmDialogService.showMessage("Time Expired", () => { });
            //return;
        }

        var orderdata:any={};
        orderdata.ImageName="";
        orderdata.creationTime=data.creationTime;
        orderdata.dealerId=data.dealerId;
        orderdata.dealerName=data.dealerName;
        orderdata.orderBy=data.orderBy;
        orderdata.orderBySubDealerTag="";
        orderdata.orderDate=data.orderDate;
        orderdata.orderFrom=data.orderFrom;
        orderdata.orderId=data.orderId;
        orderdata.orderKey=data.orderKey;
        orderdata.orderNumber=data.orderNumber;
        orderdata.orderReceiveDateTime=data.orderReceiveDateTime;
        orderdata.productCode=data.productCode;
        orderdata.productName=data.productName;
        orderdata.quantity=data.quantity;
        orderdata.requestedQuantity=data.requestedQuantity;
        orderdata.status=data.status;
        orderdata.udf1=data.udf1;
        orderdata.udf2=data.udf2;
        var editData:any={};
        editData.orderdata=orderdata;

        this.cancelorderDialogService.setCancelOrderList("EDIT",editData,()=>{
            this.getDealerOrder(this.dealerId);
        },()=>{});
        /*this.initilizeObjectValues();
        this.editOrderData=orderdata;
        this.orderStage = "edit";
        this.mappingData = new OrderModal();
        this.mappingData.dealerId = this.dealerId;
        this.mappingData.incoGroup = "FOR";
        this.mappingData.transType = orderdata.udf2;
        this.mappingData.productType = "SINGLE";
        this.mappingData.material = [];
        this.mappingData.shipToParty = [];
        this.mappingData.plant = "";
        this.mappingData.plantName = "";
        this.mappingData.transportType=orderdata.udf2.toLowerCase();
        let obj:any={};
        obj.productName=orderdata.productName;
        obj.productCode=orderdata.productCode;
        obj.quantity=orderdata.quantity;
        obj.orderId=orderdata.orderId;
        this.mappingData.material.push(obj);
        
        let address = this.dealerData.addressList.find(dealer => dealer.addressId === orderdata.dealerId);

        let party:any={};
        party.dapId="";
        party.partyId=orderdata.dealerId;
        party.address="";
        party.isSelected=true;
        party.isChecked=true;
        party.partyName=orderdata.dealerName;
        party.quantity=orderdata.quantity;
        party.region="";
        party.orderId=orderdata.orderId;
        party.address=address?address.city:"";
        this.mappingData.shipToParty.push(party);
        
        var pObj:any={};
        pObj.imageName="";
        pObj.isChanged=false;
        pObj.productCode=orderdata.productCode;
        pObj.productName=orderdata.productName;
        this.selectedItems.push(pObj);
        this.orderDisplayData="";
        this.seletedL1Mapping=orderdata.udf1;
        this.l1MappingData = new l1Mapping()
        this.l1MappingData.customerLzone = "";
        this.l1MappingData.distance = "";
        this.l1MappingData.districtCode = "";
        this.l1MappingData.ialesOrg = "";
        this.l1MappingData.incoGroup = "";
        this.l1MappingData.incoterm = "";
        this.l1MappingData.l1Level = "";
        this.l1MappingData.material = "";
        this.l1MappingData.plant = "";
        this.l1MappingData.plantDesc = "";
        this.l1MappingData.plantType = "";
        this.l1MappingData.quantity = "";
        this.l1MappingData.setId = "";
        this.l1MappingData.travelTime = "";
        this.l1MappingData.isChecked = false;
        */
    }
    viewOrder(){
      this.orderStage = "view";
    }
    refreshView() {
        this.orderPageId=1;
        this.shippingMessage="";
        this.editOrderData={};
        this.getDealerOrder(this.dealerId);
    }
    movePrevious(){
        this.orderPageId--;
        this.getDealerOrder(this.dealerId);
    }
    moveNext(){
        this.orderPageId++;
        this.getDealerOrder(this.dealerId);
    }
    getCDData(dealerid){
        this.dealerService.getCDData(dealerid).subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002") {
                    this.cdData=rdata.cdData;
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    }
    
    
}
