import {  Component, OnInit ,ViewChild,ElementRef} from '@angular/core';
import { ChartDataSets ,Point,Chart,Tooltip} from 'chart.js';
import { HomeService } from './home.service';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { DatePipe,formatDate } from '@angular/common';


@Component({
  selector: 'performance-chart',
  templateUrl: './performance-chart.component.html',
  providers: [DatePipe]
})

export class PerformanceChartComponent implements OnInit{
  performanceReportRefreshTime:Date;
  performanceReportType:string="day";
  performanceData:any;
    // lineChart
    
  //private chart: Chart;
  chart:any;
  private data: Point[];
  customTooltips:any;
  constructor(
    private confirmDialogService: ConfirmDialogService,
    private homeService: HomeService,
    public datepipe: DatePipe
    ) { }
  ngOnInit(){
    
    this.getPerformanceData('');
  }
  getPerformanceData(rptType){
    
    if(rptType!=""){
      this.performanceReportType=rptType;
    }
    
    if(this.performanceReportType==""){
      this.performanceReportType="day";
    }

    var chartLabel:any[]=[];
    var OrderData=[];
    var CallsData=[];
    var VolumneData=[];
    var orderCount=0;
    var callCount=0;
    var volumneCount=0;
    var date = new Date();
    date.setDate(date.getDate()-1);
  var toDate =this.datepipe.transform( date, 'yyyy-MM-dd');
  var fromDate =""; 
  if(this.performanceReportType=="day"){
    date.setDate(date.getDate()-7);
    fromDate =this.datepipe.transform( date, 'yyyy-MM-dd');
  }else if(this.performanceReportType=="week"){
    date.setMonth(date.getMonth()-1);
    fromDate =this.datepipe.transform( date, 'yyyy-MM-dd');
  }
  this.performanceReportRefreshTime=new Date();
  //fromDate="2021-07-01";
  this.homeService.getPerformanceData(fromDate,toDate).subscribe(
      rdata => {
          if (rdata.resp_code == "DM1002") {
              this.performanceData=rdata.resp_body;
              this.performanceReportRefreshTime=new Date();
              
              var filteredData=this.getSummaryData(this.performanceData,this.performanceReportType);
              filteredData.forEach(function(item){
                OrderData.push(Number(item.ordersNos));
                CallsData.push(Number(item.callNos));
                VolumneData.push(Number(item.volumns));
                chartLabel.push(item.displayDate);
                orderCount=Number(orderCount)+Number(item.ordersNos);
                callCount=Number(callCount)+Number(item.callNos);
                volumneCount=Number(volumneCount)+Number(item.volumns);
    
              });
              
              this.chart = new Chart('performancechart', {
                type: 'line',
                data: {
                  labels: chartLabel,
                  datasets: [{
                    label: '#Order: '+orderCount,
                    data: OrderData,
                    fill: false,
                    borderColor:'#39B54A',
                    backgroundColor:'#39B54A',
                  },
                  {
                    label: 'Volumne: '+volumneCount+"MT",
                    data: VolumneData,
                    fill: false,
                    borderColor:'#9E3A0D',
                    backgroundColor:'#9E3A0D',
                  },
                  {
                    label: '#Calls: '+callCount,
                    data: CallsData,
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
                                var label = "abc";//context.dataset.label.split(':')[0] || '';
        
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
 getWeekNumber(d: Date): number {
  d = new Date(+d);
  d.setHours(0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  var yearStart = new Date(d.getFullYear(), 0, 1);
  var weekNo = Math.ceil((((d.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);
  return weekNo;
}
 getDateRangeOfWeek(weekNo){
    var d1, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
    d1 = new Date();
    numOfdaysPastSinceLastMonday = d1.getDay() - 1;
    d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
    d1.setDate(d1.getDate() + (7 * (weekNo - d1.getWeek())));
    rangeIsFrom=formatDate(d1, 'dd-MM', 'en-US', '+0530')
    d1.setDate(d1.getDate() + 6);
    rangeIsTo=formatDate(d1, 'dd-MM', 'en-US', '+0530')
    return rangeIsFrom + " to " + rangeIsTo;
};


getSummaryData(obj,type){
  let accumulation = obj.reduce((total, val, index)=>{
    let foundItemIndex = total.findIndex((obj)=> this.getFormatedName(obj.date,type) == this.getFormatedName(val.date,type));
    if(foundItemIndex < 0) {
      var obj:any={};
      obj.callNos= Number(val.callNos);
      obj.ordersNos= Number(val.ordersNos);
      obj.volumns= Number(val.volumns);
      obj.date=val.date;
      if(type=="week"){
        obj.displayDate="Week"+(Number(total.length)+1) +"\n ";//+this.getDateRangeOfWeek(this.getFormatedName(val.date,type));
      }else{
        obj.displayDate=this.getFormatedName(val.date,type);
      }
      
     
      total.push(obj) 
    }
    else {
      total[foundItemIndex].callNos += Number(val.callNos);
      total[foundItemIndex].ordersNos += Number(val.ordersNos);
      total[foundItemIndex].volumns += Number(val.volumns);
    }
    return total;
  }, []);
  return accumulation;
}
getFormatedName(val,formattype){
  var result="";
  if(val.length<=4){
    result=val;
  }else{
    //var dt=new Date(val.substring(0,4),val.substring(5,6),val.substring(6,8));
    var dt=new Date(val);
    if(formattype=="day"){
      result=this.getDayName(dt)+"\n"+ formatDate(dt, 'dd-MM', 'en-US', '+0530');
    }else if(formattype=="week"){
      result=this.getWeekNumber(dt).toString();//   formatDate(dt, 'yyyy', 'en-US', '+0530');;
    }
    
  }
  
  return result;
}
getDayName(date){
  var day="";
  switch (date.getDay()) {
    case 0:
      day = "Sun";
      break;
    case 1:
      day = "Mon";
      break;
    case 2:
      day = "Tue";
      break;
    case 3:
      day = "Wed";
      break;
    case 4:
      day = "Thu";
      break;
    case 5:
      day = "Fri";
      break;
    case 6:
      day = "Sat";
  }
  return day;
}
}