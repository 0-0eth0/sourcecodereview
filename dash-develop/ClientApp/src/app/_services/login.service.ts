import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
    isLoggedIn = new BehaviorSubject<boolean>(false);
    login() {
        setTimeout(() => {
        if(!this.isLoggedIn.getValue()){
            this.isLoggedIn.next(true);
        }
        });
    }
    logout() {
        setTimeout(() => {
        if(this.isLoggedIn.getValue()){
            this.isLoggedIn.next(false);
        }
    });
    }
}
