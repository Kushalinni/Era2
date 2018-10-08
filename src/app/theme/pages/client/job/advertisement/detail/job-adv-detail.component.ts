import { Component, OnInit, AfterViewInit, ViewEncapsulation, Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Qualification, quaArr, ComLvl, comLvlArr, ComCluster, comClusterArr, ComCat, comCatArr, ComCom, comComArr } from "./arrCons";
import { GlobalVariable } from '../../../../ghcm-global';
import { JADVars } from './job-adv-detail-vars';
//import { IdleTimeoutService } from '../../../../_services/idleTimeout.service';
import { Helpers } from '../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';

declare let Dropzone: any;
declare var mWizard: any;
declare var thisPosId: any;
@Component({
    selector: 'app-job-adv-detail',
    templateUrl: './job-adv-detail.component.html',
    encapsulation: ViewEncapsulation.None,
})

@Injectable()
export class JobAdvDetailComponent implements OnInit, AfterViewInit {
    thisPosId = this.route.snapshot.paramMap.get('idx');
    thisPosApp = this.route.snapshot.paramMap.get('applied');
    title1 = JADVars.title1;
    title2 = JADVars.title2;
    tab1Title = JADVars.tab1Title;
    tab2Title = JADVars.tab2Title;
    tab3Title = JADVars.tab3Title;
    tab4Title = JADVars.tab4Title;
    tab5Title = JADVars.tab5Title;
    tab6Title = JADVars.tab6Title;
    tab7Title = JADVars.tab7Title;
    btnApply = JADVars.btnApply;
    applyBtnDisplay = false;
    posId2: string = '';// this.route.snapshot.paramMap.get('id');     //  
    advPosName: string = '';
    advPosIdx2: string = '';
    usrLoginLvl = 0;
    private apiUrl = GlobalVariable.BASE_API_URL;
    private baseApiToken = GlobalVariable.API_KEY;
    private token = '?api_key=' + this.baseApiToken;
    // view details    
    private getJobDataAPI = this.apiUrl + JADVars.vacDetails + this.token;
    // apply job
    private applyJobAPI = this.apiUrl + JADVars.vacApply + this.token;

    data: any = {};
    // Apply form
    applyPosForm: FormGroup;
    dataAdvPos: any = {};
    advPosMsg: string;
    applyAdvPos = false;
    advPosStyle: string;

    constructor(private http: Http, private route: ActivatedRoute, private formBuilder: FormBuilder, private _script: ScriptLoaderService) {
        this.getJobDetailData();
        this.getUserLoginInfo();
    }

    getJobDetail() {
        if (this.thisPosApp == '0') {
            this.applyBtnDisplay = true;
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let newPosId = this.route.snapshot.paramMap.get('idx');
        this.posId2 = newPosId;
        let data = {
            id: newPosId //this.posId2
        }
        return this.GetPostAPI(this.getJobDataAPI, data);
    }

    getJobDetailData() {
        this.getJobDetail().subscribe(data => {
            this.data = data;
            //console.log(this.data);
            this.applyPosForm.setValue({
                advPosIdx2: this.route.snapshot.paramMap.get('idx'),
                advPosName: data.profile[0].job_title,
            });
        })
    }

    ngOnInit() {
        if (this.route.snapshot.paramMap.get('applied') == '1') {
            this.applyAdvPos = false;
        }
        // SEND TO ADV FORM
        this.applyPosForm = new FormGroup({
            advPosIdx2: new FormControl(null, Validators.required),
            advPosName: new FormControl(null, Validators.required),
        });
        this.getJobDetailData();
    }

    ngAfterViewInit() {
        /*this._script.loadScripts('app-job-adv-detail',
        [
            'assets/js/jobs/job-details-form.js'
        ]);*/
        // Dropzone._autoDiscoverFunction();

    }

    /*
    ** START APPLY JOB POSITION
    */

    onapplyPosFormSubmit(): void {
        let advPosIdx2 = this.applyPosForm.get('advPosIdx2').value;
        let generalMsg = ' apply for ' + this.applyPosForm.get('advPosName').value;
        // console.log(advPosIdx2);
        this.dataAdvPos = {
            id: advPosIdx2
        }
        //console.log(this.applyJobAPI);
        let updQuaSend = this.GetPostAPI(this.applyJobAPI, this.dataAdvPos);
        let ret = updQuaSend.subscribe(dataQuaRes => {
            this.dataAdvPos = dataQuaRes;
            //console.log(this.dataAdvPos)
            if (this.dataAdvPos.status == "OK") {
                this.advPosMsg = 'Successfully' + generalMsg;
                this.advPosStyle = ' alert-success ';
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
            } else {
                this.advPosMsg = 'Fail to ' + generalMsg; //this.dataAdvPos.msg
                this.advPosStyle = ' alert-default ';
            }
            this.applyAdvPos = true;
            setTimeout(function() {
                this.applyAdvPos = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })
    }
    /** END APPLY JOB POSITION **/

    GetPostAPI(myAPI, myData) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let headersComCat = new Headers();
        headersComCat.append('token', currentUser.token);
        headersComCat.append('Content-Type', 'application/json');
        let optionsComCat = new RequestOptions({ headers: headersComCat });
        // console.log(myAPI);
        return this.http.post(myAPI, myData, optionsComCat)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                if (error.status === 500) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 400) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 409) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 406) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 304) {
                    return Observable.throw(new Error(error.status));
                } else if (error.status === 422) {
                    //console.log("Already advertise");
                    return Observable.throw(new Error(error.status));
                }
            });
    }

    getUserLoginInfo() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            this.usrLoginLvl = currentUser.userlevel;
        }
    }
}

