import { Component,  OnInit,AfterViewChecked } from '@angular/core';
import { L1MappingDialogService } from './l1mapping-dialog.service';
import { FormBuilder, Validators } from "@angular/forms";
import { of } from 'rxjs';

@Component({
    selector: 'l1mapping-dialog',
    templateUrl: 'l1mapping-dialog.component.html',
    styleUrls: ['l1mapping-dialog.component.scss']
})


export class L1MappingDialogComponent implements OnInit ,AfterViewChecked{
    message: any;
    form: any = {}
    checkedList: any;
    selectedVal:any;
    constructor(public fb: FormBuilder,
        private l1mappingDialogService: L1MappingDialogService
    ) {}
    
    plantForm = this.fb.group({
        plant: ['', [Validators.required]]
    })
    ngOnInit(): any {
        of(this.l1mappingDialogService.getMessage().subscribe(message => {
            this.message = message;
            this.selectedVal=this.l1mappingDialogService.getSelectedValues().split(":")[0];
            this.plantForm.controls.plant.patchValue(this.selectedVal);
          }));
         
    }
    ngAfterViewChecked(){
        if(this.l1mappingDialogService.getSelectedValues() && this.l1mappingDialogService.getSelectedValues()!=""){
            this.selectedVal=this.l1mappingDialogService.getSelectedValues().split(":")[0];
            if(this.message){
                if(this.message.text.find(x=>x.plant==this.selectedVal)){
                    this.l1mappingDialogService.setPlantName(this.message.text.find(x=>x.plant==this.selectedVal).plantDesc);
                }
            }
        }
    }
    isAllSelected(e,plantName) {
        
        if(this.plantForm.value.plant){
            if(this.message.text.find(x=>x.plant==this.plantForm.value.plant)){
                let incoterm=this.message.text.find(x=>x.plant==this.plantForm.value.plant).incoterm;
                this.l1mappingDialogService.setSelectedValues(this.plantForm.value.plant+":"+incoterm);
                
            }
        }
        
        this.l1mappingDialogService.setPlantName(plantName);
        
    }
}
