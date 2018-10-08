import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { JADVars } from './job-adv-trck-vars';
import { GlobalVariable } from '../../ghcm-global';
import { DatePipe } from '@angular/common';
import { Routes, Router, RouterModule, ActivatedRoute, NavigationStart, ActivatedRouteSnapshot, NavigationEnd, Event as NavigationEvent } from '@angular/router';
// import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent } from '@angular/router';
// import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { GET_Service } from '../../../api/get.service';

//declare let Dropzone: any; 
@Component({
    selector: 'app-advertisement-tracking',
    templateUrl: './job-advertisement-tracking.component.html',
    encapsulation: ViewEncapsulation.None,
    // KALAU ADA CSS SENDIRI styleUrls:['/job-vacant.component.css'] 
})

export class JobAdvertisementTrackingComponent implements OnInit, AfterViewInit {
    title1 = JADVars.title1; title2 = JADVars.title2;

    private baseUrl = GlobalVariable.BASE_API_URL;
    private baseApiKey = GlobalVariable.API_KEY;
    private token = '?api_key=' + this.baseApiKey;
    private jobDataAPIAll = JADVars.jobAdvListAllAPI;
    private jobDataAPIActive = JADVars.jobAdvListActiveAPI;
    // private apiUrl = this.baseUrl + this.jobDataAPIAll + this.token;
    apiUrl: string;
    /*usrLoginLvl = GlobalVariable.USER_LEVEL;
    usrLoginRole=GlobalVariable.USER_ROLE;
    usrLoginToken=GlobalVariable.USER_TOKEN;*/

    showLOB = false; showPosName = false; showAdvId = true; showPosId = false; showJobTitle = false;
    showStatus = false; showTtlApl = false; showPeriod = false; showAct = true;
    data: any = {};
    data2: any = {};
    public term: string;
    styleTypeViewAll: string;
    styleTypeViewAct: string;

    // FIlter params
    public termAdvId: string;
    public termPosId: string; public termJobTtl: string; public termPosName: string;
    public termLOB: string; public termTtlApp: string; public termStatus: string;
    public termDtStart: string; public termDtEnd: string;
    public termDtStart2: Date; public termDtEnd2: Date;

    constructor(private _GET_api_Service: GET_Service, private http: Http, private activeRoute: ActivatedRoute, private routers: Router, private datePipe: DatePipe, private _script: ScriptLoaderService) {
        this.defDataTable();
        //routers.events.map(event => event instanceof NavigationStart)
        //    .subscribe(() => {
        //    let currTab=(this.activeRoute.snapshot.paramMap.get('type'));
        //    this.onChangeTab();
        //});       
    }

    JobAdvList(url3) {
        //return this.http.get(url3).map((res: Response) => res.json());
        return this._GET_api_Service.GET_data(url3);
    }

    JobAdvListData(url2) {
        // console.log(this.JobAdvList().subscribe());        
        type TrackingData = {
            idx: number, pos_id: string, job_ttl: string, pos_name: string, st_date: string,
            end_date: string, comp: string, status: string, total_applicant: number
            , st_date2: Date, end_date2: Date
        };
        let myarray: TrackingData[] = [];
        let sDt: string;
        let eDt: string;
        this.JobAdvList(url2).subscribe(data => {
            for (let i = 0; i < data.length; i++) {
                // let sDt=new Date(this.datePipe.transform(data[i].start,"yyyy-MM-dd"));
                sDt = this.datePipe.transform(data[i].start, "dd-MMM-yyyy");
                eDt = this.datePipe.transform(data[i].close, "dd-MMM-yyyy");
                myarray.push({
                    idx: data[i].id, pos_id: data[i].position_id, job_ttl: data[i].job_title,
                    pos_name: data[i].position, st_date: sDt, end_date: eDt, comp: data[i].company,
                    status: data[i].status, total_applicant: data[i].total_applicant,
                    st_date2: data[i].start, end_date2: data[i].close
                });
            }
            //this.data = data;
            this.data2 = myarray;
        },
            error => console.log('[ERROR - JobAdvListData] ' + error),
            // () => console.log('Done')
        );
        // console.log(this.data2);
    }
    defDataTable() {
        switch (JSON.parse(localStorage.getItem('currentUser')).job_role.toLocaleUpperCase()) {
            case 'HCBD':
                this.showLOB = false; this.showPosName = true; this.showPosId = false; this.showStatus = true;
                this.showTtlApl = true; this.showJobTitle = true; this.showPeriod = false; break;
            case 'HEADHCBD':
                this.showLOB = true; this.showPosName = true; this.showPosId = false; this.showStatus = true;
                this.showTtlApl = true; this.showJobTitle = true; this.showPeriod = false; break;
            case 'ADMINHCBO': case 'ADMINHCBO,HCBD':
                this.showLOB = true; this.showPosName = true; this.showPosId = false; this.showStatus = true;
                this.showTtlApl = true; this.showJobTitle = true; this.showPeriod = false; break;
        }
    }

    onChangeTab() {
        let url: string;
        let typeView = this.activeRoute.snapshot.paramMap.get('type');
        if (typeView == 'active') {
            this.styleTypeViewAll = 'btn-outline-warning';
            this.styleTypeViewAct = 'btn-warning';
            url = this.jobDataAPIActive;
        } else {
            this.styleTypeViewAll = 'btn-warning';
            this.styleTypeViewAct = 'btn-outline-warning';
            url = this.jobDataAPIAll;
        }
        // this.JobAdvListData(this.baseUrl + url + this.token);        
        this.JobAdvListData(url);
    }

    ngAfterViewInit() {
        //this._script.loadScripts('app-advertisement-tracking',
        //[
        //    'assets/js/jobs/bootstrap-datepicker.js'
        //]);
        //Dropzone._autoDiscoverFunction();
    }
    title: string;
    //getDeepestTitle:string;
    ngOnInit() {
        this.onChangeTab();
        this.routers.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                //this.title = "ABC:";// this.getDeepestTitle(this.routers.routerState.snapshot.root);
                //console.log(this.title);
                this.onChangeTab();
            }
        });


    }

    redirect(job_id: number) {
        this.routers.navigate(['job/advertisement-tracking/detail', job_id]);
    }

    getStatusColor(status: string) {
        let ret: string;
        switch (status.toLocaleLowerCase()) {
            case 'advertised': ret = 'success'; break;
            case 'pending approval': ret = 'warning'; break;
            case 'reverted': ret = 'primary'; break;
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