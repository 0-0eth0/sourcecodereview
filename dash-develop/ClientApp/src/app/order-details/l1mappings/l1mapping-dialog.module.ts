import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { L1MappingDialogComponent } from './l1mapping-dialog.component';
import { L1MappingDialogService } from './l1mapping-dialog.service';

@NgModule({
    declarations: [
        L1MappingDialogComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        L1MappingDialogComponent
    ],
    providers: [
        L1MappingDialogService
    ]
})
export class L1MappingDialogModule
{
}
