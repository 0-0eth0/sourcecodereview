import {  DatePipe } from '@angular/common';
import { Component,  OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CalanderDialogService } from './calander-dialog.service';
 

@Component({
    selector: 'calander-dialog',
    templateUrl: 'calander-dialog.component.html',
    styleUrls: ['calander-dialog.component.scss'],
    providers: [ DatePipe ]
})


export class CalanderDialogComponent implements OnInit {
    message: any;
    selectedDate: Date = new Date;
    minDate: any;
    constructor(
        private calanderDialogService: CalanderDialogService ,
        private datepipe:DatePipe
    ) {
      var CurrentDate = new Date();
      this.minDate = CurrentDate;
    }
     
    ngOnInit(): any {

        this.calanderDialogService.getMessage().subscribe(message => {
            this.message = message;
            if(message){
                this.selectedDate= new Date();
                this.calanderDialogService.setSelectedValues(this.datepipe.transform(this.minDate, 'MMM,dd,yyyy'));
            }
                
        });
    }
    onSelect(event){
      console.log(event);
      this.selectedDate= event;
      this.calanderDialogService.setSelectedValues(this.datepipe.transform(this.selectedDate, 'MMM,dd,yyyy'));
    }
    
}
