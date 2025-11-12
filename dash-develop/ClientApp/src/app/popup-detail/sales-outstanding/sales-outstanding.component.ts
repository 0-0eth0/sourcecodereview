import { Component, OnChanges,OnInit } from '@angular/core';
import { ChartDataSets ,Point,Chart,Tooltip} from 'chart.js';
import { ReportService } from '../../_services/report.service';
import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';
import { DatePipe,formatDate } from '@angular/common';
import { PopupDialogService } from '../popup-dialog.service';
import {collectionTrend} from '../data-modal';

@Component({
  selector: 'sales-outstanding',
  templateUrl: './sales-outstanding.component.html',
  providers: [DatePipe]
})
export class SalesOutstandingComponent implements OnInit{
    refreshTime:string;
    reportData:collectionTrend[]=[];
    chart:any;
    customTooltips:any;
    dealerId:string;
    constructor(
      private confirmDialogService: ConfirmDialogService,
      private reportService: ReportService, 
      private datepipe: DatePipe,
      private popupDialogService:PopupDialogService
      ) { }
    ngOnInit(){
      
      this.getSalesOutstanding();
    }
    getSalesOutstanding(){
      this.dealerId=this.popupDialogService.getDealerId();
      var chartLabel:any[]=[];
      var chartData=[];
    this.refreshTime=formatDate(new Date(), 'dd/MM/yyyy hh:mm:ss a', 'en-US', '+0530');
    this.reportService.getCollectionTrend(this.dealerId).subscribe(
        rdata => {
            if (rdata.response_code == "DM1002") {
                this.reportData=rdata.response_body;
                this.refreshTime=formatDate(new Date(), 'dd/MM/yyyy hh:mm:ss a', 'en-US', '+0530');
                
                this.reportData.forEach(item=>{
                  chartData.push(Number(item.accountReceivable));
                  chartLabel.push(this.formatMonth(item.yearMonth));
                });
                
                this.chart = new Chart('salesoutstandingchart', {
                  type: 'line',
                  data: {
                    labels: chartLabel,
                    datasets: [{
                      label: 'Outstanding',
                      data: chartData,
                      fill: false,
                      borderColor:'#39B54A',
                      backgroundColor:'#39B54A',
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
        },
        err => {
            this.confirmDialogService.showMessage(err.message, () => { });
        }
    );
  }
  formatMonth(val){
    var result="";
      var dt=new Date(val.substring(0,4),val.substring(5,6),1);
      result=formatDate(dt, 'MMM-yyyy', 'en-US', '+0530');

    return result;
  }
  }