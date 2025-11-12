import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {PriceCaptureDialogComponent} from './pricecapture-dialog.component';
import {PriceCaptureDialogService} from './pricecapture-dialog.service';

@NgModule({
    declarations: [
        PriceCaptureDialogComponent 
        
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule 
    ],
    exports: [
        PriceCaptureDialogComponent
    ],
    providers: [
        PriceCaptureDialogService,
        
    ]
})
export class PriceCaptureDialogModule
{
}
