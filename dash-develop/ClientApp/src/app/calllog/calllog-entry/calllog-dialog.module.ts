import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CalllogDialogComponent} from './calllog-dialog.component';
import {CalllogDialogService} from './calllog-dialog.service';


@NgModule({
    declarations: [
        CalllogDialogComponent 
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        CalllogDialogComponent
    ],
    providers: [
        CalllogDialogService
    ]
})
export class CalllogDialogModule
{
}
