import { Component,  Input,OnInit,OnChanges  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopupDialogService } from '../popup-detail/popup-dialog.service';
import { ChartDataSets } from 'chart.js';

@Component({
  selector: 'collection-detail',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit,OnChanges {
    @Input() dealerCheatSheetData;
    //dealerCheatSheetData: any ;
    
    dealerId:string="";
    reportData:any;
    public lineChartData:ChartDataSets[]=[];
    public lineChartLabels:Array<any> = ['Limit', 'Utilized'];
    public lineChartOptions:any = {
      responsive: true
    };
    public lineChartColors:Array<any> = [
      { backgroundColor: ['#38ACEC','#EB4D4D'] },
    ];
    public lineChartLegend:boolean = false;
    public lineChartType:any = 'pie';
     
    constructor(
        private route: ActivatedRoute,
        private popupDialogService: PopupDialogService,
        ) 
        {
            
         }

    ngOnInit(): void {
        document.body.classList.remove('bg-img');
        const routeParams = this.route.snapshot.paramMap;
        const dealerIdFromRoute = routeParams.get('dealerid');
        this.dealerId=dealerIdFromRoute;
    }
    ngOnChanges(){
        var chartData:any[]=[];
        
        if(this.dealerCheatSheetData){
             var utlized=((this.dealerCheatSheetData.outstanding/this.dealerCheatSheetData.creditLimit)*100).toFixed(2);
             if(Number(utlized)>100){
              utlized='100';
             }
            chartData.push(100-Number(utlized));
            chartData.push(Number(utlized));
        }

          this.lineChartData = [{ data: chartData, label: 'blinks' }];
    }
    public chartClicked(e:any):void {
      console.log(e);
    }
     
    public chartHovered(e:any):void {
      console.log(e);
    }
      
     
    getCompanyWiseAging(): void {
        this.popupDialogService.showDataDialog("companywiseaging","Aging Outstanding","",this.dealerId,"");
    }
}
