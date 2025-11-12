import { Component, OnChanges,OnInit } from '@angular/core';
import { ChartDataSets ,Point,Chart,Tooltip} from 'chart.js';
import { ReportService } from '../../_services/report.service';
import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';
import { formatDate } from '@angular/common';
import { PopupDialogService } from './../popup-dialog.service';
import {salesData} from './../data-modal';


@Component({
  selector: 'sales-trend',
  templateUrl: './sales-trend.html'
})

export class SalesTrendComponent implements OnInit{
    currentView="week";
    moduleData:salesData[];
    dealerId:string;
    public refreshTime:any;
    chart:any;
  constructor(
    private confirmDialogService: ConfirmDialogService,
    private reportService: ReportService,
    private popupDialogService:PopupDialogService) { }
  ngOnInit(){
      this.getSalesTrend();
  }
   
  refreshData(type){
    this.currentView=type;
    var chartData:any[]=[];
    var chartLabel:any[]=[];
    var currentDate=new Date();
    currentDate.setDate(currentDate.getDate()-1);
    var firstDate= formatDate(currentDate, 'yyyyMMdd', 'en-US', '+0530');
    if(type=="week"){
      currentDate.setDate(currentDate.getDate()-7);
      var firstDate= formatDate(currentDate, 'yyyyMMdd', 'en-US', '+0530');
      var obj=this.moduleData.filter(x=>x.saleDate>firstDate);
      obj.forEach(item=>{
        chartData.push(Number(item.quantity));
        chartLabel.push(this.getMonthName(item.saleDate,'day'));
      });
    }else if(type=="onemonth"){
      //currentDate.setDate(currentDate.getDate()-7);
      currentDate.setMonth(currentDate.getMonth()-1);
      var firstDate= formatDate(currentDate, 'yyyyMMdd', 'en-US', '+0530');
      var obj=this.moduleData.filter(x=>x.saleDate>firstDate);
      obj.forEach(item=>{
        chartData.push(Number(item.quantity));
        chartLabel.push(this.getMonthName(item.saleDate,'day'));
      });
    }else if(type=="threemonth"){
      currentDate.setMonth(currentDate.getMonth()-3);
      var firstDate= formatDate(currentDate, 'yyyyMMdd', 'en-US', '+0530');
      var obj=this.moduleData.filter(x=>x.saleDate>firstDate);
      var filteredData=this.getSummaryData(obj,'month');
      filteredData.forEach(function(item){
        chartData.push(Number(item.quantity));
        chartLabel.push(item.saleDate);
      });
    }else if(type=="sixmonth"){
      currentDate.setMonth(currentDate.getMonth()-6);
      var firstDate= formatDate(currentDate, 'yyyyMMdd', 'en-US', '+0530');
      var obj=this.moduleData.filter(x=>x.saleDate>firstDate);
      var filteredData=this.getSummaryData(obj,'month');
      filteredData.forEach(function(item){
        chartData.push(Number(item.quantity));
        chartLabel.push(item.saleDate);
      });
    }else if(type=="twelemonth"){
      currentDate.setMonth(currentDate.getMonth()-12);
      var firstDate= formatDate(currentDate, 'yyyyMMdd', 'en-US', '+0530');
      var obj=this.moduleData.filter(x=>x.saleDate>firstDate);
      var filteredData=this.getSummaryData(obj,'month');
      filteredData.forEach(function(item){
        chartData.push(Number(item.quantity));
        chartLabel.push(item.saleDate);
      });
    }else if(type=="twoyear"){
      currentDate.setMonth(currentDate.getMonth()-24);
      var firstDate= formatDate(currentDate, 'yyyyMMdd', 'en-US', '+0530');
      var obj=this.moduleData.filter(x=>x.saleDate>firstDate);
      var filteredData=this.getSummaryData(obj,'year');
      filteredData.forEach(function(item){
        chartData.push(Number(item.quantity));
        chartLabel.push(item.saleDate);
      });
    }
    this.chart = new Chart('salestrend', {
      type: 'line',
      data: {
        labels: chartLabel,
        datasets: [{
          label: 'Quantity',
          data: chartData,
          fill: true,
          borderColor:'#6C63FF',
          backgroundColor:'#6C63FF',
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
        tooltips: {
          enabled: true,
          mode: 'index',
          position: 'nearest',
          
        },
        elements:{
          line:{
            borderWidth:1,
            fill:true,
          },
          point:{
            pointStyle:'circle',
          }
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    });

    //this.lineChartData = [{ data: chartData, label: 'Quantity' }];
    //this.lineChartLabels=chartLabel;
  }
  getSummaryData(obj,type){
    let accumulation = obj.reduce((total, val, index)=>{
      let foundItemIndex = total.findIndex((obj)=> this.getMonthName(obj.saleDate,type) == this.getMonthName(val.saleDate,type));
      if(foundItemIndex < 0) {
        var obj:any={};
        obj.dealerId=val.dealerId;
        obj.quantity=Number(val.quantity);
        obj.saleDate=this.getMonthName(val.saleDate,type);
        
        total.push(obj) 
      }
      else total[foundItemIndex].quantity += Number(val.quantity);
      return total;
    }, []);
    return accumulation;
  }
  getMonthName(val,formattype){
    var result="";
    if(val.length<=4){
      result=val;
    }else{
      var dt=new Date(val.substring(0,4),val.substring(5,6),val.substring(6,8));
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
  
  getSalesTrend(){
    this.dealerId=this.popupDialogService.getDealerId();
    this.refreshCurrentTime();
    this.reportService.getSalesTrend(this.dealerId).subscribe(
        rdata => {
            if (rdata.response_code == "DM1002") {
                this.moduleData = rdata.response_body.sales_data;
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
  // events
  public chartClicked(e:any):void {
    //console.log(e);
  }
 
  public chartHovered(e:any):void {
    //console.log(e);
  }

  
}