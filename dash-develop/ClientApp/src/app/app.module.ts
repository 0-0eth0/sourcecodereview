import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ChartsModule } from 'ng2-charts';


//Services
import { LoaderInterceptor } from './_services/loader.interceptor';
import { LoaderService } from './_services/loader.service';
import { LoginService } from './_services/login.service';
import { AdminGuard } from './admin/admin.guard';
import { PlaceOrderService } from './order-details/placeorder.service';
import { CalllogService } from './calllog/calllog.service';
//Component
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DealerListComponent } from './dealer-list/dealer-list.component';
import { DealerDetailComponent } from './dealer-detail/dealer-detail.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { CalllogComponent } from './calllog/calllog.component';
import { CollectionComponent } from './collection/collection.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { HomeComponent } from './home/home.component';
import { PerformanceChartComponent } from './home/performance-chart.component';


//Module
import { ShiptopartyDialogModule } from './order-details/shiptoparty/shiptoparty-dialog.module';
import { L1MappingDialogModule } from './order-details/l1mappings/l1mapping-dialog.module';
import { CancelorderDialogModule } from './order-details/cancel-order/cancelorder-dialog.module';
import { OrderConfirmDialogModule } from './order-details/orderconfirm/orderconfirm-dialog.module';
import { OrderStatusDialogModule } from './order-details/orderstatus/orderstatus-dialog.module';
import { ConfirmDialogModule } from './confirm-dialog/confirm-dialog.module';
import { PopupDialogModule } from './popup-detail/popup-dialog.module';
import { CalllogDialogModule } from './calllog/calllog-entry/calllog-dialog.module';
import { PriceCaptureDialogModule } from './calllog/pricecapture/pricecapture-dialog.module';
import { CountdownModule } from 'ngx-countdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalanderDialogModule } from './order-details/calander/calander-dialog.module';

//Directive
import { NumericValidatorDirective } from './directives/numeric.directive';
import { NumericDirective } from './directives/numericwithdecimal.directive';
import { StylePaginatorDirective } from './directives/style-paginator.directive';

//for report
import {MatNativeDateModule} from '@angular/material/core';
import {MaterialModule} from './material-module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ISlimScrollOptions, NgSlimScrollModule, SLIMSCROLL_DEFAULTS } from 'ngx-slimscroll';
 
 
@NgModule({
  imports: [
    BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ShiptopartyDialogModule,
        L1MappingDialogModule,
        OrderConfirmDialogModule,
        CalanderDialogModule,
        OrderStatusDialogModule,
        CancelorderDialogModule,
        ConfirmDialogModule,
        PopupDialogModule,
        CountdownModule,
        NgMultiSelectDropDownModule,
        BrowserAnimationsModule,
        CalllogDialogModule,
        PriceCaptureDialogModule,
        NgbModule,
        ChartsModule,
        MaterialModule,
        MatNativeDateModule,
        NgSlimScrollModule,
        NgCircleProgressModule.forRoot({
            // set defaults here
            radius: 100,
            space: -12,
            outerStrokeWidth: 11,
            innerStrokeColor: "#e3e3e3",
            innerStrokeWidth: 12,
            animation: false,
            animateTitle: true,
            showSubtitle: true,
            showTitle: true,
            subtitle:"Achieved",
            titleFontSize: "17",
            subtitleFontSize: "17",
            titleColor: "#0054A6",
            subtitleColor: "#0054A6"
        }),
        RouterModule.forRoot([
            { path: 'login', component: LoginComponent },
            { path: 'dealer', component: DealerListComponent, canActivate: [AdminGuard] },
            { path: 'dealer/:type', component: DealerListComponent, canActivate: [AdminGuard] },
            { path: 'dealerdetail/:dealerid', component: DealerDetailComponent, canActivate: [AdminGuard] },
            { path: 'home', component: HomeComponent, canActivate: [AdminGuard] },
			
			

            { path: '', redirectTo: 'login', pathMatch: 'full' }
      
    ])
  ],
  
    declarations: [
        NumericValidatorDirective,
        NumericDirective,
        StylePaginatorDirective,

        AppComponent,
        LoginComponent,
        DealerListComponent,
        OrderDetailsComponent,
        DealerDetailComponent,
        CalllogComponent,
        CollectionComponent,
        AnalyticsComponent,
        HomeComponent,
        PerformanceChartComponent
    ],
  bootstrap: [
    AppComponent
    ], schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }, AdminGuard, LoaderService,PlaceOrderService,CalllogService,LoginService,
      { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
      { provide: SLIMSCROLL_DEFAULTS,useValue: { alwaysVisible : false }  },
      
      ]
})
export class AppModule {
  
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
