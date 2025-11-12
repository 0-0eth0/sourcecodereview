import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable() export class ConfirmDialogService {
    private subject = new Subject<any>();
    
    showMessage(message: string, okFn: () => void): any {
        this.showMessageDialog(message, okFn);
    }
    showMessageDialog(message: string, okFn: () => void): any {
        const that = this;
        this.subject.next({
            type: 'alert',
            text: message,
            okFn(): any {
                that.subject.next(); // This will close the modal
            },
        });

    }

    confirmThis(type:string,message: string, yesFn: () => void, noFn: () => void): any {
        this.setConfirmation(type,message, yesFn, noFn);
    }

    setConfirmation(type :string,message: string, yesFn: () => void, noFn: () => void): any {
        const that = this;
        this.subject.next({
            type: type,
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
}
