import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable() export class CalllogDialogService {
    private subject = new Subject<any>();
    dealerId:string;
    dapId:string;
   
    showDialog(mode:string,data:any,okFn: () => void, noFn: () => void): any {
        const that = this;
        this.subject.next({
            mode:mode,
            subject:data,
            okFn(): any {
                that.subject.next(false); // This will close the modal
            },
            noFn(): any {
                that.subject.next(false); // This will close the modal
            },
        });
    }
    getData(): Observable<any> {
        return this.subject.asObservable();
    }
}
