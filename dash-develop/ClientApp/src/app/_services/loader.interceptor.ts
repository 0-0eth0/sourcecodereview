import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpEvent} from '@angular/common/http';
import {LoaderService} from './loader.service';
import { delay, finalize, tap } from "rxjs/operators";
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { MyGlobal } from '../_services/myglobal.service';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptor implements HttpInterceptor  {

  constructor(private loader: LoaderService,private router: Router,
    private confirmDialogService:ConfirmDialogService,
    private authService:AuthService,
    private token:TokenStorageService,
    private gVar:MyGlobal
    ) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>  {
          this.loader.show();
    return next.handle(req).pipe(
      tap(evt => {
       if (evt instanceof HttpResponse) {
          //console.log("event tap"+evt.status);
            if(evt.body && (evt.body.resp_code || evt.body.response_code))
             {
               if(evt.body.resp_code=="DM1019" || evt.body.response_code=="DM1019"){
                  this.token.signOut();
                  this.router.navigate(['/login']);
               }else if(evt.body.resp_code=="DM1018" || evt.body.response_code=="DM1018"){
                 this.getRefreshToken();
                 req.headers.set("accessToken",this.token.getToken());
                 req=req.clone();
                 next.handle(req);
               }
             }
        }
      }),
      finalize(() => this.loader.hide())
    );

  }
  getRefreshToken(){
    let retData=this.authService.refreshToken().toPromise();
    retData.then((rdata) =>{
            if (rdata.resp_code == "DM1002") {
              this.gVar.accesstoken = rdata.resp_body.accessToken;
              this.gVar.refreshToken = rdata.resp_body.refreshToken;
              this.token.saveToken(rdata.resp_body.accessToken);
            } else {
                this.confirmDialogService.showMessage(rdata.resp_msg, () => { });
            }
    }, function(error){
        //handle error
    });                  
}
}