import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';

declare let mLayout: any;
@Component({
    selector: "app-aside-nav",
    templateUrl: "./aside-nav.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AsideNavComponent implements OnInit, AfterViewInit {
    ttlVacant = 25;
    ttlAppReq = 10;
    ttlActvAdv = 5;
    jobLink: string;
    userRole: string;

    // JOB BUILDER LINKS
    jobBuilder = 'JOB BUILDER';
    jobBuilderShow = false;
    jobProfile = 'Job Profile';
    jobProfileShow = false;
    adsTracker = 'AdsTracker';
    adsTrackerShow = false;
    adsApproval = 'AdsPending Approval';
    adsApprovalShow = false;

    // JOB VACANCY LINKS
    jobAdv = 'Job Advertisement';
    jobAdvShow = false;
    vacList = 'Vacancy List';
    vacListShow = false;

    constructor() {

    }

    ngOnInit() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userRole = currentUser.job_role;
        if (this.userRole) {
            switch (this.userRole.toLocaleUpperCase()) {
                case 'HCBD':
                    this.jobBuilderShow = true;
                    this.jobProfileShow = true; this.adsTrackerShow = true; this.adsApprovalShow = false;
                    break;
                case 'HEADHCBD':
                    this.jobBuilderShow = true;
                    this.jobProfileShow = true; this.adsTrackerShow = true; this.adsApprovalShow = true;
                    break;
                case 'ADMINHCBO':
                    this.jobBuilderShow = true;
                    this.jobProfileShow = true; this.adsTrackerShow = true; this.adsApprovalShow = true;
                    break;
                case 'ADMINHCBO,HCBD':
                    this.jobBuilderShow = true;
                    this.jobProfileShow = true; this.adsTrackerShow = true; this.adsApprovalShow = true;
                    break;

                /*case 'HCBD':
                case 'HEADHCBD':
                case 'ADMINHCBO': 
                case 'ADMINHCBO,HCBD': 
                this.jobBuilderShow = true; this.jobAdvShow=false; this.vacListShow=false; break;
                case null:
                default: 
                    this.jobBuilderShow = false; this.jobAdvShow=true; this.vacListShow=true; break;*/
            }
        }

        // :start JOB BUILDER for Admin
        this.jobLink = currentUser.job_view;
        if (this.jobLink) {
            let arrJobView = (<string>this.jobLink).split(',');
            for (let i = 0; i < arrJobView.length; i++) {
                if (arrJobView[i].trim().match('JobProfile') !== null) {
                    this.jobProfileShow = true;
                } else if (arrJobView[i].trim().match('AdsTracker') !== null) {
                    this.adsTrackerShow = true;
                } else if (arrJobView[i].trim().match('AdsApproval') !== null) {
                    this.adsApprovalShow = true;
                }
            }
        }
        // :end JOB BUILDER for Admin

        //let headersComCat = new Headers();
        //headersComCat.append('token', currentUser.token);
    }

    ngAfterViewInit() {
        mLayout.initAside();
    }
}