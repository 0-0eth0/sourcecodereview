import { Component,  OnInit } from '@angular/core';
import { ShiptopartyDialogService } from './shiptoparty-dialog.service';
import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';
import { DealerService } from '../../_services/dealer.service';

@Component({
    selector: 'party-list-dialog',
    templateUrl: 'shiptoparty-dialog.component.html',
    // styleUrls: ['shiptoparty-dialog.component.scss']
})


export class ShiptopartyDialogComponent implements OnInit {
    previousList:any;
    message: any;
    selectedShipping: any;
    form: any = {}
    noofshipment: any = 1;
    row: any;
    selectedParty: any = [];
    shippingParty:any=[];
    masterSelected: boolean;
    checklist: any;
    checkedList: any;
    tmpDealerList=[];
    previousPartyList=[];
    constructor(
        private dealerService: DealerService,
        private shiptopartyDialogService: ShiptopartyDialogService,
        private confirmDialogService: ConfirmDialogService
    ) {
        this.masterSelected = false;
        
    }

    ngOnInit(): any {

        this.shiptopartyDialogService.getMessage().subscribe(message => {
            this.message = message;
            this.shiptopartyDialogService.setIsSubdealer(false);
            if(this.message){
                this.tmpDealerList=this.message.text;
                this.previousPartyList=this.shiptopartyDialogService.getPreviousList();
                if(this.previousPartyList && this.previousPartyList.length>0){
                    this.message.text=this.previousPartyList;
                }
            }
        });
    }
    
    isAllSelected(row,e) {
        if (this.shiptopartyDialogService.getSelectedValues()) {
            if (e.target.checked) {
                if (this.shiptopartyDialogService.getSelectedValues().length >= this.shiptopartyDialogService.getNoofShipingParty()) {
                    this.confirmDialogService.showMessage("You can select only " + this.shiptopartyDialogService.getNoofShipingParty() + " Party", () => { });
                    const rowExist = this.message.text.find(x => x.partyId == row.partyId);
                    if (rowExist) {
                        this.message.text.find(x => x.partyId == row.partyId).isChecked = false;
                        e.target.checked = false;
                        this.getCheckedItemList();
                    }
                    return;
                }
                if(!this.shiptopartyDialogService.getIsSubdealer() && this.shiptopartyDialogService.getProductType()=="SINGLE"){
                    this.showSubDealerList(row.partyId,row);
                }
            }
        }
        this.masterSelected = this.message.text.every(function (item: any) {
            return item.isChecked == true;
        })
        this.getCheckedItemList();
    }
    clearAll() {
        this.shiptopartyDialogService.setIsSubdealer(false);
        this.message.text=this.tmpDealerList;
        this.message.text.forEach(function (item: any) {
            item.isChecked = false;
        });
        this.getCheckedItemList();
    }
    getCheckedItemList() {
        this.checkedList = [];
        for (var i = 0; i < this.message.text.length; i++) {
            if (this.message.text[i].isChecked)
                this.checkedList.push(this.message.text[i]);
        }
        this.shiptopartyDialogService.setSelectedValues(this.checkedList)
    }
    showSubDealerList(selectedDealer,sdata){
        this.shiptopartyDialogService.setIsSubdealer(true);
        this.shippingParty=[];

        this.shippingParty.push({
            dapId: sdata.dapId,
            partyId: sdata.partyId,
            isChecked: true,
            address: sdata.address,
            isSelected: true,
            partyName: sdata.partyName,
            quantity: "",//rdata.resp_body.address[i].districtQty,
            region: sdata.region,
            isDisabled:true,
            isMainDealer:1
        });
        this.dealerService.getShipToPartyDetailsByTzone(selectedDealer).subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002") {
                    this.shiptopartyDialogService.setShipmentMessage(rdata.resp_body.message1);
                    for (var i = 0; i < rdata.resp_body.address.length; i++) {
                        if(!this.shippingParty.find(x=>x.partyId==rdata.resp_body.address[i].addressId)){
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
                    }
                   this.shiptopartyDialogService.setNoofShipingParty(rdata.resp_body.message2);

                    //this.shiptopartyDialogService.updatePartyList(this.shippingParty);
                    this.message.text=this.shippingParty;
                } else {
                    //this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    }
    
}
