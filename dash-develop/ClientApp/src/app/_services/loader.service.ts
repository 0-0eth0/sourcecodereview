import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
    isLoading = new BehaviorSubject<boolean>(false);
    show() {
        setTimeout(() => {
        if(!this.isLoading.getValue()){
            this.isLoading.next(true);
        }
        });
    }
    hide() {
        setTimeout(() => {
        if(this.isLoading.getValue()){
            this.isLoading.next(false);
        }
    });
    }
}
