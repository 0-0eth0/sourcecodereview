import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable() export class CalanderDialogService {
    
    private subject = new Subject<any>();
    public selectedValues;
    
    
    setDate(message:string, yesFn: () => void, noFn: () => void): any {
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
     
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
    setSelectedValues(values) {
        this.selectedValues = values;
    }
    getSelectedValues() {
        return this.selectedValues;
    }
}
