import { Component, OnChanges, OnInit, SimpleChanges  } from '@angular/core';
import { HomeService } from './home.service';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { DatePipe } from '@angular/common';
import { ChartDataSets,Chart } from 'chart.js';
import { SlimScrollOptions, SlimScrollEvent } from 'ngx-slimscroll';
import { MyGlobal } from '../_services/myglobal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DatePipe]
})

export class HomeComponent implements OnInit{
  selectedBilledOption:string="All";    
    billedUnbilledCustomerData:any;
    pendingOrders:any;
    outstandingData:any;
    selectedMonthPendingOrder:number;
    selectedMonthoutstanding:number;
    selectedMonthchurnDealer:number;
    pendingOrderLastRefreshTime:Date;
    outstandingLastRefreshTime:Date;
    unBilledListLastRefreshTime:Date;
    churnorBlockDealerRefreshTime:Date;
    churnorBlockDealer:any;
    churnorBlocedDealerCount:number;
    dealerType:string="churn";
    billedUnbilledReportType:string="day";
    homeWidgetData:any=[];
    monthList=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    monthly_Volume_Per="";
    daily_Volume_Per="";
    public lineChartData:ChartDataSets[]=[];
    public lineChartLabels:Array<any> = ['Billed Customer', 'Non Billed Customer'];
    public lineChartOptions:any = {
      responsive: true
    };
    public lineChartColors:Array<any> = [
      { backgroundColor: ['#E7DED4','#DA4C62'] },
    ];
    public lineChartLegend:boolean = false;
    public lineChartType:any = 'doughnut';
    allUnbilledBilledrpt:any;
    opts: SlimScrollOptions;
    charts:any;
    totalCustomers:number=0;
    hidecall=false;
    constructor(
      private homeService:HomeService,
      private confirmDialogService:ConfirmDialogService,
      public datepipe: DatePipe,
      private GlobalVariable:MyGlobal,
      private router:Router
      ) { }
  

    ngOnInit(): void {
      this.hidecall=this.GlobalVariable.agentId.indexOf("SA")!=-1?true:false;
      if(this.hidecall){
        this.router.navigate(['/dealer']);
      }  
      this.opts = new SlimScrollOptions({
        position:'right',
        barWidth: "8",
        barBorderRadius:"20",
        alwaysVisible:true,
        visibleTimeout: 1000,
        alwaysPreventDefaultScroll: true,
        
      });
       
        document.body.classList.remove('bg-img');
      var currentDate=new Date();
      this.selectedMonthPendingOrder=currentDate.getMonth();
      this.selectedMonthoutstanding=currentDate.getMonth();
      this.selectedMonthchurnDealer=currentDate.getMonth();
      this.getPendingOrders();
      this.getBilledUnbilledCustomer('');
      this.getTotalOutstanding();
      this.getChurnDealers();
      this.getHomeWidgetData();
      var chartData:any[]=[];
      this.lineChartData = [{ data: chartData, label: 'blinks' }];
  }
  refreshTable(e){
    this.allUnbilledBilledrpt=[];
    this.selectedBilledOption=e.target.value;        
    if(e.target.value!=="All"){
      this.allUnbilledBilledrpt=this.billedUnbilledCustomerData.dealer_billed_unbilled_list.filter(x=>x.billStatus.toString().toLowerCase()==e.target.value.toString().toLowerCase());
    }else {
      this.allUnbilledBilledrpt=this.billedUnbilledCustomerData.dealer_billed_unbilled_list;
    }
}
  getBilledUnbilledCustomer(rptType){
    var chartData:any[]=[];
    var date = new Date();
    var fromDate ="";
    var toDate ="";
    if(rptType==""){
      rptType="day";
    }
    this.billedUnbilledReportType=rptType;
    if(rptType=="day"){
      fromDate =this.datepipe.transform( new Date(), 'yyyy-MM-dd');
      toDate = fromDate;
    }else if(rptType=="week"){
      toDate = this.datepipe.transform( new Date(), 'yyyy-MM-dd');
      var dt=new Date();
      dt.setHours(0, 0, 0);
      dt.setDate(dt.getDate()-7);
      fromDate =this.datepipe.transform(dt, 'yyyy-MM-dd');
    }
    this.unBilledListLastRefreshTime=new Date();
    this.homeService.getBilledUnbilledCustomer(fromDate,toDate).subscribe(
        rdata => {
            if (rdata.resp_code == "DM1002") {
                this.billedUnbilledCustomerData=rdata.resp_body;
                this.allUnbilledBilledrpt=this.billedUnbilledCustomerData.dealer_billed_unbilled_list;
                this.selectedBilledOption="All";
                /*if(this.billedUnbilledCustomerData && this.billedUnbilledCustomerData.billedDealerList && this.billedUnbilledCustomerData.billedDealerList.length>0){
                  chartData.push(this.billedUnbilledCustomerData.billedDealerList.length);    
                }else{
                  chartData.push(0);    
                }
                if(this.billedUnbilledCustomerData && this.billedUnbilledCustomerData.unBilledDealerList&& this.billedUnbilledCustomerData.unBilledDealerList.length>0){
                  chartData.push(this.billedUnbilledCustomerData.unBilledDealerList.length);    
                }else{
                  chartData.push(0);    
                }
                this.lineChartData = [{ data: chartData, label: '' }];
                this.unBilledListLastRefreshTime=new Date();
                this.charts = new Chart('billedcusterchart', {
                  type: 'doughnut',
                  data: {
                    labels: ['Billed Customer','Non-Billed Customer'],
                    datasets: [
                      { 
                        data:chartData,
                        backgroundColor: ['#E7DED4','#DA4C62'],
                        fill: false
                      },
                    ]
                  },
                  options: {
                    legend: {
                      display: false
                    },
                    
                    plugins: {
                      datalabels: {
                        display: true,
                        backgroundColor: 'red',
                        borderRadius: 3,
                        font: {
                          color: 'red',
                          weight: 'bold',
                        }
                      },
                      doughnutlabel: {
                        labels: [{
                          text: 'Total Customer '+Number(chartData[0])+Number(chartData[1]),
                          font: {
                            size: 20,
                            weight: 'bold'
                          }
                        }, {
                          text: 'total'
                        }]
                      }
                    }
                  }
                });*/
            }
        },
        err => {
            this.confirmDialogService.showMessage(err.message, () => { });
        }
    );
    
    
  }
  getPendingOrders(){
    this.pendingOrders=[];
    var date = new Date();
    var fromDate =this.datepipe.transform( new Date(date.getFullYear(), this.selectedMonthPendingOrder, 1), 'yyyy-MM-dd');
    var toDate = this.datepipe.transform( new Date(date.getFullYear(), Number(this.selectedMonthPendingOrder) + 1, 0), 'yyyy-MM-dd');
    //var fromDate =this.datepipe.transform( new Date(), 'yyyy-MM-dd');
    //var toDate = this.datepipe.transform( new Date(), 'yyyy-MM-dd');
    this.pendingOrderLastRefreshTime=new Date();
    this.homeService.getPendingOrders(fromDate,toDate).subscribe(
        rdata => {
            if (rdata.resp_code == "DM1002") {
                this.pendingOrders=rdata.resp_body;
                this.pendingOrderLastRefreshTime=new Date();
            }
        },
        err => {
            this.confirmDialogService.showMessage(err.message, () => { });
        }
    );
  }
  getTotalOutstanding(){
    this.outstandingData=[];
    var date = new Date();
    var fromDate =this.datepipe.transform( new Date(date.getFullYear(), this.selectedMonthoutstanding, 1), 'yyyy-MM-dd');
    var toDate = this.datepipe.transform( new Date(date.getFullYear(), Number(this.selectedMonthoutstanding) + 1, 0), 'yyyy-MM-dd');
    this.outstandingLastRefreshTime=new Date();
    this.homeService.getTotalOutstanding(fromDate,toDate).subscribe(
        rdata => {
            if (rdata.resp_code == "DM1002") {
                this.outstandingData=rdata.resp_body;
                this.outstandingLastRefreshTime=new Date();
            }
        },
        err => {
            this.confirmDialogService.showMessage(err.message, () => { });
        }
    );
    
  }
  getRefreshChurnorBlockedDealer(rpttype){
      if(rpttype==""){
        rpttype=this.dealerType;
      }
      if(rpttype=="churn"){
        this.getChurnDealers();
      }else{
        this.getBlockedDealers();
      }
  }
  getChurnDealers(){
    this.dealerType="churn";
    this.churnorBlockDealerRefreshTime=new Date();
    this.churnorBlockDealer=[];
    this.churnorBlocedDealerCount=0;
    this.homeService.getChurnDealers().subscribe(
        rdata => {
            if (rdata.resp_code == "DM1002") {
                this.churnorBlockDealer=rdata.resp_body;
                this.churnorBlockDealerRefreshTime=new Date();
                if(this.churnorBlockDealer){
                    this.churnorBlocedDealerCount=this.churnorBlockDealer.length;
                }
            }
        },
        err => {
            this.confirmDialogService.showMessage(err.message, () => { });
        }
    );
  }
  getBlockedDealers(){
    this.dealerType="blockdealer";
    this.churnorBlockDealerRefreshTime=new Date();
    this.churnorBlockDealer=[];
    this.churnorBlocedDealerCount=0;
    this.homeService.getCreditBlockedDealers().subscribe(
        rdata => {
            if (rdata.resp_code == "DM1002") {
                this.churnorBlockDealer=rdata.resp_body;
                this.churnorBlockDealerRefreshTime=new Date();
                if(this.churnorBlockDealer){
                    this.churnorBlocedDealerCount=this.churnorBlockDealer.length;
                }
            }
        },
        err => {
            this.confirmDialogService.showMessage(err.message, () => { });
        }
    );
  }
  public chartClicked(e:any):void {
    //console.log(e);
  }
   
  public chartHovered(e:any):void {
    //console.log(e);
  }
  getHomeWidgetData(){
    this.homeWidgetData=[];
    this.totalCustomers=0;
    this.monthly_Volume_Per="";
    this.daily_Volume_Per=""
    this.homeService.getHomeWidgetData().subscribe(
        rdata => {
            if (rdata.resp_code == "DM1002") {
                this.homeWidgetData=rdata.resp_body[0];
                this.totalCustomers=(Number(this.homeWidgetData.active_dealers_count)+Number(this.homeWidgetData.blocked_dealers_count));
                this.monthly_Volume_Per=this.homeWidgetData.monthly_Volume_Per?this.homeWidgetData.monthly_Volume_Per:"";
                this.daily_Volume_Per=this.homeWidgetData.daily_Volume_Per?this.homeWidgetData.daily_Volume_Per:"";
                
            }
        },
        err => {
            this.confirmDialogService.showMessage(err.message, () => { });
        }
    );
  }
}
