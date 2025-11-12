import { Component, OnChanges,OnInit } from '@angular/core';
import { ReportService } from '../../_services/report.service';
import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';
import { formatDate } from '@angular/common';
import { PopupDialogService } from '../popup-dialog.service';
import {qdcdData} from '../data-modal';
import { ChartDataSets ,Point,Chart,Tooltip} from 'chart.js';

@Component({
  selector: 'qdcd',
  templateUrl: './qdcd.component.html'
})

export class QdCdComponent implements OnInit{
    currentView="threemonth";
    moduleData:qdcdData[];
    chartLabel:any[]=[];
    dealerId:string;
    chart:any;
    public refreshTime:any;
    // lineChart
  public lineChartData:ChartDataSets[]=[];
  public lineChartLabels:Array<any> = [];
  public lineChartOptions:any = {
    responsive: true
  };
  
  public lineChartColors:Array<any> = [
    { backgroundColor: ['#6C63FF'] },
  ];
  
  public lineChartLegend:boolean = false;
  public lineChartType:any = 'bar';
  cdData:Array<any>=[];
  qdData:Array<any>=[];
  constructor(
    private confirmDialogService: ConfirmDialogService,
    private reportService: ReportService,
    private popupDialogService:PopupDialogService) { }
  ngOnInit(){
      this.getQdCdData();
  }
   getData(type,months){
    var currentDate=new Date();
    currentDate.setDate(currentDate.getDate()-1);
    var firstDate= formatDate(currentDate, 'yyyyMM', 'en-US', '+0530');
    currentDate.setMonth(currentDate.getMonth()-months);
    var firstDate= formatDate(currentDate, 'yyyyMM', 'en-US', '+0530');
    var obj=this.moduleData.filter(x=>x.yrMonth>firstDate);
    var filteredData=this.getSummaryData(obj,type);
    filteredData.forEach(item=>{
      this.cdData.push(Number(item.cd));
      this.qdData.push(Number(item.qd));
      this.chartLabel.push(item.yrMonth);
    });
   }
  refreshData(type){
    this.currentView=type;
    this.chartLabel=[];
    this.cdData=[];
    this.qdData=[];
    
    if(type=="threemonth"){
      this.getData('threemonth',3);
    }else if(type=="sixmonth"){
      this.getData('month',6);
    }else if(type=="twelemonth"){
      this.getData('month',12);
    }else if(type=="twoyear"){
      this.getData('year',24);
    }
    this.chart = new Chart('qdcdchart', {
      type: 'bar',
      
      data: {
        labels: this.chartLabel,
        datasets: [{
          label: 'QD',
          data: this.qdData,
          fill: false,
          borderColor:'#39B54A',
          backgroundColor:'#39B54A',
        },
        {
          label: 'CD',
          data: this.cdData,
          fill: false,
          borderColor:'#9E3A0D',
          backgroundColor:'#9E3A0D',
        }]
      },
      
      options: {    
        scales: {
          yAxes: [{
              display: true,
              ticks: {
                  suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
              }
          }]
      },
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
        tooltips: {
          enabled: true,
          mode: 'index',
          position: 'nearest',
          
        },
        /* elements:{
          line:{
            borderWidth:1,
            fill:false
          },
          point:{
            pointStyle:'circle',
          }
        }, */
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }
  getSummaryData(obj,type){
    let accumulation = obj.reduce((total, val, index)=>{
      let foundItemIndex = total.findIndex((obj)=> this.getMonthName(obj.yrMonth,type) == this.getMonthName(val.yrMonth,type));
      if(foundItemIndex < 0) {
        var obj:any={};
        obj.partyCode=val.partyCode;
        obj.qd=Number(val.qd);
        obj.cd=Number(val.cd);
        obj.yrMonth=this.getMonthName(val.yrMonth,type);
        total.push(obj) 
      }
      else {
        total[foundItemIndex].qd += Number(val.qd);
        total[foundItemIndex].cd += Number(val.cd);
      }
      return total;
    }, []);
    return accumulation;
  }
  getMonthName(val,formattype){
    var result="";
    if(val.length<=4){
      result=val;
    }else{
      var dt=new Date(val.substring(0,4),val.substring(5,6),1);
      if(formattype=="month"){
        result=formatDate(dt, 'MMM', 'en-US', '+0530');
      }else if(formattype=="day"){
        result=formatDate(dt, 'dd/MM/yyyy', 'en-US', '+0530');
      }else if(formattype=="year"){
        result=formatDate(dt, 'yyyy', 'en-US', '+0530');
      }
      
    }
    
    return result;
  }
  
  getQdCdData(){
    this.dealerId=this.popupDialogService.getDealerId();
    this.refreshCurrentTime();
    this.reportService.getCDandDM(this.dealerId).subscribe(
        rdata => {
            if (rdata.response_code == "DM1002") {
                this.moduleData = rdata.response_body.party_discounts;
                this.refreshCurrentTime();
                this.refreshData(this.currentView);
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