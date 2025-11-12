import { Component, Input, OnInit,Injectable,  Pipe,ViewChild,ElementRef  } from '@angular/core';
import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';
import { DealerService } from '../../_services/dealer.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
    selector:'viewmap',
    templateUrl: './viewonmap.dialog.component.html',
})

export class ViewMapDialogComponent implements OnInit  {
    @Input() selectedinvoice;
    @ViewChild('iframeContainer') iframeContainer: ElementRef;
    htmlData:any = '';
    url: string ="";
    urlSafe: SafeResourceUrl;
    constructor(private http: HttpClient,
        private dealerService: DealerService,
        private confirmDialogService: ConfirmDialogService,
        private sanitizer: DomSanitizer
    ) {}
    
    ngOnInit(): any {
       //this.viewTrackingMap(this.selectedinvoice);
    }
    ngAfterViewInit(): void {
        //this.injectIframe();
        this.viewTrackingMap(this.selectedinvoice);
      }
      private injectIframe(): void {
        const container = this.iframeContainer.nativeElement;
        const iframe = document.createElement('iframe');
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('src', this.url);
        iframe.setAttribute('height', '400');
        iframe.setAttribute('frameBorder', '0');
        iframe.addEventListener('load', this.iframeOnLoadtwo);
        container.appendChild(iframe);
      
      }
      public iframeOnLoadtwo(): void {
        console.log('iframe loaded...');
      }
    
    viewTrackingMap(lists) {
        this.url='';
        if (lists) {
            
            this.dealerService.getMapUrlInvoice(lists).subscribe(
                rdata => {
                    if (rdata.resp_code == "DM1002") {
                        this.url=rdata.url;
                          //this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
                          this.injectIframe();
                        //window.open(rdata.url);
                    } else {
                        this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
                    }
                },
                err => {
                    this.confirmDialogService.showMessage(err.message, () => { });
                }
            );
        } else {
            this.confirmDialogService.showMessage("Invoice information not available", () => { });
        }
    }
}
