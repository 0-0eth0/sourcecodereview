import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalanderDialogComponent } from './calander-dialog.component';
import { CalanderDialogService } from './calander-dialog.service';
 
import {MaterialModule} from '../../material-module';

@NgModule({
    declarations: [
        CalanderDialogComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
    exports: [
        CalanderDialogComponent
    ],
      
    providers: [
        CalanderDialogService
    ]
})
export class CalanderDialogModule
{
}
