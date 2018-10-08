import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { JApprListVars } from './job-pending-approval-vars';
import { GlobalVariable } from '../../ghcm-global';
import { DatePipe } from '@angular/common';
import { Routes, Router, RouterModule, ActivatedRoute, NavigationStart, ActivatedRouteSnapshot, NavigationEnd, Event as NavigationEvent } from '@angular/router';
// import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent } from '@angular/router';
// import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { GET_Service } from '../../../api/get.service';


//declare let Dropzone: any; 
@Component({
    selector: 'app-pending-approval',
    templateUrl: './job-pending-approval.component.html',
    encapsulation: ViewEncapsulation.None,
    // KALAU ADA CSS SENDIRI styleUrls:['/job-vacant.component.css'] 
})

export class JobPendingApprovalComponent implements OnInit, AfterViewInit {
    title1 = JApprListVars.title1; title2 = JApprListVars.title2;

    //private baseUrl = GlobalVariable.BASE_API_URL;
    //private baseApiKey = GlobalVariable.API_KEY;
    //private token = '?api_key=' + this.baseApiKey;
    apiHCBD = JApprListVars.jobAppPndgListHCBDAPI;
    apiHCBO = JApprListVars.jobAppPndgListHCBOAPI;
    apiUrl: string;

    showAdvId = true; showAction = true; showLOB = false; showPosName = false; showPosId = false; showJobTitle = false; showStatus = false;
    showTtlApl = false; showPeriod = false; showAct = true;
    data: any = {};
    public term: string;
    styleTypeViewAll: string;
    styleTypeViewAct: string;

    // FIlter params
    public termPosId: string; public termJobTtl: string; public termPosName: string;
    public termLOB: string; public termTtlApp: string; public termStatus: string;
    public termDtStart: string; public termDtEnd: string;
    public termDtStart2: Date; public termDtEnd2: Date;

    constructor(private _GET_api_Service: GET_Service, private http: Http, private activeRoute: ActivatedRoute, private routers: Router, private datePipe: DatePipe, private _script: ScriptLoaderService) {
        // this.defDataTable();
    }

    JobAdvList(url3) {
        return this._GET_api_Service.GET_data(url3);
    }
    JobAdvListData(url2) {
        this.JobAdvList(url2).subscribe(data => {
            this.data = data;
            console.log(this.data);
        },
            error => console.log('[ERROR - Pending Approval List] ' + error),
            // () => console.log('Done')
        );
    }

    defDataTable() {
        switch (JSON.parse(localStorage.getItem('currentUser')).job_role.toLocaleUpperCase()) {
            // case 'HCBD': 
            case 'HEADHCBD':
                this.showLOB = true; this.showPosName = true; this.showPosId = false; this.showStatus = true;
                this.showTtlApl = true; this.showJobTitle = true; this.showPeriod = true;
                this.apiUrl = this.apiHCBD;
                break;
            case 'ADMINHCBO':
            case 'ADMINHCBO,HCBD':
                this.showLOB = true; this.showPosName = true; this.showPosId = false; this.showStatus = true;
                this.showTtlApl = true; this.showJobTitle = true; this.showPeriod = true;
                this.apiUrl = this.apiHCBO;
                break;
        }
        this.JobAdvListData(this.apiUrl);
    }

    ngAfterViewInit() {
        //this._script.loadScripts('app--tracking',
        //[
        //    'assets/js/jobs/bootstrap-datepicker.js'
        //]);
        //Dropzone._autoDiscoverFunction();
    }

    ngOnInit() {
        this.defDataTable();
        //console.log(this.apiUrl);
        this.JobAdvListData(this.apiUrl);
    }

    redirect(job_id: number) {
        // this.routers.navigate(['job/advertisement-tracking/detail',job_id]);
        this.routers.navigate(['job/pending-approval/detail', job_id]);
    }

    getStatusColor(status: string) {
        let ret: string;
        switch (status.toLocaleLowerCase()) {
            case 'advertised': ret = 'success'; break;
            case 'pending approval': ret = 'warning'; break;
        }
        return ret;
    }
    getStatusName(status: string) {
        let ret = status;
        switch (status.toLocaleLowerCase()) {
            //case 'advertised': ret='Advertised' ; break;
            case 'pending approval': ret = 'Pend. Approval'; break;
        }
        return ret;
    }
}