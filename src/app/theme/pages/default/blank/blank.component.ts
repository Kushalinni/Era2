import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { GlobalVariable } from '../../ghcm-global';
import { BlankVars } from './blank-vars';
import { GET_Service } from '../../../api/get.service';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { JADVars } from '../../job/job-advertisement-detail/job-advertisement-detail-vars';

@Component({
    selector: 'app-blank',
    templateUrl: './blank.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class BlankComponent implements OnInit, AfterViewInit {
    today: number = Date.now();
    usrLoginLvl = localStorage.getItem('userlevel');
    usrRole: string;
    dashboardAPI = BlankVars.dashboardAPI;

    constructor(private _GET_api_Service: GET_Service, private http: Http, private activeRoute: ActivatedRoute, private routers: Router) {
        this.getUserLoginInfo();
    }

    ngOnInit() {
        this.DashboardData();
    }

    data: any = {};
    myKey = new Array();
    myVal = new Array();
    chartData: any;

    byRoleKey = new Array();
    byRoleVal = new Array();
    byRoleUrl = new Array();
    byRoleColor = ['success', 'warning', 'primary', 'info', 'danger'];
    waitingEvaluate = BlankVars.waitingEvaluate;
    waitingInterview = BlankVars.waitingInterview;
    approvalRevert = BlankVars.approvalRevert;
    approvalHcbd = BlankVars.approvalHcbd;
    approvalHcbo = BlankVars.approvalHcbo;
    DashboardData() {
        //console.log(this.dashboardAPI);
        let excludeArr = ["approvalHcbd", "approvalHcbo", "approvalEvaluate", "approvalInterview", "approvalRevert"];
        this._GET_api_Service.GET_data(this.dashboardAPI).subscribe(data => {
            if (data.length == 1) {
                this.data = data[0];
            }
            for (var key in this.data) {
                let currKey = key;
                //--console.log('Type: ' +  key);
                //--console.log(key + ' => ' + this.data[key]);
                if (!excludeArr.some((e => e === currKey))) {
                    this.myKey.push(currKey);
                    this.myVal.push(this.data[key]);
                } else {
                    // approvalEvaluateo , approvalInterview , approvalRevert , approvalHcbd , approvalHcbo
                    switch (currKey.toLocaleUpperCase()) {
                        case 'APPROVALEVALUATE': this.byRoleKey.push(this.waitingEvaluate); this.byRoleUrl.push('job/advertisement-tracking/all'); break;
                        case 'APPROVALINTERVIEW': this.byRoleKey.push(this.waitingInterview); this.byRoleUrl.push('job/advertisement-tracking/all'); break;
                        case 'APPROVALREVERT': this.byRoleKey.push(this.approvalRevert); this.byRoleUrl.push('job/advertisement-tracking/all'); break;
                        case 'APPROVALHCBD': this.byRoleKey.push(this.approvalHcbd); this.byRoleUrl.push('job/pending-approval'); break;
                        case 'APPROVALHCBO': this.byRoleKey.push(this.approvalHcbo); this.byRoleUrl.push('job/pending-approval'); break;
                    }
                    this.byRoleVal.push(this.data[key]);
                }
                /*
                //console.log(this.myKey);console.log(this.myVal);
                this.chartData = {
                    labels: this.myKey,
                    datasets: [
                        {
                            data: this.myVal,                    
                            hoverBackgroundColor: [
                                "#FF6371", "#36A2EB", "#FFCE45", "#FF6371", "#36A2EB", "#FFCE45", "#FF6371", "#36A2EB", "#FFCE45", 
                            ],
                            backgroundColor: [
                                "#FF6371", "#36A2EB", "#FFCE45","#FF6371", "#36A2EB", "#FFCE45","#FF6371", "#36A2EB", "#FFCE45",
                            ]
                        }]    
                    }; */
            }
            //console.log(this.data);
            //console.log(this.data.length);
        },
            error => console.log('[ERROR - DashboardData] ' + error),
            // () => console.log('Done')
        );/* */

    }

    ngAfterViewInit() {
        /* (<any>$('#m_datepicker_6')).datepicker({
            todayHighlight: true,
            orientation: "bottom right",
            templates: {
                leftArrow: '<i class="la la-angle-left"></i>',
                rightArrow: '<i class="la la-angle-right"></i>'
            }
        }); */
    }

    getUserLoginInfo() {
        // console.log('masuk sini 7');
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token }); // 20180725
            this.usrLoginLvl = currentUser.userlevel;
            this.usrRole = currentUser.job_role;
        }
    }
    redirect(myUrl) {
        // this.routers.navigate(['job/advertisement-tracking/detail',job_id]);
        this.routers.navigate([myUrl]);
    }
}