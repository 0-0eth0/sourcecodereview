import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { DealerService } from '../_services/dealer.service';
import { MyGlobal } from '../_services/myglobal.service';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, SortDirection} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { TokenStorageService } from '../_services/token-storage.service';


  const ELEMENT_DATA: any[] = [] ;
  
@Component(
{
  selector: 'app-dealer-list',
  templateUrl: './dealer-list.component.html',
  styleUrls: ['./dealer-list.component.css']
})
export class DealerListComponent implements OnInit,AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    //@ViewChild(MatMultiSort, { static: false }) sort: MatMultiSort;

    clickedRows = new Set<any>();
    resultsLength = 0;
    isLoadingResults = true;
    isRateLimitReached = false;
    filterValue:any;
    dealerData: any;
    username:string="";
    callData:any;
    hidecall=false;
    displayedColumns: string[] = ['dealerId', 'dealerName', 'contactName', 'state','district','lastBillQty','lastBillDate','lastConDate','tgt_for_month','mtd_Billing','monthAvg','lastCollDate','lastCollAmount','outStanding','status','callDealer'];
    //dataSource;//= ELEMENT_DATA;
    //,'predicate_NextBillQty','predicate_NextBillDate,'dapPot','dalSow','
    dataSource=new MatTableDataSource(ELEMENT_DATA);
    stateList:any;
    selectedStateId:string="";
    constructor(
        private route: ActivatedRoute,
        private confirmDialogService: ConfirmDialogService, 
        private GlobalVariable: MyGlobal, 
        private dealerService: DealerService, 
        private tokenStorageService:TokenStorageService
        ) { }

    ngOnInit(): void {
        this.hidecall=this.GlobalVariable.agentId.indexOf("SA")!=-1?true:false;
        if(this.GlobalVariable.agentId.indexOf("AG")!=-1){
            this.selectedStateId=null;
        }else{
            const user = this.tokenStorageService.getUser();
            if(user && user.resp_body.states && user.resp_body.states.length>0){
                this.stateList=user.resp_body.states;
                this.selectedStateId=user.resp_body.states[0].regionId;
            }
        } 
        if(this.hidecall){
            this.displayedColumns = ['dealerId', 'dealerName', 'contactName', 'state','district','lastBillQty','lastBillDate','lastConDate','tgt_for_month','mtd_Billing','monthAvg','lastCollDate','lastCollAmount','outStanding','status'];
    
        }
        document.body.classList.remove('bg-img');
        const routeParams = this.route.snapshot.paramMap;
        const dealerIdFromRoute = routeParams.get('type');
        this.getDealerList();
        this.username=this.GlobalVariable.contactName;
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
       
      }
    
    getDealerList(): void {
        this.dealerData = [];
        this.dataSource=new MatTableDataSource([]);
        this.dealerService.getdealerlist(this.selectedStateId).subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002") {
                    this.dealerData = rdata.resp_body;
                    this.dataSource=new MatTableDataSource(rdata.resp_body);
                    this.dataSource.sort = this.sort;
                    this.dataSource.paginator = this.paginator;
                    setTimeout(
                        ()=>    this.paginator.pageIndex = 0,6000

                    );
                    //this.dataSource = rdata.resp_body;
                } else {
                    this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    } 
    applyFilter() {

        this.dataSource.filter = this.filterValue.trim().toLowerCase();
        console.log(this.dataSource.filter);
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
      openCall(dealerMobileNo,dealerId){
        this.getCallerLink(dealerMobileNo,dealerId);
      }
      getCallerLink(dealerMobileNo,dealerId): void {
        this.dealerService.getCallerWrapperData(dealerMobileNo,dealerId).subscribe(
            rdata => {
                if (rdata.resp_code == "DM1002") {
                    this.callData = rdata.resp_body;
                    this.confirmDialogService.showMessage(rdata.resp_body, () => { });
                } else {
                    this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    } 
}
