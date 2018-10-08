import {
    ViewChild,
    ViewContainerRef, Component, ComponentFactoryResolver, OnInit, AfterViewInit, ViewEncapsulation, Injectable
} from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { Router, Routes, RouterModule, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Qualification, quaArr, ComLvl, comLvlArr, ComCluster, comClusterArr, ComCat, comCatArr, ComCom, comComArr } from "./arrCons";
import { GlobalVariable } from '../../ghcm-global';
import { JADVars } from './job-advertisement-detail-vars';
//import { IdleTimeoutService } from '../../../../_services/idleTimeout.service';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { POST_Service } from '../../../api/post.service';
import { DatePipe } from '@angular/common';
import { AlertService } from '../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../auth/_directives/alert.component';

declare let Dropzone: any;
declare var mWizard: any;
declare var thisPosId: any;
@Component({
    selector: 'app-job-advertisement-detail',
    templateUrl: './job-advertisement-detail.component.html',
    encapsulation: ViewEncapsulation.None,
})

@Injectable()
export class JobAdvertisementDetailComponent implements OnInit, AfterViewInit {
    loading = true;

    dataUpdPurpose: any = {};
    test: any;
    // all data array
    data: {}; aor: {}; functional: {}; profile: {}; purpose: {}; info: {};
    qualification: {}; requirements: {}; success: {}; technical: {}; history: {};
    applicant: any; interviewee: {};

    // panel title
    title1 = JADVars.title1; title2 = JADVars.title2; title3 = JADVars.title3; title4 = JADVars.title4;
    title5 = JADVars.title5; title6 = JADVars.title6; title7 = JADVars.title7; title8 = JADVars.title8;

    // default error message
    errNoData = JADVars.errNoData;
    errNoApplicant = JADVars.errNoApplicant;

    // Action for iview list
    btnCallIview = JADVars.btnCallIview;
    aplcPanel = JADVars.showPanelApplList; // show or hide panel based on advertisement status
    aplcAct = JADVars.aplcAct; // choose applicant from list and also submit button (multiple choose)
    aplcSubmit = JADVars.aplcSubmit;
    aplcStatus = JADVars.aplcStatus;
    formSelAppl: FormGroup;

    // Action for Iview List
    btnAcceptForPosition = JADVars.btnAcceptForPosition;
    iviewPanel = JADVars.iviewPanel; // show or hide panel based on advertisement status
    iviewAct = JADVars.iviewAct; // choose applicant from list and also submit button (multiple choose)
    iviewSubmit = JADVars.iviewSubmit; // disable submit button if applicant selected <1
    iviewStatus = JADVars.iviewStatus;
    formSelIview: FormGroup;

    showPanelApplList = false; showPanelIviewList = false;
    btnApprove = false; btnReject = false; btnRevert = false; disableSubmitAdv = true;
    chooseApplicant = false; // hide action to choose applicant from list
    chooseSuccesIview = false; // hide action to choose successful interview applicant
    resubmitAdv = false; // hide resubmit action panel

    advStatus = 0; // advertisement status
    apprRemark = false; errAdvPeriod = false;
    idx: string;
    clickAct: string;
    pendApprForm: FormGroup;
    msgAdvPeriod = '';// 'Please select start date and end date';
    actAPIUrl: string;
    actHCBD = JADVars.actApprHCBD;
    actHCBO = JADVars.actApprHCBO;
    //actType = 0; // 1-HEADHCBD; 2:ADMINHCBO
    apprPosMsg: string; apprStyle: string; apprReq = false; dataAdvPos: any = {};// Message approval

    advExpDate = JADVars.advExpDate;
    advExceedDate = JADVars.advExceedDate;
    advErrMsg: string;
    advPeriod = false;
    //private apiUrl = GlobalVariable.BASE_API_URL;
    //private baseApiToken = GlobalVariable.API_KEY;
    //private token = '?api_key=' + this.baseApiToken;
    //private getJobDataAPI = this.apiUrl + JADVars.jobProfById + this.token;

    @ViewChild('alertError',
        { read: ViewContainerRef }) alertError: ViewContainerRef;
    constructor(
        private routers: Router, private _POST_api_Service: POST_Service,
        private datePipe: DatePipe, private http: Http, private activeRoute: ActivatedRoute,
        private formBuilder: FormBuilder, private _script: ScriptLoaderService,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver) {
        //this.getJobDetailData();
        //this.getUserLoginInfo();
    }

    getJobDetail(idx) {
        let data = {
            id: idx //this.posId2
        }
        return this._POST_api_Service.POST_data(JADVars.jobProfById, data); //this.POSTMethodByAPI(this.getJobDataAPI, data);
    }

    errLoadData = JADVars.errLoadData;
    getJobDetailData(idx) {
        this.getJobDetail(idx).subscribe(data => {
            console.log(data);
            this.loading = false;

            /*  console.log(data.purpose);
             console.log(data.purpose.length);
             if(data.purpose.length == 0){
                 console.log('p = null');
             }else{
                 console.log('p = ' + data.purpose);
             }
             if(data.purpose.length == 0){
                 this.purpose='No Date';
             }else{
                 this.purpose=data.purpose;
             }*/

            this.data = data;
            if (data.info.length == 0) {
                this.info = 'err';//=this.errNoData;
            } else {
                //console.log(this.info);
                this.info = data.info;
                this.pendApprForm.setValue({
                    advId: idx,//data.profile[0].position_id,
                    advRemark: '',
                    //advStartDt: this.datePipe.transform(this.info[0].start, "MM-dd-yyyy"),
                    //advEndDt: this.datePipe.transform(this.info[0].close, "MM-dd-yyyy"),
                    advApprove: '',
                    advDtRange: this.datePipe.transform(this.info[0].start, "MM-dd-yyyy") + " to " +
                        this.datePipe.transform(this.info[0].close, "MM-dd-yyyy")
                });
                this.advStatus = this.info[0].status;
                //console.log(this.advStatus);
                //this.setAllowedAction();
            }
            if (data.profile.length == 0) {
                this.profile = 'err';
            } else {
                this.profile = data.profile;
                this.setAllowedAction(data.profile[0].isOwner, data.profile[0].status);
            }
            if (data.purpose.length == 0) {
                this.purpose = 'err';//=this.errNoData;
            } else { this.purpose = data.purpose[0].job_purpose; }
            if (data.qualification.length == 0) {
                this.qualification = 'err';//=this.errNoData;
            } else { this.qualification = data.qualification; }
            if (data.technical.length == 0) {
                this.technical = 'err';//=this.errNoData;
            } else { this.technical = data.technical; }
            if (data.aor.length == 0) {
                this.aor = 'err';//=this.errNoData;
            } else { this.aor = data.aor; }
            if (data.requirements.length == 0) {
                this.requirements = 'err';//=this.errNoData;
            } else { this.requirements = data.requirements; }
            if (data.history.length == 0) {
                this.history = 'err';//=this.errNoData;
            } else { this.history = data.history; }
            if (data.applicants.length == 0) {
                this.applicant = 'err';//=this.errNoData;
            } else {
                this.applicant = data.applicants;
            }
            if (data.interviewee.length == 0) {
                this.interviewee = 'err';//=this.errNoData;
            } else { this.interviewee = data.interviewee; }
        },
            error => {
                this.showAlert('alertError');
                // this._alertService.error(error);
                this._alertService.error(this.errLoadData);
                console.log('[ERROR] Adv Details: ' + error);
                this.loading = false;
            })

    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    checkAdvPeriod() {
        let today = this.datePipe.transform(new Date(), 'MM-dd-yyyy'); // new Date();
        //console.log(this.info);
        if (this.info[0]) {
            let st = this.datePipe.transform(this.info[0].start, "MM-dd-yyyy");
            let ed = this.datePipe.transform(this.info[0].close, "MM-dd-yyyy");
            if (today > st) {
                //console.log("Expired");
                return 3;
            } else {
                //console.log("Not Expired");
                let durationHours = new Date(this.info[0].close).getTime() - new Date(this.info[0].start).getTime();
                let duration = ((durationHours / (3600 * 1000)) / 24) + 1;
                if (duration > 14) {
                    console.log("Exceed date limit (14 days) : " + duration);
                    return 2;
                } else {
                    return 1;
                }
            }
        }
    }

    ngOnInit() {

        this.idx = this.activeRoute.snapshot.paramMap.get('id');
        this.pendApprForm = new FormGroup({
            advId: new FormControl(null, Validators.required),
            advRemark: new FormControl(),
            //advStartDt: new FormControl(null, Validators.required),
            //advEndDt: new FormControl(null, Validators.required),
            advApprove: new FormControl(null, Validators.required),
            advDtRange: new FormControl(),
        });

        this.resubmitForm = new FormGroup({
            advId: new FormControl(null, Validators.required),
            advRemark: new FormControl(),
            advResubmit: new FormControl(null, Validators.required),
            advDtRange: new FormControl(),
        });

        this.formSelAppl = new FormGroup({
            //applAdvId: new FormControl(null, Validators.required),
            appl: new FormControl(null, Validators.required),
        });
        this.formSelIview = new FormGroup({
            iview: new FormControl(null, Validators.required),
        });

        this.applInfoForm = new FormGroup({
            applId: new FormControl(null, Validators.required),
            applType: new FormControl(null, Validators.required),
            applIndex: new FormControl(null, Validators.required),
        });

        this.getJobDetailData(this.idx);
    }

    setAllowedAction(isOwner, advStatus) {
        let displayState = this.activeRoute.snapshot.paramMap.get('display-state');

        /*switch (displayState) {
            case 'advertisement-tracking':
                this.showPanelApplList = true; this.showPanelIviewList = true;
                this.btnApprove = false; this.btnReject = false;
                break;
            case 'pending-approval':
                this.showPanelApplList = false; this.showPanelIviewList = false;
                break;
        }*/

        if ((displayState == 'advertisement-tracking') && (this.advStatus == 3) || (this.advStatus == 4) || (this.advStatus == 5) || (this.advStatus == 6) || (this.advStatus == 14)) {
            this.showPanelApplList = true; this.showPanelIviewList = true;
            this.btnApprove = false; this.btnReject = false;
        }
        if ((displayState == 'advertisement-tracking') && (this.advStatus == 3) || (this.advStatus == 4)) {
            this.showPanelIviewList = false;
        }
        console.log(displayState); console.log(this.advStatus); console.log(isOwner);
        switch (JSON.parse(localStorage.getItem('currentUser')).job_role.toLocaleUpperCase()) {
            case 'HCBD':
                if ((displayState == 'advertisement-tracking') && (this.advStatus == 4) && (isOwner == 1)) { // Evaluate - choose applicant
                    this.chooseApplicant = true; this.aplcAct = true;
                    //this.aplcSubmit = true;
                }
                if ((displayState == 'advertisement-tracking') && (this.advStatus == 5) && (isOwner == 1)) { // Evaluate - choose applicant
                    this.chooseApplicant = true; this.iviewAct = true;
                }
                if ((displayState == 'advertisement-tracking') && ((this.advStatus == 15) || (this.advStatus == 16)) && (isOwner == 1)) { // Resubmit job adv (after reverted)
                    this.resubmitAdv = true;
                }
                break;
            case 'HEADHCBD':
                if ((displayState == 'pending-approval') && (this.advStatus == 1)) { // pending approval
                    this.btnApprove = true; this.btnReject = true; this.btnRevert = true;
                    this.actAPIUrl = this.actHCBD; //this.actType = 1;
                }
                break;
            case 'ADMINHCBO':
                if ((displayState == 'pending-approval') && (this.advStatus == 2)) {
                    this.btnApprove = true; this.btnReject = true; this.btnRevert = true;
                    this.actAPIUrl = this.actHCBO; //this.actType = 2;
                }
                break;
            case 'ADMINHCBO,HCBD':
                if ((displayState == 'advertisement-tracking') && (this.advStatus == 4) && (isOwner == 1)) { // Evaluate - choose applicant
                    this.chooseApplicant = true; this.aplcAct = true;
                    //this.aplcSubmit = true;
                }
                if ((displayState == 'advertisement-tracking') && (this.advStatus == 5) && (isOwner == 1)) { // Evaluate - choose applicant
                    this.chooseApplicant = true; this.iviewAct = true;
                }
                if ((displayState == 'advertisement-tracking') && ((this.advStatus == 15) || (this.advStatus == 16)) && (isOwner == 1)) { // Resubmit job adv (after reverted)
                    this.resubmitAdv = true;
                }
                if ((displayState == 'pending-approval') && (this.advStatus == 2)) {
                    this.btnApprove = true; this.btnReject = true; this.btnRevert = true;
                    this.actAPIUrl = this.actHCBO; //this.actType = 2;
                }
                break;
        }
        //console.log(this.btnApprove);
    }

    setcheckAdvPeriod() {
        this.advPeriod = true;
    }
    showErrMsg = false;
    setApprove(act) {
        if (act == '1') {
            this.clickAct = 'Approve';
            this.apprRemark = false; //this.showErrMsg=true;
            let checkAdvPeriod = this.checkAdvPeriod();
            if (checkAdvPeriod == 1) { // date OK
                this.advPeriod = true;
            } else {
                this.advPeriod = false; this.showErrMsg = true;
                if (checkAdvPeriod == 2) { // exceed 60 days
                    this.advErrMsg = this.advExceedDate;
                } else if (checkAdvPeriod == 3) { // expired
                    this.advErrMsg = this.advExpDate;
                }
            }
        } else if (act == '2') {
            this.clickAct = 'Reject';
            this.apprRemark = true; this.advPeriod = true;
        } else if (act == '3') {
            this.clickAct = 'Revert';
            this.apprRemark = true; this.advPeriod = true;
        }
        this.pendApprForm.setValue(
            {
                advId: this.idx,
                advRemark: '',
                // advStartDt: this.datePipe.transform(this.info[0].start, "MM-dd-yyyy"),
                // advEndDt: this.datePipe.transform(this.info[0].close, "MM-dd-yyyy"),
                advApprove: act,
                advDtRange: this.datePipe.transform(this.info[0].start, "MM-dd-yyyy") + " to " +
                    this.datePipe.transform(this.info[0].close, "MM-dd-yyyy")
            });
        this.checkIsOccupied();
    }

    advErrMsg2: string;
    checkIsOccupied() {
        //console.log("test");
        //console.log(this.profile[0].Occupied);
        if (this.profile && this.profile[0].Occupied == 1) {
            this.showErrMsg = true;
            this.advErrMsg2 = JADVars.advIsOccupied;
        }
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-job-advertisement-detail',
            [
                'assets/js/jobs/job-details-form.js',
                'assets/js/jobs/job-adv-details-alert.js',
            ]);
        Dropzone._autoDiscoverFunction();

    }

    pendApprFormFormSubmit() {
        let advId = this.pendApprForm.get('advId').value;
        let advRemark = this.pendApprForm.get('advRemark').value;
        let advApprove = this.pendApprForm.get('advApprove').value;

        let advDtRange = ''; let advStartDt = ''; let advEndDt = '';
        if (document.getElementById("advDtRange")) {
            advDtRange = ((document.getElementById("advDtRange") as HTMLInputElement).value); // this.pendApprForm.get('advDtRange').value;
            advStartDt = advDtRange.substr(0, 10);//this.pendApprForm.get('advStartDt').value;
            advEndDt = advDtRange.substr(14, 10); //this.pendApprForm.get('advEndDt').value;
        } else {
            let today = Date();
            advStartDt = this.datePipe.transform(today, "MM-dd-yyyy");
            advEndDt = advStartDt;
        }

        /* console.log(advApprove); console.log(advDtRange);
        console.log(advStartDt); console.log(advEndDt);
        console.log(this.actAPIUrl); console.log(advId);
        console.log(advRemark); console.log(advStartDt);
        console.log(advEndDt); console.log(advApprove);*/
        let apprData = {
            'id': advId,
            'start': advStartDt,
            'close': advEndDt,
            'remark': advRemark,
            'approve': advApprove
        }
        let generalMsg = "";
        if (advApprove == '1') {
            generalMsg = 'Approved.'
        } else if (advApprove == '2') {
            generalMsg = 'Rejected.'
        } else if (advApprove == '3') {
            generalMsg = 'Reverted.'
        }

        let apprSend = this._POST_api_Service.POST_data(this.actAPIUrl, apprData);
        let ret = apprSend.subscribe(dataQuaRes => {
            this.dataAdvPos = dataQuaRes;
            if (this.dataAdvPos && this.dataAdvPos.status == "OK") {
                this.apprPosMsg = 'Advertisement Request has been ' + generalMsg;
                this.apprPosMsg += ' You will be redirected to Pending Approval List page shortly. ';
                //this.apprPosMsg += " [<a href=\"#\">Click Here</a>] to go now.";
                this.apprStyle = ' alert-success ';
                this.btnApprove = false; this.btnReject = false; this.btnRevert = false;
                this.apprReq = true;
                setTimeout(function() {
                    this.apprReq = false;
                    this.routers.navigate(['job/pending-approval']);
                }.bind(this), 3000); //wait 3 Seconds and hide
            } else {
                this.apprPosMsg = 'Fail to perform request.'; //this.dataAdvPos.msg
                this.apprStyle = ' alert-danger  ';
                this.apprReq = true;
            }
        },
            error => {
                console.log('[ERROR] Job Profile: ' + generalMsg + ' - ' + error);
                this.apprPosMsg = 'Fail to perform request. Please contact your administrator.'; //this.dataAdvPos.msg
                this.apprStyle = ' alert-danger  ';
                this.apprReq = true; this.btnApprove = false; this.btnReject = false; this.btnRevert = false;
            })
    }

    checkedList = [];
    onCheckboxChange(option, event) {
        if (event.target.checked) {
            //console.log("checked");
            this.checkedList.push(option.id);
        } else {
            //console.log("UN-checked");
            //console.log("VALUE :"+option.id);
            for (var i = 0; i < this.checkedList.length; i++) {
                if (this.checkedList[i] == option.id) {
                    //console.log("INDEX :"+i);
                    this.checkedList.splice(i, 1);
                }
            }
        }
        //console.log(this.checkedList);
        this.countCheckbox();
        /*
        if (this.checkedList.length < 1) {
            this.aplcSubmit = false;
        } else {
            this.aplcSubmit = true;
        }*/
    }

    /** START: SELECT APPLICANT FOR INTERVIEW */
    applInfoForm: FormGroup;
    applName: string;
    applSelType: string;
    applId: string;
    applIndex: string;
    applLoading: boolean;
    applProfile: object;
    applHistory: object;
    applJobProfile: object;
    openApplicantInfo(type, applId, applIndex) {
        // Remarks: We use applId because it shows the actual index of the user being call
        let data = {
            id: applId
        };
        let applDetailsSend = this._POST_api_Service.POST_data(JADVars.getApplicantDetailsAPI, data);

        // Activate the loading icon
        //this.applInfoForm.setValue ({applId: applId, applIndex: applIndex, applType: type});
        this.applLoading = true;
        this.applName = `Applicant Information - ${applId}`;

        let res = applDetailsSend.subscribe(dataQuaRes => {
            this.applProfile = dataQuaRes.profile[0];
            this.applHistory = dataQuaRes.history;
            this.applJobProfile = dataQuaRes.jobProfile;
            console.log(dataQuaRes.jobProfile);

            this.applName = `Applicant Information - ${dataQuaRes.profile[0].Pernr_Name}`;
            this.applSelType = type;
            this.applId = applId;
            this.applIndex = applIndex;
            this.applLoading = false;
            this.applInfoForm.setValue({ applId: applId, applIndex: applIndex, applType: type });

        }, error => {
            console.error("Failed to get information for user " + applId);
        });
    }
    applInfoFormSubmit(): void {
        let selId = this.applInfoForm.get('applId').value;
        let applIndex = this.applInfoForm.get('applIndex').value;
        let selType = this.applInfoForm.get('applType').value;
        //console.log(selId); console.log(applIndex); console.log(selType);
        if (selType.match('forInterview') != null) {
            //console.log(selId);
            this.checkedList.push(selId);
            this.countCheckbox();
        } else if (selType.match('forSuccess') != null) {
            // TODO
            // Check radio
            //console.log(selId);
            this.selRadioSucc = selId;
            this.countRadio();
        }
        //console.log(this.checkedList);
    }
    countCheckbox() {
        if (this.checkedList.length < 1) {
            this.aplcSubmit = false;
        } else {
            this.aplcSubmit = true;
        }
    }
    countRadio() {
        if (this.selRadioSucc != 0) {
            this.iviewSubmit = true;
        }
    }

    // send list for iview
    selectApplicantForIviewAPI = JADVars.selectApplicantForIviewAPI;
    selApplReq = false;
    selectApplicant() {
        //console.log(this.idx);  console.log(this.checkedList);
        let data2 = {
            adv_id: this.idx,
            id: this.checkedList
        }
        let updPurposeSend = this._POST_api_Service.POST_data(JADVars.selectApplicantForIviewAPI, data2);
        let ret = updPurposeSend.subscribe(dataQuaRes => {
            this.dataAdvPos = dataQuaRes;
            if (this.dataAdvPos && this.dataAdvPos.status == "OK") {
                this.apprPosMsg = 'Selected applicants has been processed';
                this.apprStyle = ' alert-success ';
                this.selApplReq = true;
                this.getJobDetailData(this.idx);
                this.checkedList = [];
                this.aplcAct = false;
                setTimeout(function() {
                    this.selApplReq = false;
                }.bind(this), 3000); //wait 3 Seconds and hide
            } else {
                this.apprPosMsg = 'Fail to perform request.';
                this.apprStyle = ' alert-danger  ';
                this.selApplReq = true;
            }
        },
            error => {
                console.log('[ERROR] Select Applicant for Interview' + ' - ' + error);
                this.apprPosMsg = 'Fail to perform request. Please contact your administrator.'; //this.dataAdvPos.msg
                this.apprStyle = ' alert-danger  ';
                this.apprReq = true; this.btnApprove = false; this.btnReject = false; this.btnRevert = false;
            })
    }
    /** END: SELECT APPLICANT */

    /** :start SELECT SUCCESS IVIEW */
    selIviewReq = false; // DIsplay message success/fail
    selRadioSucc = 0;
    onRadioSelect(option, event) {
        //console.log(event);
        if (event.target.checked) {
            this.selRadioSucc = option.id;
        }
        this.countRadio();
        /*if (this.selRadioSucc!=0){
            this.iviewSubmit=true;
        }*/
        //console.log(this.selRadioSucc);
    }

    selectSuccessIview() {
        let data2 = {
            adv_id: this.idx,
            id: (this.selRadioSucc).toString()
        }
        let updPurposeSend = this._POST_api_Service.POST_data(JADVars.selectSuccessFromIviewAPI, data2);
        let ret = updPurposeSend.subscribe(dataQuaRes => {
            this.dataAdvPos = dataQuaRes;
            if (this.dataAdvPos && this.dataAdvPos.status == "OK") {
                this.apprPosMsg = 'Selected applicants has been processed';
                this.apprStyle = ' alert-success ';
                this.selIviewReq = true;
                this.iviewAct = false;
                this.getJobDetailData(this.idx);
                this.selRadioSucc = 0;
                setTimeout(function() {
                    this.selIviewReq = false;
                }.bind(this), 3000); //wait 3 Seconds and hide
            } else {
                this.apprPosMsg = 'Fail to perform request.';
                this.apprStyle = ' alert-danger  ';
                this.selIviewReq = true;
            }
        },
            error => {
                console.log('[ERROR] Select Applicant for Interview' + ' - ' + error);
                this.apprPosMsg = 'Fail to perform request. Please contact your administrator.'; //this.dataAdvPos.msg
                this.apprStyle = ' alert-danger  ';
                this.apprReq = true; this.btnApprove = false; this.btnReject = false; this.btnRevert = false;
            })
    }
    /** :end SELECT SUCCESS IVIEW */

    /** :start Resubmit/Withdraw Advertisement */
    btnReSubmit = JADVars.btnReSubmit;
    btnWithDraw = JADVars.btnWithDraw;
    apiResubmit = JADVars.apiResubmit;
    clickResubmit = "";
    resubmitForm: FormGroup;
    resubmitRemark = false;
    setResubmit(act) {
        let subAct = "";
        if (act == '1') {
            subAct = "true";
            this.clickResubmit = 'resubmit';
            this.resubmitRemark = false;
            //document.getElementById("m_modal_resubmit");
            let checkAdvPeriod = this.checkAdvPeriod();
            if (checkAdvPeriod == 1) { // date OK
                this.advPeriod = true;
            } else {
                this.advPeriod = false; this.showErrMsg = true;
                if (checkAdvPeriod == 2) { // exceed 60 days
                    this.advErrMsg = this.advExceedDate;
                } else if (checkAdvPeriod == 3) { // expired
                    this.advErrMsg = this.advExpDate;
                }
            }
        } else if (act == '0') {
            subAct = "false"; this.clickResubmit = 'withdraw'; this.resubmitRemark = true; this.advPeriod = true;
        }
        this.resubmitForm.setValue(
            {
                advId: this.idx,
                advRemark: this.info[0].remark,
                advResubmit: act,
                advDtRange: this.datePipe.transform(this.info[0].start, "MM-dd-yyyy") + " to " +
                    this.datePipe.transform(this.info[0].close, "MM-dd-yyyy")
            });
        this.checkIsOccupied();
    }

    resubmitReq = false; resubmitStyle: string; resubmitPosMsg: string; resubmitButton = true;
    resubmitFormSubmit() {
        let advId = this.resubmitForm.get('advId').value;
        let advRemark = this.resubmitForm.get('advRemark').value;
        let advResubmit = this.resubmitForm.get('advResubmit').value;

        let advDtRangeb = ''; let advStartDt = ''; let advEndDt = '';
        if (document.getElementById("advDtRangeb")) {
            advDtRangeb = ((document.getElementById("advDtRange") as HTMLInputElement).value); // this.pendApprForm.get('advDtRangeb').value;
            advStartDt = advDtRangeb.substr(0, 10);//this.pendApprForm.get('advStartDt').value;
            advEndDt = advDtRangeb.substr(14, 10); //this.pendApprForm.get('advEndDt').value;
        } else {
            let today = Date();
            advStartDt = this.datePipe.transform(today, "MM-dd-yyyy");
            advEndDt = advStartDt;
        }

        let generalMsg = "";
        let advResubmit2: boolean;
        if (advResubmit == '1') {
            generalMsg = 'Resubmit.'; advResubmit2 = true;
        } else if (advResubmit == '0') {
            generalMsg = 'Withdraw.'; advResubmit2 = false;
        }

        //console.log(this.apiResubmit); console.log(advId); console.log(advRemark); console.log(advStartDt); 
        //console.log(advEndDt); console.log(advResubmit);console.log(advResubmit2);
        let apprData = {
            'id': advId,
            'start': advStartDt,
            'close': advEndDt,
            'remark': advRemark,
            'resubmit': advResubmit2
        }

        let apprSend = this._POST_api_Service.POST_data(this.apiResubmit, apprData);
        let ret = apprSend.subscribe(dataQuaRes => {
            this.dataAdvPos = dataQuaRes;
            if (this.dataAdvPos && this.dataAdvPos.status == "OK") {
                this.resubmitPosMsg = 'Advertisement Request has been ' + generalMsg;
                this.resubmitPosMsg += ' You will be redirected to Advertisement Tracking List page shortly. ';
                this.resubmitStyle = ' alert-success ';
                //this.btnApprove = false; this.btnReject = false; this.btnRevert = false;
                this.resubmitReq = true; this.resubmitButton = false;
                setTimeout(function() {
                    this.resubmitReq = false;
                    this.routers.navigate(['job/advertisement-tracking/all']);
                }.bind(this), 3000); //wait 3 Seconds and hide
            } else {
                this.resubmitPosMsg = 'Fail to perform request.'; //this.dataAdvPos.msg
                this.resubmitStyle = ' alert-danger  ';
                this.resubmitReq = true;
            }
        },
            error => {
                console.log('[ERROR] Job Profile: ' + generalMsg + ' - ' + error);
                this.resubmitPosMsg = 'Fail to perform request. Please contact your administrator.'; //this.dataAdvPos.msg
                this.resubmitStyle = ' alert-danger  ';
                this.resubmitReq = true; this.btnApprove = false; this.btnReject = false; this.btnRevert = false;
            })
    }
    /** :end Resubmit/Withdraw Advertisement */

}

