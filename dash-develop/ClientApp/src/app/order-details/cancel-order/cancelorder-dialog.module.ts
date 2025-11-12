import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CancelorderDialogComponent } from './cancelorder-dialog.component';
import { CancelorderDialogService } from './cancelorder-dialog.service';
import {NumericDirectives} from './numericwithdecimal.directive';

@NgModule({
    declarations: [
        CancelorderDialogComponent,
        NumericDirectives
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        CancelorderDialogComponent
    ],
    providers: [
        CancelorderDialogService
    ]
})
export class CancelorderDialogModule
{
}
