import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable() export class ShiptopartyDialogService{
    
    private subject = new Subject<any>();
    public selectedValues;
    public noofShippingParty;
    public shipmentmessage;
    public productType;
    public isSubDealer;
    private previousParty=[];
    
    setPartyList(message:any[], yesFn: () => void, noFn: () => void): any {
        const that = this;
        this.subject.next({
            text: message,
            yesFn(): any {
                that.subject.next(); // This will close the modal
                yesFn();
            },
            noFn(): any {
                that.subject.next();
                noFn();
            }
        });

    }
    getPartyList(): Observable<any> {
        return this.subject.asObservable();
    }
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
    setSelectedValues(values) {
        this.selectedValues = values;
    }
    getSelectedValues() {
        return this.selectedValues;
    }
    setNoofShipingParty(values) {
        this.noofShippingParty = values;
    }
    getNoofShipingParty() {
        return this.noofShippingParty;
    }
    setShipmentMessage(values){this.shipmentmessage=values;}
    getShipmentMessage(){return this.shipmentmessage;}
    setProductType(values){this.productType=values;}
    getProductType(){return this.productType;}
    setIsSubdealer(values){this.isSubDealer=values;}
    getIsSubdealer(){return this.isSubDealer;}
    setPreviousList(values){this.previousParty=values;}
    getPreviousList(){return this.previousParty;}
}
