import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {PopupDialogComponent} from './popup-dialog.component';
import {PopupDialogService} from './popup-dialog.service';
import { ChartsModule } from 'ng2-charts';
import { SalesTrendComponent } from './sales-trend/sales-trend';
import { AnalyticsComponent } from './analytics/analytics.component';
import { QdCdComponent } from './qdcddata/qdcd.component';
import { SalesHistoryComponent } from './saleshistory/saleshistory.component';
import { PaymentHistoryComponent } from './paymenthistory/paymenthistory.component';
import { CollectionTrendComponent } from './collection-trend/collection-trend.component';
import { SalesOutstandingComponent } from './sales-outstanding/sales-outstanding.component';

@NgModule({
    declarations: [
        PopupDialogComponent,
        SalesTrendComponent,
        AnalyticsComponent,
        QdCdComponent,
        SalesHistoryComponent,
        PaymentHistoryComponent,
        CollectionTrendComponent,
        SalesOutstandingComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ChartsModule
    ],
    exports: [
        PopupDialogComponent
    ],
    providers: [
        PopupDialogService
    ]
})
export class PopupDialogModule
{
}
