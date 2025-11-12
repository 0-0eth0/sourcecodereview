import { Component, OnChanges,OnInit } from '@angular/core';
import { ChartDataSets ,Point,Chart,Tooltip} from 'chart.js';
import { ReportService } from '../../_services/report.service';
import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';
import { formatDate } from '@angular/common';
import { PopupDialogService } from '../popup-dialog.service';

export interface dataSets{
  label:string;
  data: Array<number>,
  fill: boolean,
  borderColor:string,
  backgroundColor:string,
  xdate:string
}
export interface productColor{
  productName:string;
  color:string;
}
@Component({
  selector: 'analytics',
  templateUrl: './analytics.component.html'
})

export class AnalyticsComponent implements OnInit{
    currentView="week";
    moduleData:any[];

    dealerId:string;
    dapId:string;
    public refreshTime:any;
   chart:any;
   dataSet:dataSets[];
   chartLabel=[];
   productColors:productColor[]=[];
  constructor(
    private confirmDialogService: ConfirmDialogService,
    private reportService: ReportService,
    private popupDialogService:PopupDialogService) { }
  ngOnInit(){
      this.getAnalytics();
  }
   setDataObject(obj){
     var productList=[];
     this.chartLabel=[];
     this.dataSet=[];
    obj.forEach(item=>{
      if(this.chartLabel.indexOf(item.beatDate)==-1){
        this.chartLabel.push(item.beatDate);
      };
      if(productList.indexOf(item.productName)==-1){
        productList.push(item.productName);
      };
    });
    for(var i=0;i<this.chartLabel.length;i++){
      for(var p=0;p<productList.length;p++){
        var d=this.dataSet.find(x=>x.label==productList[p] );//&& x.xdate==this.chartLabel[i]
        var ex=obj.find(item=>item.productName==productList[p] && item.beatDate==this.chartLabel[i]);
        if(!d){        
          d={data:[],label:"",fill:false,xdate:"",borderColor:"",backgroundColor:""};
          d.data=[];
          d.label=productList[p];
          d.fill=false;
          d.xdate=this.chartLabel[i];
          //d.data.push(0);
          d.borderColor=this.productColors.find(x=>x.productName==productList[p])?this.productColors.find(x=>x.productName==productList[p]).color:  this.dynamicColors();
          d.backgroundColor=d.borderColor;
          this.dataSet.push(d);
        }
        if(ex){
          d.data.push(Number(ex.qty));
        }else{
          d.data.push(0);
        }
      }
   }
  }
  refreshData(type){
    if(type==""){
      type="week";
    }
    this.currentView=type;
    this.dataSet=[];
    var currentDate=new Date();
    currentDate.setDate(currentDate.getDate()-1);
    var firstDate= formatDate(currentDate, 'yyyy-MM-dd', 'en-US', '+0530');
    if(type=="week"){
      currentDate.setDate(currentDate.getDate()-7);
      var firstDate= formatDate(currentDate, 'yyyy-MM-dd', 'en-US', '+0530');
      var obj=this.moduleData.filter(x=>x.beatDate>firstDate && x.productName!=null);
      this.setDataObject(this.sortData(obj));
    }else if(type=="onemonth"){
      //currentDate.setDate(currentDate.getDate()-7);
      currentDate.setMonth(currentDate.getMonth()-1);
      var firstDate= formatDate(currentDate, 'yyyy-MM-dd', 'en-US', '+0530');
      var obj=this.moduleData.filter(x=>x.beatDate>firstDate && x.productName!=null).sort(s=>s.beatDate);
      this.setDataObject(this.sortData(obj));
    }else if(type=="threemonth"){
      currentDate.setMonth(currentDate.getMonth()-3);
      var firstDate= formatDate(currentDate, 'yyyy-MM-dd', 'en-US', '+0530');
      var obj=this.moduleData.filter(x=>x.beatDate>firstDate && x.productName!=null).sort(s=>s.beatDate);
      obj=this.sortData(obj)
      var filteredData=this.getSummaryData(obj,'month');
      this.setDataObject(filteredData);
    }else if(type=="sixmonth"){
      currentDate.setMonth(currentDate.getMonth()-6);
      var firstDate= formatDate(currentDate, 'yyyy-MM-dd', 'en-US', '+0530');
      var obj=this.moduleData.filter(x=>x.beatDate>firstDate && x.productName!=null).sort(s=>s.beatDate);
      obj=this.sortData(obj)
      var filteredData=this.getSummaryData(obj,'month');
      this.setDataObject(filteredData);
    }else if(type=="twelemonth"){
      currentDate.setMonth(currentDate.getMonth()-12);
      var firstDate= formatDate(currentDate, 'yyyy-MM-dd', 'en-US', '+0530');
      var obj=this.moduleData.filter(x=>x.beatDate>firstDate && x.productName!=null).sort(s=>s.beatDate);
      obj=this.sortData(obj)
      var filteredData=this.getSummaryData(obj,'month');
      this.setDataObject(filteredData);
    }else if(type=="twoyear"){
      currentDate.setMonth(currentDate.getMonth()-24);
      var firstDate= formatDate(currentDate, 'yyyy-MM-dd', 'en-US', '+0530');
      var obj=this.moduleData.filter(x=>x.beatDate>firstDate && x.productName!=null).sort(s=>s.beatDate);         
      obj=this.sortData(obj)
      var filteredData=this.getSummaryData(obj,'year');
      this.setDataObject(filteredData);
    }
    this.chart = new Chart('productwisesalechart', {
      type: 'bar',
      data: {
        labels: this.chartLabel,
        datasets: this.dataSet
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
    
  }
  sortData(data) {
    return data.sort((a, b) => {
      return <any>new Date(a.beatDate) - <any>new Date(b.beatDate);
    });
  }
  dynamicColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
}
  getSummaryData(obj,type){
    let accumulation = obj.reduce((total, val, index)=>{
      let foundItemIndex = total.findIndex((obj)=> this.getMonthName(obj.beatDate,type) == this.getMonthName(val.beatDate,type) && obj.productName==val.productName);
      if(foundItemIndex < 0) {
        var obj:any={};
        obj.productName=val.productName;
        obj.qty=Number(val.qty);
        obj.beatDate=this.getMonthName(val.beatDate,type);
        
        total.push(obj) 
      }
      else total[foundItemIndex].qty += Number(val.qty);
      return total;
    }, []);
    return accumulation;
  }
  getMonthName(val,formattype){
    var result="";
    if(val.length<=4){
      result=val;
    }else{
      //var dt=new Date(val.substring(0,4),val.substring(5,6),val.substring(6,8));
      var dt=new Date(val);
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
  
  getAnalytics(){
    this.dealerId=this.popupDialogService.getDealerId();
    this.dapId=this.popupDialogService.getDapId();
    this.refreshCurrentTime();
    this.reportService.getanalytsdatabydapid(this.dapId).subscribe(
        rdata => {
            if (rdata.response_code == "DM1002") {
                this.moduleData = rdata.response_body.pjp_feedbacks;
                this.refreshCurrentTime();
                //this.productColors=[];
                let colors = this.moduleData.reduce((total, val, index)=>{
                  let foundItemIndex = total.findIndex((obj)=> obj.productName == val.productName);
                  if(foundItemIndex < 0) {
                    var obj:any={};
                    obj.productName=val.productName;
                    obj.color=this.dynamicColors();
                    total.push(obj) 
                  }
                  return total;
                }, []);
                colors.forEach(element => {
                  if(!this.productColors.find(x=>x.productName==element.productName)){
                    var obj:any={};
                    obj.productName=element.productName;
                    obj.color=this.dynamicColors();
                    this.productColors.push(obj);
                  }  
                });
                
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