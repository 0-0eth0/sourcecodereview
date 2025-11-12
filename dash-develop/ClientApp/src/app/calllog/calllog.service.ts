import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class CalllogService {
    subscription = new Subject();
    refreshHistory:false;
    executeAction(refresh) {
        this.refreshHistory=refresh;
        this.subscription.next();
    }
    getRefreshHistory(){
        return this.refreshHistory;
    }
    setRefreshHistory(fale){
        this.refreshHistory=false;
    }
}
