import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class PlaceOrderService {
    subscription = new Subject();
    showOrder:false;
    executeAction(showOrder) {
        this.showOrder=showOrder;
        this.subscription.next();
    }
    getOrderStatus(){
        return this.showOrder;
    }
    setOrderStatus(fale){
        this.showOrder=false;
    }
}
