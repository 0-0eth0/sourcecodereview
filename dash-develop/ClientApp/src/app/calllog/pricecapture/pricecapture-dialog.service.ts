import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable() export class PriceCaptureDialogService {
    private subject = new Subject<any>();
    dealerId:string;
    dapId:string;
    saveddata:any;
    SelectedProdut:string="";
    showDialog(mode:string,data:any,okFn: () => void, noFn: () => void): any {
        const that = this;
        this.subject.next({
            mode:mode,
            subject:data,
            okFn(): any {
                that.subject.next(false); // This will close the modal
                okFn();
            },
            noFn(): any {
                that.subject.next(false); // This will close the modal
                noFn();
            },
        });
    }
    getData(): Observable<any> {
        return this.subject.asObservable();
    }
    setSavedData(Data){
        this.saveddata=Data;
    }
    getSavedData(){
        return this.saveddata;
    }
    setSeletedProduct(productid){
        this.SelectedProdut=productid;
    }
    getSelectedProduct(){
        return this.SelectedProdut;
    }
}
