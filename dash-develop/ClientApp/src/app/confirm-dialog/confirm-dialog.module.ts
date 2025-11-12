import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ConfirmDialogComponent} from './confirm-dialog.component';
import {ConfirmDialogService} from './confirm-dialog.service';

@NgModule({
    declarations: [
        ConfirmDialogComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        ConfirmDialogComponent
    ],
    providers: [
       ConfirmDialogService
    ]
})
export class ConfirmDialogModule
{
}
