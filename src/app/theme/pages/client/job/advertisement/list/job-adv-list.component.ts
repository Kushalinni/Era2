import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { JALVars } from './job-adv-list-vars';
import { GlobalVariable } from '../../../../ghcm-global';
import { DatePipe } from '@angular/common';
import { Routes, Router, RouterModule, ActivatedRoute, NavigationStart, Event as NavigationEvent } from '@angular/router';
// import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent } from '@angular/router';
// import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';

//declare let Dropzone: any; 
@Component({
    selector: 'app-adv-list',
    templateUrl: './job-adv-list.component.html',
    encapsulation: ViewEncapsulation.None,
    // KALAU ADA CSS SENDIRI styleUrls:['/job-vacant.component.css'] 
})

export class JobAdvListComponent {
    title1 = JALVars.title1; title2 = JALVars.title2;
    private baseUrl = GlobalVariable.BASE_API_URL;
    private apiKey = '?api_key=' + GlobalVariable.API_KEY;
    private vacListAPIUrl = this.baseUrl + JALVars.vacantList + this.apiKey;
    usrLoginLvl = JSON.parse(localStorage.getItem('currentUser')).userlevel; // GlobalVariable.USER_LEVEL;//0;//ghcmUserLoginVariable.USER_LEVEL; {TODO} - shld be from localstorage

    showAct = true;
    showFilter = true;
    data: any = {};
    data2: any = {};
    dataByItem: any = {};
    public term: string;
    styleTypeViewAll: string;
    styleTypeViewAct: string;

    // FIlter params
    public termPos: string; public termLoc: string; public termComp: string;

    constructor(private http: Http, private datePipe: DatePipe) {
        this.getJobVacantData();
    }

    getJobVacant() {
        // console.log(this.vacListAPIUrl);
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let headersComCat = new Headers();
        headersComCat.append('token', currentUser.token);
        headersComCat.append('Content-Type', 'application/json');
        let optionsComCat = new RequestOptions({ headers: headersComCat });
        return this.http.get(this.vacListAPIUrl, optionsComCat)
            .map((res: Response) => res.json())
    }

    getJobVacantData() {
        type TrackingData = {
            idx: number, pos: string, job: string, loc: string, comp: string,
            st_date: string, end_date: string, public: string, share: string, apply: number,
            strAppBtn: boolean, appBtn: boolean, start: Date, close: Date, jDLink: string
        };
        let myarray: TrackingData[] = [];
        let sDt: string;
        let eDt: string;
        let strAppBtn: boolean;
        let appBtn: boolean;
        let jDLink: string;
        this.getJobVacant().subscribe(data => {
            this.data = data;
            for (let i = 0; i < data.length; i++) {
                // let sDt=new Date(this.datePipe.transform(data[i].start,"yyyy-MM-dd"));
                sDt = this.datePipe.transform(data[i].start, "dd-MMM-yyyy");
                eDt = this.datePipe.transform(data[i].close, "dd-MMM-yyyy");
                if (data[i].apply == 0) {
                    jDLink = '../detail/0/';
                    strAppBtn = false;
                    appBtn = true; //'style="display:none " '; //'none';//'<button type="button" class="btn btn-sm m-btn--pill btn-success">Success</button>';
                } else {
                    jDLink = '../detail/1/';
                    strAppBtn = true;
                    appBtn = false;
                } //'style="display:block " '; ;}
                //console.log(jDLink);
                myarray.push({
                    idx: data[i].id, pos: data[i].position,
                    job: data[i].job_title, loc: data[i].location,
                    comp: data[i].company, st_date: sDt, end_date: eDt,
                    public: data[i].public, share: data[i].share, apply: data[i].apply,
                    strAppBtn: strAppBtn, appBtn: appBtn, start: data[i].start, close: data[i].close,
                    jDLink: jDLink,
                });
            }
            //this.data = data;
            this.data2 = myarray;
        });
    }

}