import { Component,  OnInit } from '@angular/core';
import { OrderConfirmDialogService } from './orderconfirm-dialog.service';

@Component({
    selector: 'confirmorder-dialog',
    templateUrl: 'orderconfirm-dialog.component.html',
    styleUrls: ['orderconfirm-dialog.component.scss']
})


export class OrderConfirmDialogComponent implements OnInit {
    message: any;
    constructor(
        private orderConfirmDialogService: OrderConfirmDialogService
    ) {
    }

    ngOnInit(): any {

        this.orderConfirmDialogService.getMessage().subscribe(message => {
            this.message = message;
        });
    }
    
    
}
