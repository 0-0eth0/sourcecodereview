import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderConfirmDialogComponent } from './orderconfirm-dialog.component';
import { OrderConfirmDialogService } from './orderconfirm-dialog.service';

@NgModule({
    declarations: [
        OrderConfirmDialogComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        OrderConfirmDialogComponent
    ],
    providers: [
        OrderConfirmDialogService
    ]
})
export class OrderConfirmDialogModule
{
}
