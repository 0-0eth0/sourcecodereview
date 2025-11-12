import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable() export class OrderStatusDialogService {
    private subject = new Subject<any>();
    public orderData;
    
    ShowOrderStatus(message:any[], yesFn: () => void, refreshFn: () => void): any {
        const that = this;
        this.subject.next({
            text: message,
            yesFn(): any {
                that.subject.next(); // This will close the modal
                yesFn();
            },
            refreshFn(): any {
                that.subject.next(); // This will close the modal
                refreshFn();
            }
        });

    }
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
    setOrderData(value) {
        this.orderData = value;
    }
    getOrderData() {
        return this.orderData;
    }
}
