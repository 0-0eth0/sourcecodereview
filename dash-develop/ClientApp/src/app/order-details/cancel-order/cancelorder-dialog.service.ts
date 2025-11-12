import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable() export class CancelorderDialogService  {
    private subject = new Subject<any>();
    public selectedValues;
    public actionType;
    setCancelOrderList(type:string,message:any[], yesFn: () => void, noFn: () => void): any {
        const that = this;
        this.actionType=type;
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
    getCancelOrderList(): Observable<any> {
        return this.subject.asObservable();
    }
    getActionType(){
        return this.actionType;
    }
    getSelectedValues(){
        return this.selectedValues;
    }
    setSelectedValues(values){
        this.selectedValues=values;
    }
}
