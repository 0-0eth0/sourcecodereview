import { Component, OnChanges,OnInit } from '@angular/core';
import { ReportService } from '../../_services/report.service';
import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';
import { formatDate } from '@angular/common';
import { PopupDialogService } from '../popup-dialog.service';
import { ChartDataSets ,Point,Chart,Tooltip} from 'chart.js';

@Component({
  selector: 'paymenthistory',
  templateUrl: './paymenthistory.component.html'
})

export class PaymentHistoryComponent implements OnInit{
    moduleData:any;
    chartLabel:any[]=[];
    dealerId:string;
    chart:any;
    public refreshTime:any;
   
  previousYearData:Array<any>=[];
  currentYearData:Array<any>=[];
  constructor(
    private confirmDialogService: ConfirmDialogService,
    private reportService: ReportService,
    private popupDialogService:PopupDialogService) { }
  ngOnInit(){
      this.getPaymentHistory();
  }
  refreshData(){
    
    this.chartLabel=[];
    this.previousYearData=[];
    this.currentYearData=[];
    var currentMonth=new Date().getMonth()+1;
    var currentYear=new Date().getFullYear();
    var sum=0;
    if(currentMonth<4){
      var startMonth=4;
     for(var i=0;i<12;i++){
        if(startMonth<=12){
          var m=new Date(currentYear-1,startMonth,1);
          this.chartLabel.push(formatDate(m, 'MMM', 'en-US', '+0530'));
          sum=this.moduleData.filter(item => this.getFormatedName(item.paymentDate) === formatDate(m, 'yyyyMM', 'en-US', '+0530'))
                        .reduce((sum, current) => Number(sum)+ Number(current.amount), 0);
          this.currentYearData.push(sum?Number(sum):0);
          m=new Date(currentYear-2,startMonth,1);
          sum=this.moduleData.filter(item => this.getFormatedName(item.paymentDate) === formatDate(m, 'yyyyMM', 'en-US', '+0530'))
                        .reduce((sum, current) => Number(sum)+ Number(current.amount), 0);
          this.previousYearData.push(sum?Number(sum):0);
        }else{
          
          var m=new Date(currentYear-1,startMonth-12,1);
          
          this.chartLabel.push(formatDate(m, 'MMM', 'en-US', '+0530'));
          sum=this.moduleData.filter(item => this.getFormatedName(item.paymentDate) === formatDate(m, 'yyyyMM', 'en-US', '+0530'))
          .reduce((sum, current) => Number(sum)+ Number(current.amount), 0);
          this.currentYearData.push(sum?Number(sum):0);

          m=new Date(currentYear-2,startMonth-12,1);
          sum=this.moduleData.filter(item => this.getFormatedName(item.paymentDate) === formatDate(m, 'yyyyMM', 'en-US', '+0530'))
                        .reduce((sum, current) => Number(sum)+ Number(current.amount), 0);
          this.previousYearData.push(sum?Number(sum):0);
        }
        startMonth++;
      }
    }else {
      var startMonth=currentMonth;
    for(var i=3;i<startMonth;i++){
       
         var m=new Date(currentYear,i,1);
         this.chartLabel.push(formatDate(m, 'MMM', 'en-US', '+0530'));
         sum=this.moduleData.filter(item => this.getFormatedName(item.paymentDate) === formatDate(m, 'yyyyMM', 'en-US', '+0530'))
                        .reduce((sum, current) => Number(sum)+ Number(current.amount), 0);
          this.currentYearData.push(sum?Number(sum):0);
         
         m=new Date(currentYear-1,i,1);
         sum=this.moduleData.filter(item => this.getFormatedName(item.paymentDate) === formatDate(m, 'yyyyMM', 'en-US', '+0530'))
                        .reduce((sum, current) => Number(sum)+ Number(current.amount), 0);
          this.previousYearData.push(sum?Number(sum):0);
         
     }
   }

    this.chart = new Chart('paymenthistorychart', {
      type: 'line',
      data: {
        labels: this.chartLabel,
        datasets: [{
          label: 'Current Year',
          data: this.currentYearData,
          fill: false,
          borderColor:'#39B54A',
          backgroundColor:'#39B54A',
        },
        {
          label: 'Last Year',
          data: this.previousYearData,
          fill: false,
          borderColor:'#007CBF',
          backgroundColor:'#007CBF',
        }]
      },
      options: {
        plugins: {
          tooltip: {
              callbacks: {
                  label: function(context) {
                      var label = context.dataset.label.split(':')[0] || '';

                      if (label) {
                          label += ': ';
                      }
                      if (context.parsed.y !== null) {
                          label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                      }
                      return label;
                  }
              }
          }
      },
        legend:{
            align:'start',
            labels:{
              usePointStyle:true,
            },
            
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        },
        tooltips: {
          enabled: true,
          mode: 'index',
          position: 'nearest',
          
        },
        elements:{
          line:{
            borderWidth:1,
            fill:true
          },
          point:{
            pointStyle:'circle',
          }
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }
  getFormatedName(val){
    var result="";
    var dt=new Date(val.substring(0,4),val.substring(5,6),val.substring(6,8));
    result=formatDate(dt, 'yyyyMM', 'en-US', '+0530');;
    return result;
  }
  getPaymentHistory(){
    this.dealerId=this.popupDialogService.getDealerId();
    this.refreshCurrentTime();
    this.reportService.getPaymentHistory(this.dealerId).subscribe(
        rdata => {
            if (rdata.response_code == "DM1002") {
                this.moduleData = rdata.response_body;
                this.refreshCurrentTime();
                this.refreshData();
            } else {
                this.confirmDialogService.showMessage(rdata.response_msg, () => { });
            }
        },
        err => {
            this.confirmDialogService.showMessage(err.message, () => { });
        }
    );
    
}
refreshCurrentTime(){
  this.refreshTime= formatDate(new Date(), 'dd/MM/yyyy hh:mm:ss a', 'en-US', '+0530');
}
  

  
}