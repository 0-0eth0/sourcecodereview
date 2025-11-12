import { Component, OnChanges,OnInit } from '@angular/core';
import { ChartDataSets ,Point,Chart,Tooltip} from 'chart.js';
import { ReportService } from '../../_services/report.service';
import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';
import { DatePipe,formatDate } from '@angular/common';
import { PopupDialogService } from '../popup-dialog.service';
import {collectionTrend} from '../data-modal';

@Component({
  selector: 'collection-trend',
  templateUrl: './collection-trend.component.html',
  providers: [DatePipe]
})

export class CollectionTrendComponent implements OnInit{
  
    collectionTrendRefreshTime:string;
    collectionTrendData:any;
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
      
      this.getCollectionTrend();
    }
    getCollectionTrend(){
      this.dealerId=this.popupDialogService.getDealerId();
      var chartLabel:any[]=[];
      var collectionTarget=[];
      var salesTarget=[];
    this.collectionTrendRefreshTime=formatDate(new Date(), 'dd/MM/yyyy hh:mm:ss a', 'en-US', '+0530');
    this.reportService.getCollectionTrend(this.dealerId).subscribe(
        rdata => {
            if (rdata.response_code == "DM1002") {
                this.collectionTrendData=rdata.response_body;
                this.collectionTrendRefreshTime=formatDate(new Date(), 'dd/MM/yyyy hh:mm:ss a', 'en-US', '+0530');
                
                this.collectionTrendData.forEach(item=>{
                  collectionTarget.push(Number(item.collectionTarget));
                  salesTarget.push(Number(item.saleTarget));
                  chartLabel.push(this.formatMonth(item.yearMonth));
                });
                
                this.chart = new Chart('collectiontrendchart', {
                  type: 'line',
                  data: {
                    labels: chartLabel,
                    datasets: [{
                      label: 'Collection',
                      data: collectionTarget,
                      fill: false,
                      borderColor:'#39B54A',
                      backgroundColor:'#39B54A',
                    },{
                      label: 'Sales',
                      data: salesTarget,
                      fill: false,
                      borderColor:'#9E3A0D',
                      backgroundColor:'#9E3A0D',
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