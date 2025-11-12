import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable() export class PopupDialogService {
    private subject = new Subject<any>();
    dealerId:string;
    dapId:string;
    showDataDialog(type:string,reporttitle:string,subtitle:string,dealerId:string,dapId :string): any {
        this.dealerId=dealerId;
        this.dapId=dapId;
        this.showDialog(type,reporttitle,subtitle,()=>{});
    }
    showDialog(type:string,reporttitle:string,subtitle:string,okFn: () => void): any {
        const that = this;
        this.subject.next({
            type: type,
            reportTitle:reporttitle,
            subTitle:subtitle,
            subject:type,
            okFn(): any {
                that.subject.next(false); // This will close the modal
            },
        });
    }
    getData(): Observable<any> {
        return this.subject.asObservable();
    }
    getDealerId(){
        return this.dealerId;
    }
    getDapId(){
        return this.dapId;
    }
}
