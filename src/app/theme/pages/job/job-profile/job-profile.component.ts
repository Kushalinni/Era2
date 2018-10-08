import {
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation, ComponentFactoryResolver, Component, OnInit
} from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { GlobalVariable } from '../../ghcm-global';
import { Routes, Router } from '@angular/router';
import { POST_Service } from '../../../api/post.service';
import { AlertService } from '../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../auth/_directives/alert.component';
import { JPVars } from './job-profile-vars';
// C:\Projects\ghcm_portal\src\app\auth\_directives\alert.component.ts

@Component({
    selector: 'app-job-profile',
    templateUrl: './job-profile.component.html',
    encapsulation: ViewEncapsulation.None,
    // KALAU ADA CSS SENDIRI styleUrls:['/job-vacant.component.css']
})

export class JobProfileComponent {//} implements OnInit {
    title1 = JPVars.title1; title2 = JPVars.title2;
    apiUrl = JPVars.jobProfileSearchAPI;
    totalRes = '0';
    displayTbl = false; errNoResult = JPVars.errNoResult; errSearch = JPVars.errSearch;
    searchResult: string; searchResultStyle: string; searchResultIcon: string;

    data: any = {};
    param: string;
    name: string = '';
    found: boolean;
    public termPosId: string;
    public termName: string;
    public termStaffId: string;
    public termPos: string;
    public termStt: string;
    loading = false;

    @ViewChild('alertError',
        { read: ViewContainerRef }) alertError: ViewContainerRef;
    constructor(
        private _POST_api_Service: POST_Service,
        private http: Http, private routers: Router,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver) {
        //this.getJobProfile();
        //this.getProfileData();        
    }

    onNameKeyUp(event: any) {
        this.name = event.target.value;
        this.found = false;
        //console.log(event.target.value);
    }

    getJobAdvDetails(positionId) {
        this.routers.navigate(['job/detail', positionId]);
    }

    getProfile() {
        let data = {
            text: this.name
        }
        return this._POST_api_Service.POST_data(this.apiUrl, data);
    }

    getProfileData() {
        this.loading = true;
        this.getProfile().subscribe(data => {
            //console.log(data);
            this.data = data;
            this.totalRes = this.data.results.length;
            this.loading = false;
            this.displayTbl = true;
            if (this.data.results.length > 0) {
                this.searchResult = "Total Search Result: " + this.data.results.length;
                this.searchResultStyle = 'primary'; this.searchResultIcon = 'la-info-circle';
            } else {
                //this.showAlert('alertError');            
                //this._alertService.error(this.errNoResult);
                this.searchResult = this.errNoResult; this.searchResultStyle = 'warning'; this.searchResultIcon = 'la-warning';
            }
        },
            error => {
                this.showAlert('alertError');
                // this._alertService.error(error);
                this._alertService.error(this.errSearch);
                console.log('[ERROR] Search Job Profile: ' + error);
                this.loading = false;
            })
    }

    goToJobDetails(posId) {
        this.routers.navigate(['job/detail', posId]);
    }

    getStatusColor(status: string) {
        let ret: string;
        switch (status.toLocaleLowerCase()) {
            case 'occupied': ret = 'success'; break;
            case 'vacant': ret = 'warning'; break;
            default:
                ret = ''; break;
        }
        return ret;
    }
    //ngOnInit() {
    //} 

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }
}