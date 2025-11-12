import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShiptopartyDialogComponent } from './shiptoparty-dialog.component';
import { ShiptopartyDialogService } from './shiptoparty-dialog.service';

@NgModule({
    declarations: [
        ShiptopartyDialogComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        ShiptopartyDialogComponent
    ],
    providers: [
        ShiptopartyDialogService
    ]
})
export class ShiptopartyDialogModule
{
}
