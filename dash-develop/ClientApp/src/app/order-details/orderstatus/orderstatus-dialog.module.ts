import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderStatusDialogComponent } from './orderstatus-dialog.component';
import { OrderStatusDialogService } from './orderstatus-dialog.service';
import { ViewMapDialogComponent } from './viewonmap-dialog.component';

@NgModule({
    declarations: [
        OrderStatusDialogComponent,
        ViewMapDialogComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        OrderStatusDialogComponent
    ],
    providers: [
        OrderStatusDialogService
    ]
})
export class OrderStatusDialogModule
{
}
