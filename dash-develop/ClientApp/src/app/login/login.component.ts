import { Component, OnInit,  ViewChild } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { timer } from 'rxjs';
import { Router } from '@angular/router';
import { MyGlobal } from '../_services/myglobal.service';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { CountdownComponent } from 'ngx-countdown';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit  {
    status = 'start';
    @ViewChild('countdown') counter: CountdownComponent;

    form: any = {};
    isLoggedIn = false;
    isLoginFailed = false;
    errorMessage = '';
    isOTPGenerated = false;
    submitted = false;
    smstimer= "";
    retrytimer = "";
    source = timer(0);
    //timeData = 60;
    public showResendBtn: boolean = false;
    //private subscription: Subscription;
    //private timer: Observable<any>;

    constructor(
        private confirmDialogService: ConfirmDialogService,
        private GlobalVariable: MyGlobal, 
        private router: Router, 
        private authService: AuthService, 
        private tokenStorage: TokenStorageService) { }
    
    confirmDialog(message, showyesno): any {
        if (!showyesno) {
            this.confirmDialogService.showMessage(message, () => { });
        } else {
            this.confirmDialogService.confirmThis("confirm",message, () => {
                //alert('Yes clicked');
            }, () => {
                //alert('No clicked');
            });
        }
        
    }
    ngOnInit(): void {
        //this.getRefId();
        document.body.classList.add('bg-img');
        if (this.tokenStorage.getToken()) {
            this.isLoggedIn = true;
            if(this.GlobalVariable.agentId.indexOf("SA")!=-1){
                this.router.navigate(['/dealer']);
            } else{
                this.router.navigate(['/home']);
            }
            
        } else {
            this.isLoggedIn = false;

        }
    }
    
    get f() { return this.form.controls; }
    IsNullorEmpty(value): boolean {
        if (value == undefined || value == "") {
            return true;
        }
        return false;;
    }
    onSubmit(): void {
       /*  if (this.IsNullorEmpty(this.form.mobilenumber)) {
            this.confirmDialog("Please enter mobile number", false);
            return;
        } */
        if (this.IsNullorEmpty(this.form.referenceId)) {
            this.confirmDialog("Please enter Agent Code", false);
            return;
        }
        
        this.authService.encryptcode(this.form).subscribe(
            data => {
                if (data.resp_code == "DM1002") {
                    this.GlobalVariable.encryptdecryptMobile = data.resp_body;
                    
                    //this.tokenStorage.saveRefId(data.resp_body);
                    this.authService.login(this.form).subscribe(
                        rdata => {
                            if (rdata.resp_code == "DM1011") {
                                this.isOTPGenerated = true;
                                this.smstimer = rdata.resp_body.otpSmsTimer;
                                this.retrytimer = rdata.resp_body.otpRetrySmsTimer;
                                //this.timeData = (Number(this.retrytimer) / 1000);
                                this.GlobalVariable.otpTokenID = rdata.resp_body.otpTokenId;
                                //this.setTimer(this.retrytimer);
                                setTimeout(() => {                           //<<<---using ()=> syntax
                                    this.showResendBtn = true;
                                }, Number(this.retrytimer));
                                this.tokenStorage.saveOtpToken(rdata.resp_body.otpTokenId);
                            } else {
                                this.confirmDialog(rdata.resp_msg, false);
                            }
                        },
                        err => {
                            this.confirmDialog(err.message, false);
                        }
                    );
                } else {
                    this.confirmDialog(data.resp_msg, false);
                }
            },
            err => {
                this.confirmDialog(err.message, false);
            }
        );
    }
    onOTPSubmit(): void {
        if (this.IsNullorEmpty(this.form.mobileotp)) {
            this.confirmDialog("Please enter OTP", false);
            return;
        }
        this.authService.encryptcode(this.form).subscribe(
            data => {
                if (data.resp_code == "DM1002") {
                    this.GlobalVariable.encryptdecryptCode = data.resp_body;
                    this.authService.submit(this.form).subscribe(
                        rdata => {
                            if (rdata.resp_code == "DM1002") {
                                this.isLoginFailed = false;
                                this.isLoggedIn = true;
                                this.GlobalVariable.accesstoken = rdata.resp_body.accessToken;
                                this.GlobalVariable.active = rdata.resp_body.active;
                                this.GlobalVariable.dlr_img_logo = rdata.resp_body.dlr_img_logo;
                                this.GlobalVariable.refreshToken = rdata.resp_body.refreshToken;
                                this.GlobalVariable.userType = rdata.resp_body.userType;
                                this.GlobalVariable.contactName = rdata.resp_body.contactName;
                                this.GlobalVariable.agentId=rdata.resp_body.dealer_id;
                                this.tokenStorage.saveToken(rdata.resp_body.accessToken);
                                this.tokenStorage.saveUser(rdata);
                                this.reloadPage();
                            } else {
                                this.confirmDialog(rdata.status, false);
                            }

                        },
                        err => {
                            this.confirmDialog(err.message, false);
                        }
                    );
                } else {
                    this.confirmDialog(data.resp_msg, false);
                }
            },
            err => {
                this.confirmDialog(err.message, false);
            }
        );
        
    }
    onOTPRetry(): void {
        this.showResendBtn = false;
        setTimeout(() => {                           //<<<---using ()=> syntax
            this.showResendBtn = true;
        }, Number(this.retrytimer));
        //this.timeData = (Number(this.retrytimer) / 1000);
        this.authService.otpretry(this.form).subscribe(
            data => {
                if (data.resp_code == "DM1015") {
                    this.form.mobileotp = "";
                } else {
                    this.confirmDialog(data.resp_msg, false);
                }
            },
            err => {
                this.confirmDialog(err.message, false);
            }
        );
    }
  reloadPage(): void {
    window.location.reload();
  }
    getRefId(): void {
        this.GlobalVariable.referenceId=this.form.referenceId;
        this.authService.getRefId().subscribe(
            data => {
                if (data.resp_code == "DM1002") {
                    this.GlobalVariable.xrefid = data.resp_body;
                    this.tokenStorage.saveRefId(data.resp_body);
                    this.onSubmit();
                } else {
                    this.confirmDialogService.showMessage(data.resp_msg, () => { });
                }
            },
            err => {
                this.confirmDialogService.showMessage(err.message, () => { });
            }
        );
    }    
    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }
}
