import {
    ViewChild, ViewContainerRef, ComponentFactoryResolver, Component, OnInit,
    AfterViewInit, ViewEncapsulation, Injectable
} from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Requestor, reqArr, Qualification, quaArr, ComLvl, comLvlArr, ComCluster, comClusterArr, ComCat, comCatArr, ComCom, comComArr } from "./arrCons";
import { GlobalVariable } from '../../ghcm-global';
import { JDVars } from './job-detail-vars';
//import { IdleTimeoutService } from '../../../../_services/idleTimeout.service';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { POST_Service } from '../../../api/post.service';
import { GET_Service } from '../../../api/get.service';
import { AlertService } from '../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../auth/_directives/alert.component';

declare let Dropzone: any;
declare var mWizard: any;
declare var thisPosId: any;
@Component({
    selector: 'app-job-detail',
    templateUrl: './job-detail.component.html',
    encapsulation: ViewEncapsulation.None,
})

@Injectable()
export class JobDetailComponent implements OnInit, AfterViewInit {
    loading = true;
    msgOccupied = JDVars.msgOccupied;
    msgDefault = JDVars.msgDefault;

    usrLoginLvl = 0;
    // Advertise property
    advBtnDisplay = true;
    advDisabled = true;
    btnAdvertise = JDVars.btnAdvertise;
    editedAdvPos = false;
    disableSubmitAdv = true;
    msgAdvPeriod = JDVars.msgAdvPeriod;

    applyAdvPos: string;
    // Approve/ Decline property

    // Apply property
    applyBtnDisplay: string;
    updFormTechComTitle: string;
    errLevel = false;

    //private apiUrl = GlobalVariable.BASE_API_URL;
    //private baseApiToken = GlobalVariable.API_KEY;
    //private token = '?api_key=' + this.baseApiToken;
    //private getJobDataAPI = this.apiUrl + JDVars.jobProfById + this.token;
    private getJobDataAPI = JDVars.jobProfById;

    thisPodId = this.route.snapshot.paramMap.get('id');
    data: any = {};
    posId2: string;
    tab1Title = JDVars.tab1Title; tab2Title = JDVars.tab2Title;
    tab3Title = JDVars.tab3Title; tab4Title = JDVars.tab4Title;
    tab5Title = JDVars.tab5Title; tab6Title = JDVars.tab6Title;
    tab7Title = JDVars.tab7Title; tab8Title = JDVars.tab8Title;
    noData = JDVars.noData;

    title1 = JDVars.title1; title2 = JDVars.title2;

    failDataDef = '-- Fail to Fetch Data --';
    comClusOptDef = '-- Select Cluster --';
    comCatOptDef = '-- Select Category --';
    comCompOptDef = '-- Select Competency --';
    comCompDefinitionDef: string;
    comLvlOptDef = '-- Select Level --';

    // populate qualification list
    quaList = Array<quaArr>();
    qualification: Qualification = new Qualification();

    // populate technical Competency - job cluster
    comCluster: ComCluster = new ComCluster();
    comClusterList = Array<comClusterArr>();
    // populate technical competecny - job category
    comCat: ComCat = new ComCat();
    comCatList = Array<comCatArr>();
    // populate technical Competency - competency
    comCom: ComCom = new ComCom();
    comComList = Array<comComArr>();
    // competency definition
    comComDef: string;
    // populate technical Competency - level
    comlvl: ComLvl = new ComLvl();
    comLvlList = Array<comLvlArr>();

    /* :start Only HCBD Can Update Job Profile */
    toUpdPurpose = false; toUpdQua = false;
    toUpdTech = false; toUpdAOR = false;
    toUpdExp = false; toAdvJob = false;
    /* :end Only HCBD Can Update Job Profile */

    canUpdPosDesc = false;

    constructor(private routers: Router, private _GET_api_Service: GET_Service,
        private _POST_api_Service: POST_Service, private http: Http,
        private route: ActivatedRoute, private formBuilder: FormBuilder,
        private _script: ScriptLoaderService,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver) {
        this.getJobDetailData();
        this.getRequestor();
        //this.routers.navigate(['job/advertisement-tracking/all']);          
    }

    getJobDetail() {
        let newPosId = this.route.snapshot.paramMap.get('id');
        this.posId2 = newPosId;
        let data = {
            positionId: newPosId //this.posId2
        }
        return this._POST_api_Service.POST_data(this.getJobDataAPI, data);
    }

    advDisableMsg = JDVars.advDisableMsg;
    showAdvDisableMsg = false;
    errLoadData = JDVars.errLoadData;
    getJobDetailData() {
        let jobPurpose = "";
        this.getJobDetail().subscribe(data => {
            console.log(data);
            this.data = data;
            this.loading = false;
            try {
                if (data.purpose.length > 0) {
                    jobPurpose = data.purpose[0].job_purpose;
                }
            }
            catch (e) {
                console.log("[ERROR] Populate Job Details Data: " + e);
            }
            //console.log(data.purpose[0].job_purpose.length);

            // : GHCMDP-497 only job purpose and aor are required to submit advertisement
            // if (data.purpose[0].job_purpose.length<1||data.qualification.length<1||data.technical.length<1||
            if (data.purpose[0].job_purpose.length < 1 || data.aor.length < 1) {
                this.advDisabled = true; this.showAdvDisableMsg = true;
            } else {
                this.advDisabled = false; this.showAdvDisableMsg = false;
            }

            this.updPosDescForm.setValue({
                updPosDesc: data.profile[0].position_desc,
                updPosDescPosId: data.profile[0].position_id
            });

            this.updPurposeForm.setValue({
                updPurpose: jobPurpose,
                updPurposePosId: data.profile[0].position_id
            });
            this.advPosForm.setValue({
                advPosIdx2: data.profile[0].position_id,
                advPosRemark: '',
                advPosStartDt: '',
                advPosEndDt: '',
                advPosStartDt2: '',
                advPosEndDt2: '',
                advPosDtRange: '',
                advPosRemarkCheckBox: '',
                advPosRequestor: '',
            });

            // :: check user's job role
            let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role.toLocaleUpperCase());
            if (usrRole == 'HCBD' || usrRole == 'ADMINHCBO,HCBD') {
                this.toUpdPurpose = true;
                this.toUpdQua = true;
                this.toUpdTech = true;
                this.toUpdAOR = true;
                this.toUpdExp = true;
                this.toAdvJob = true;
            }
        },
            error => {
                this.showAlert('alertError');
                // this._alertService.error(error);
                this._alertService.error(this.errLoadData);
                console.log('[ERROR] Adv Details: ' + error);
                this.loading = false;
            })

        switch (JSON.parse(localStorage.getItem('currentUser')).job_role.toLocaleUpperCase()) {
            case 'HCBD':
            case 'ADMINHCBO,HCBD': this.canUpdPosDesc = true;
                break;
        }
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    ngOnInit() {
        this.getJobDetailData();

        // UPDATE POSITION DESCRIPTION FORM
        this.updPosDescForm = new FormGroup({
            updPosDesc: new FormControl(null, Validators.required),//minLength(2)),
            updPosDescPosId: new FormControl()
        });

        // UPDATE PURPOSE FORM
        this.updPurposeForm = new FormGroup({
            updPurpose: new FormControl(null, Validators.required),//minLength(2)),
            updPurposePosId: new FormControl()
        });

        // UPDATE QUALIFICATION FORM
        this.updQualificationForm = new FormGroup({
            updQuaIdx: new FormControl(null, Validators.required),
            updQuaCat: new FormControl(null, Validators.required),
            updQuaArea: new FormControl(null, Validators.required),
            updQuaSubArea: new FormControl(null, Validators.required),
        });

        // POPULATE QUALIFICATION LIST
        this.quaList.push(new quaArr(1, 'Professional'));
        this.quaList.push(new quaArr(2, 'Education'));
        this.qualification = new Qualification();
        this.qualification.qua = new quaArr(1, '');

        // DELETE QUALIFICATION FORM
        this.delQualificationForm = new FormGroup({
            delQuaIdx: new FormControl(null, Validators.required),
        });

        // UPDATE AOR FORM
        this.updAorForm = new FormGroup({
            updAorIdx: new FormControl(null, Validators.required),
            updAor: new FormControl(null, Validators.required),
            updKeyAct: new FormControl(null, Validators.required),
        });
        // DELETE AOR FORM
        this.delAorForm = new FormGroup({
            delAorIdx: new FormControl(null, Validators.required),
        });

        // UPDATE REQUIREMENT FORM
        this.updReqForm = new FormGroup({
            updReqIdx: new FormControl(null, Validators.required),
            updReqArea: new FormControl(null, Validators.required),
            updReqYear: new FormControl(null, Validators.required),
        });
        // DELETE REQUIREMENT FORM
        this.delReqForm = new FormGroup({
            delReqIdx: new FormControl(null, Validators.required),
        });

        // UPDATE TECHNICAL COMPETENCIES FORM        
        this.updTechComForm = new FormGroup({
            updTechComIdx: new FormControl(null, Validators.required),
            updTechComCatOpt: new FormControl(null, Validators.required),
            updTechComComOpt: new FormControl(null, Validators.required),
            updTechComDef: new FormControl(null, Validators.required),
            updTechComLvl: new FormControl(null, Validators.required),
            updTechComLvlHidden: new FormControl(null, Validators.required),
            updTechComClusIdOpt: new FormControl(null, Validators.required),
        });
        // DELETE TECHNICAL COMPETENCIES FORM
        this.delTechComForm = new FormGroup({
            delTechComIdx: new FormControl(null, Validators.required),
        });
        // TECHNICAL COMPETENCY
        // POPULATE TECHNICAL COMPETENCY LEVEL
        this.comLvlList = Array<comLvlArr>();
        this.comLvlList.push(new comLvlArr(null, '-- Select Level --'));
        this.comLvlList.push(new comLvlArr(1, 'Fundamental'));
        this.comLvlList.push(new comLvlArr(2, 'Intermediate'));
        this.comLvlList.push(new comLvlArr(3, 'Advanced'));
        this.comLvlList.push(new comLvlArr(4, 'Expert'));

        //populate competency Cluster
        let defComClus: 1;
        let defComClusName: string;
        //let comClusterListSend = this.GETMethodByAPI('https://g1.iot.tmrnd.com.my/api/jobAdv/getTcJobClusterList?api_key=tz3qDkZA9ovNSmChTuGF6eKYoyi1ihmSLT57WGhv');
        let comClusterListSend = this._GET_api_Service.GET_data('/jobAdv/getTcJobClusterList');
        this.comClusterList = Array<comClusterArr>();
        let retOptCluster = comClusterListSend.subscribe(dataReqRes => {
            this.dataUpdReq = dataReqRes;
            if (this.dataUpdReq.length > 0) {
                this.comClusterList.push(new comClusterArr(this.comClusOptDef));
                for (let j = 0; j < this.dataUpdReq.length; j = j + 1) {
                    let k = j + 1;
                    this.comClusterList.push(new comClusterArr(this.dataUpdReq[j].CLUSTER_ID));
                    if (j == 0) {
                        defComClus = 1;
                        defComClusName = this.dataUpdReq[j].CLUSTER_ID;
                    }
                }
                this.comCluster = new ComCluster();
                this.comCluster.comClus = new comClusterArr(this.comClusOptDef);
            } else {
                this.comClusterList.push(new comClusterArr('Fail to Fetch Data'));
                this.comCluster = new ComCluster();
                this.comCluster.comClus = new comClusterArr('Fail to Fetch Data');
            }
        })
        // ADVERTISEMENT REQUEST / SEND TO APPROVER
        this.advPosForm = new FormGroup({
            advPosIdx2: new FormControl(null, Validators.required),
            advPosRemark: new FormControl(),
            advPosStartDt: new FormControl(),// new FormControl(null, Validators.required),
            advPosEndDt: new FormControl(),// new FormControl(null, Validators.required),
            advPosStartDt2: new FormControl(),// new FormControl(null, Validators.required),
            advPosEndDt2: new FormControl(),// new FormControl(null, Validators.required),
            advPosDtRange: new FormControl(),
            advPosRemarkCheckBox: new FormControl(),
            advPosRequestor: new FormControl(),
        });

    }

    ngAfterViewInit() {
        this._script.loadScripts('app-job-detail',
            [
                //'assets/js/app.js',
                'assets/js/jobs/job-details-form.js',
                'assets/js/jobs/job-details-alert.js',
                'assets/js/main/bootstrap-select.js'
            ]);
        Dropzone._autoDiscoverFunction();
    }

    // :start update position description
    showupdPosDesc = false; editedPosDesc = false;
    updPosDescMsg = ""; updPosDescStyle = "";
    changeUpdPosDesc(state) {
        this.showupdPosDesc = state;
    }
    updPosDescForm: FormGroup;
    onPosDescFormSubmit(): void {
        let data2 = {
            positionDesc: this.updPosDescForm.get('updPosDesc').value,
            positionId: this.updPosDescForm.get('updPosDescPosId').value
        }
        let updPosDescSend = this._POST_api_Service.POST_data(JDVars.posDesc, data2);
        let ret = updPosDescSend.subscribe(data2Res => {
            console.log(data2);
            console.log(JDVars.posDesc);
            console.log(data2Res);
            if (data2Res.status == "OK") {
                this.updPosDescMsg = 'Successfully Updated Position Description'
                this.updPosDescStyle = " alert-success ";
                this.getJobDetailData();// REFRESH DATA WITHOUT LOADING -- this.getJobDetailData();
            } else {
                this.updPosDescMsg = 'Fail to Update Position Description'
                this.updPosDescStyle = " alert-danger ";
            }
            this.showupdPosDesc = false;
            this.editedPosDesc = true;
            setTimeout(function() {
                this.editedPosDesc = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })
    }

    // :end update position description

    // :start update purpose
    updPurposeForm: FormGroup;
    editedPurpose = false;
    updPurposeStyle: string;
    //postUpdatePurposeAPI = this.apiUrl + JDVars.jobUpdPurpose + this.token;
    dataUpdPurpose: any = {};
    updPorposeMsg: string;
    onPurposeFormSubmit(): void {
        let data2 = {
            positionId: this.updPurposeForm.get('updPurposePosId').value,
            purpose: this.updPurposeForm.get('updPurpose').value
        }
        let updPurposeSend = this._POST_api_Service.POST_data(JDVars.jobUpdPurpose, data2);

        let ret = updPurposeSend.subscribe(data2Res => {
            this.dataUpdPurpose = data2Res;
            //console.log(this.dataUpdPurpose);
            //console.log(this.dataUpdPurpose.status);
            //this.updPurposeForm.setValue({updPurpose: data.purpose[0].job_purpose,
            //    updPurposePosId: data.profile[0].position_id});
            if (this.dataUpdPurpose.status == "OK") {
                this.updPorposeMsg = 'Successfully Updated Job Purpose'
                this.updPurposeStyle = " alert-success ";
                this.getJobDetailData();// REFRESH DATA WITHOUT LOADING -- this.getJobDetailData();
            } else {
                this.updPorposeMsg = 'Fail to Update Job Purpose'
                this.updPurposeStyle = " alert-danger ";
            }
            this.editedPurpose = true;
            setTimeout(function() {
                this.editedPurpose = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })
    }
    // :end update purpose

    // :start get qualification category name
    findQuaName(quaIdx) {
        let myObj = this.quaList.find(x => x.id == quaIdx);
        if (myObj == null)
            myObj['name'] = '';
        return myObj['name'];
    }
    // :start add/update qualification
    updQualificationForm: FormGroup;
    // display add/update form
    updFormQuaTitle: string;
    updateQua(idx, cat, area, subArea) {
        if (idx == 0) {
            this.updFormQuaTitle = 'New ';
        } else {
            this.updFormQuaTitle = 'Update ';
        }
        this.updQualificationForm.setValue({ updQuaIdx: idx, updQuaCat: cat, updQuaArea: area, updQuaSubArea: subArea });
    }
    // submit add/update qualification form
    editedQua = false;
    addQuaStyle: string;
    //postAddQualificationAPI = this.apiUrl + JDVars.jobAddQua + this.token;
    //postUpdateQualificationAPI = this.apiUrl + JDVars.jobUpdQua + this.token;
    quaApi: string;
    dataUpdQua: any = {};
    act: string;
    addQuaMsg: string;
    onQualificationFormSubmit(): void {
        if (this.updQualificationForm.get('updQuaIdx').value == 0) {
            //this.callQuaAdd(this.updQualificationForm.get('updQuaIdx').value,,
            this.quaApi = JDVars.jobAddQua;
            this.dataUpdQua = {
                positionId: this.posId2,
                qual: this.updQualificationForm.get('updQuaCat').value,
                area: this.updQualificationForm.get('updQuaArea').value,
                subArea: this.updQualificationForm.get('updQuaSubArea').value,
            }
            this.act = "Add";
        } else {
            //callQuaUpdate(this.updQualificationForm.get('updQuaIdx').value,this.updQualificationForm.get('updQuaCat').value,
            //this.updQualificationForm.get('updQuaArea').value,this.updQualificationForm.get('updQuaSubArea').value);
            this.quaApi = JDVars.jobUpdQua;
            this.dataUpdQua = {
                qualNo: this.updQualificationForm.get('updQuaIdx').value,
                qual: this.updQualificationForm.get('updQuaCat').value,
                area: this.updQualificationForm.get('updQuaArea').value,
                subArea: this.updQualificationForm.get('updQuaSubArea').value,
            }
            this.act = "Update";
        }
        let updQuaSend = this._POST_api_Service.POST_data(this.quaApi, this.dataUpdQua);

        let ret = updQuaSend.subscribe(dataQuaRes => {
            this.dataUpdQua = dataQuaRes;
            if (this.dataUpdQua.status == "OK") {
                this.addQuaMsg = 'Successfully ' + this.act + ' Job Qualification';
                this.addQuaStyle = " alert-success ";
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
            } else {
                this.addQuaMsg = 'Fail to ' + this.act + ' Job Qualification';
                this.addQuaStyle = " alert-danger ";
            }
            this.editedQua = true;
            setTimeout(function() {
                this.editedQua = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })
    }
    // :end add/update qualification
    // :start delete qualification
    delQualificationForm: FormGroup;
    // view confirmation
    delQua(idx) {
        this.delQualificationForm.setValue({ delQuaIdx: idx });
    }
    // delete function
    //postDeleteQualificationAPI = this.apiUrl + JDVars.jobDelQua + this.token;
    onDelQualificationFormSubmit(): void {
        this.act = "Delete";
        this.quaApi = JDVars.jobDelQua;
        this.dataUpdQua = {
            qualNo: this.delQualificationForm.get('delQuaIdx').value
        }
        let updQuaSend = this._POST_api_Service.POST_data(this.quaApi, this.dataUpdQua);
        let ret = updQuaSend.subscribe(dataQuaRes => {
            this.dataUpdQua = dataQuaRes;
            if (this.dataUpdQua.status == "OK") {
                this.addQuaMsg = 'Successfully ' + this.act + ' Job Qualification';
                this.addQuaStyle = " alert-success ";
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
            } else {
                this.addQuaMsg = 'Fail to ' + this.act + ' Job Qualification';
                this.addQuaStyle = " alert-danger ";
            }
            this.editedQua = true;
            setTimeout(function() {
                this.editedQua = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })
    }
    // end: delete qualification

    // start: Add/Update AOR
    updAorForm: FormGroup;
    updFormAorTitle: string;
    // display form
    updateAor(idx, aor, aorKey) {
        if (idx == 0) {
            this.updFormAorTitle = 'New ';
        } else {
            this.updFormAorTitle = 'Update ';
        }
        this.updAorForm.setValue({ updAorIdx: idx, updAor: aor, updKeyAct: aorKey });
    }
    editedAor = false;
    updAorStyle: string;
    jobAddAor = '/jobAdv/addJobAor';
    //postAddAorAPI = this.apiUrl + this.jobAddAor + this.token;
    jobUpdateAor = '/jobAdv/editJobAor';
    //postUpdateAorAPI = this.apiUrl + this.jobUpdateAor + this.token;
    aorApi: string;
    addAorMsg: string;
    dataUpdAor: any = {};
    onAorFormSubmit(): void {
        if (this.updAorForm.get('updAorIdx').value == 0) {
            this.aorApi = this.jobAddAor;
            this.dataUpdAor = {
                positionId: this.posId2,
                aor: this.updAorForm.get('updAor').value,
                act: this.updAorForm.get('updKeyAct').value,
            }
            this.act = "Add";
        } else {
            this.aorApi = this.jobUpdateAor;
            this.dataUpdAor = {
                aorNo: this.updAorForm.get('updAorIdx').value,
                aor: this.updAorForm.get('updAor').value,
                act: this.updAorForm.get('updKeyAct').value
            }
            this.act = "Update";
        }

        let updAorSend = this._POST_api_Service.POST_data(this.aorApi, this.dataUpdAor);

        let ret = updAorSend.subscribe(dataAorRes => {
            this.dataUpdAor = dataAorRes;
            if (this.dataUpdAor.status == "OK") {
                this.addAorMsg = 'Successfully ' + this.act + ' Area of Responsibilies';
                this.updAorStyle = " alert-success ";
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
            } else {
                this.addAorMsg = 'Fail to ' + this.act + ' Area of Responsibilies';
                this.updAorStyle = " alert-danger ";
            }
            this.editedAor = true;
            setTimeout(function() {
                this.editedAor = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })
    }
    // end: Add/Update AOR

    // end: delete AOR
    delAorForm: FormGroup;
    // open model and set value
    delAor(idx) {
        this.delAorForm.setValue({ delAorIdx: idx });
    }
    jobDeleteAor = '/jobAdv/delJobAor';
    //postDeleteAorAPI = this.apiUrl + this.jobDeleteAor + this.token;
    onDelAorFormSubmit(): void {
        this.act = "Delete";
        this.aorApi = this.jobDeleteAor;
        this.dataUpdAor = {
            aorNo: this.delAorForm.get('delAorIdx').value
        }
        let updAorSend = this._POST_api_Service.POST_data(this.aorApi, this.dataUpdAor);
        let ret = updAorSend.subscribe(dataAorRes => {
            this.dataUpdAor = dataAorRes;
            if (this.dataUpdAor.status == "OK") {
                this.addAorMsg = 'Successfully ' + this.act + ' Area of Responsibility';
                this.updAorStyle = " alert-success ";
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
            } else {
                this.addAorMsg = 'Fail to ' + this.act + ' Area of Responsibility';
                this.updAorStyle = " alert-danger ";
            }
            this.editedAor = true;
            setTimeout(function() {
                this.editedAor = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })
    }
    // end: delete AOR

    // start: Add/Update Requirement/Experience
    updReqForm: FormGroup;
    private jobAddReq = '/jobAdv/addJobExperience';
    //private postAddReqAPI = this.apiUrl + this.jobAddReq + this.token;
    private jobUpdateReq = '/jobAdv/editJobExperience';
    updFormReqTitle: string;
    // display form
    updateReq(idx, req, year) {
        if (idx == 0) {
            this.updFormReqTitle = 'New ';
        } else {
            this.updFormReqTitle = 'Update ';
        }
        this.updReqForm.setValue({ updReqIdx: idx, updReqArea: req, updReqYear: year });

    }
    // submit form
    editedReq = false;
    updReqStyle: string;
    reqApi: string;
    addReqMsg: string;
    dataUpdReq: any = {};
    onReqFormSubmit(): void {
        if (this.updReqForm.get('updReqIdx').value == 0) {
            this.reqApi = this.jobAddReq;//this.postAddReqAPI;
            this.dataUpdReq = {
                positionId: this.posId2,
                area: this.updReqForm.get('updReqArea').value,
                years: this.updReqForm.get('updReqYear').value,
            }
            this.act = "Add";
        } else {
            this.reqApi = this.jobUpdateReq;
            this.dataUpdReq = {
                expNo: this.updReqForm.get('updReqIdx').value,
                area: this.updReqForm.get('updReqArea').value,
                years: this.updReqForm.get('updReqYear').value
            }
            this.act = "Update";
        }

        let updReqSend = this._POST_api_Service.POST_data(this.reqApi, this.dataUpdReq);
        let ret = updReqSend.subscribe(dataReqRes => {
            this.dataUpdReq = dataReqRes;
            if (this.dataUpdReq.status == "OK") {
                this.addReqMsg = 'Successfully ' + this.act + ' Experience Requirement';
                this.updReqStyle = " alert-success ";
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
            } else {
                this.addReqMsg = 'Fail to ' + this.act + ' Experience Requirement';
                this.updReqStyle = " alert-danger ";
            }
            this.editedReq = true;
            setTimeout(function() {
                this.editedReq = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })
    }
    // end: Add/Update Requirement/Experience

    // start: Delete Requirement/Experience
    delReqForm: FormGroup;
    // private postUpdateReqAPI = this.apiUrl + this.jobUpdateReq + this.token;
    private jobDeleteReq = '/jobAdv/delJobExperience';
    //private postDeleteReqAPI = this.apiUrl + this.jobDeleteReq + this.token;
    delReq(idx) {
        //console.log(idx);
        this.delReqForm.setValue({ delReqIdx: idx });
    }
    onDelReqFormSubmit(): void {
        this.act = "Delete";
        this.reqApi = this.jobDeleteReq;
        this.dataUpdReq = {
            expNo: this.delReqForm.get('delReqIdx').value
        }
        let updReqSend = this._POST_api_Service.POST_data(this.reqApi, this.dataUpdReq);
        let ret = updReqSend.subscribe(dataReqRes => {
            this.dataUpdReq = dataReqRes;
            if (this.dataUpdReq.status == "OK") {
                this.addReqMsg = 'Successfully ' + this.act + ' Experience Requirement';
                this.updReqStyle = " alert-success ";
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
            } else {
                this.addReqMsg = 'Fail to ' + this.act + ' Experience Requirement';
                this.updReqStyle = " alert-danger ";
            }
            this.editedReq = true;
            setTimeout(function() {
                this.editedReq = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })
    }
    // end: Delete Requirement/Experience

    // :start tech com
    editedTechCom = false; // Add/Update message display
    // Add/Update Tech Com
    updTechComForm: FormGroup;
    tglTectComCat = false; tglTectComCom = false; tglTectComComDef = false;
    // tglTectComCat = true; tglTectComCom = true; tglTectComComDef = true;
    // Display tech comp list. for unavailable category
    findTecComCat(idx) {
        if ((idx.match(this.comCatOptDef) !== null) || (idx.match('0') !== null)) {
            return 'N/A';
        } else {
            return idx;
        }
    }
    // :start populate category on cluster on changed
    clusChangedUpdCat() {
        this.errLevel = true;
        let clusSel = this.updTechComForm.get('updTechComClusIdOpt').value;
        let comIdx = this.updTechComForm.get('updTechComIdx').value;
        //console.log(clusSel);
        if (clusSel.match(this.comClusOptDef) === null) {
            this.populateCategory(clusSel);
            // {TODO HIDE BALIK YG TAK BERKENAAN} this.tglTectComCat = true;   this.tglTectComCom = false;  this.editedTechCom = false; this.tglTectComComDef = false;            
            this.updTechComForm.setValue({// RESET SEMUA FORM VALUE EXCEPT updTechComClusIdOpt
                updTechComClusIdOpt: clusSel, updTechComIdx: comIdx, updTechComCatOpt: this.comCatOptDef,
                updTechComComOpt: this.comCompOptDef, updTechComDef: "", updTechComLvl: this.comLvlOptDef, updTechComLvlHidden: ""
            });
        } else {
            this.tglTectComCat = false; this.tglTectComCom = false; this.tglTectComComDef = false;
            this.updTechComForm.setValue({ // RESET ALL FORM VALUE
                updTechComClusIdOpt: this.comClusOptDef, updTechComIdx: comIdx, updTechComCatOpt: this.comCatOptDef,
                updTechComComOpt: this.comCompOptDef, updTechComDef: "", updTechComLvl: this.comLvlOptDef, updTechComLvlHidden: ""
            });
        }
    }
    private jobOptCatTechCom = '/jobAdv/getTcJobCategoryList';
    //private getOptCatTechComAPI = this.apiUrl + this.jobOptCatTechCom + this.token;
    populateCategory(clusSel) {
        let currClusId = this.updTechComForm.get('updTechComClusIdOpt').value;
        this.comCatList = Array<comCatArr>();
        let data2 = {
            clusterId: currClusId
        }
        let comCatListSend = this._POST_api_Service.POST_data(this.jobOptCatTechCom, data2);
        let cnC = 1;
        let defComCat: 1;
        let defComCatName: string;
        let retOptCat = comCatListSend.subscribe(dataReqRes => {
            this.dataUpdReq = dataReqRes;
            if (this.dataUpdReq.length > 0) {
                this.tglTectComCat = true; this.tglTectComCom = false; this.tglTectComComDef = false;
                if (this.dataUpdReq[0].CATEGORY === '0') {
                    this.tglTectComCat = false;
                }
                this.comCatList.push(new comCatArr(0, this.comCatOptDef));
                for (let j = 0; j < this.dataUpdReq.length; j = j + 1) {
                    if (this.dataUpdReq[j].CATEGORY !== '0') {
                        let k = j + 1;
                        this.comCatList.push(new comCatArr(k, this.dataUpdReq[j].CATEGORY));
                        /* test if (j == 0) {
                            defComCat = 1;
                            defComCatName = this.dataUpdReq[j].CATEGORY;
                        }   */
                        //this.updTechComForm.setValue({ updTechComClusIdOpt: '-- Select Category --' });
                        //this.comCatList=this.comCatArr(0);

                    } else {
                        // {todo} - disable select competency
                        //this.tglTectComCat = false;
                        //this.tglTectComCom = true;
                        //this.populateCategory(currClusId, "0");
                        //this.populateCategory(clusterId, selCat);
                        this.tglTectComCom = true;
                        this.populateCompetency(clusSel, "0");
                    }
                }
                this.comCat = new ComCat();
                this.comCat.comCat = new comCatArr(0, this.comCatOptDef);
                //console.log(this.comCat.comCat.name);
            }
            //else {
            //    this.comClusterList.push(new comCatArr(0, 'Fail to Fetch Data'));
            //}
        })
    }
    // :end populate category on cluster on changed

    // :start populate competency on category on changed
    catChangedUpdCom(this) {
        this.errLevel = true;
        let clusterId = this.updTechComForm.get('updTechComClusIdOpt').value;
        let selCat = this.updTechComForm.get('updTechComCatOpt').value;
        let comIdx = this.updTechComForm.get('updTechComIdx').value;
        //console.log(selCat);
        if (selCat.match(this.comCatOptDef) === null) {
            this.tglTectComCom = true;
            this.populateCompetency(clusterId, selCat);
            this.updTechComForm.setValue({ // RESET ALL FORM VALUE
                updTechComClusIdOpt: clusterId, updTechComIdx: comIdx, updTechComCatOpt: selCat,
                updTechComComOpt: this.comCompOptDef, updTechComDef: "", updTechComLvl: this.comLvlOptDef,
                updTechComLvlHidden: ""
            });
        } else {
            // {TODO} tutup yg lain    
            this.updTechComForm.setValue({ // RESET ALL FORM VALUE
                updTechComClusIdOpt: clusterId, updTechComIdx: comIdx, updTechComCatOpt: this.comCatOptDef,
                updTechComComOpt: this.comCompOptDef, updTechComDef: "", updTechComLvl: this.comLvlOptDef,
                updTechComLvlHidden: ""
            });
        }
    }
    private jobOptComTechCom = '/jobAdv/getTcJobCompetencyList';
    // private getOptComTechComAPI = this.apiUrl + this.jobOptComTechCom + this.token;
    populateCompetency(clusterId, selCat) {
        //console.log(clusterId);         console.log(selCat);
        this.comComList = Array<comComArr>();
        let data2 = {
            clusterId: clusterId, //this.updTechComForm.get('updTechComClusIdOpt').value,
            categoryId: selCat, //this.updTechComForm.get('updTechComCatOpt').value
        }
        // let comComListSend = this.POSTMethodByAPI(this.getOptComTechComAPI, data2);
        let comComListSend = this._POST_api_Service.POST_data(this.jobOptComTechCom, data2);
        let cnC = 1;
        let defComCom: 1;
        let defComComName: string;
        let retOptCom = comComListSend.subscribe(dataReqRes => {
            this.dataUpdReq = dataReqRes;
            if (this.dataUpdReq.length > 0) {
                this.tglTectComCom = true;
                this.comComList.push(new comComArr(0, this.comCompOptDef));
                for (let j = 0; j < this.dataUpdReq.length; j = j + 1) {
                    let k = j + 1;
                    this.comComList.push(new comComArr(k, this.dataUpdReq[j].COMP_NAME));
                }
                this.comCom = new ComCom();
                this.comCom.comCom = new comComArr(0, this.comCompOptDef);
            } //else {
            //  this.comComList.push(new comComArr(0, 'Fail to Fetch Data'));
            //}
        })
    }
    // :end populate competency on category on changed

    // :start populate competency def & show level on category on changed
    comChangedUpdDef(this) {
        this.errLevel = true;
        let selClus = this.updTechComForm.get('updTechComClusIdOpt').value;
        let selCat = this.updTechComForm.get('updTechComCatOpt').value;
        let selCom = this.updTechComForm.get('updTechComComOpt').value;
        let selComDefinition = this.updTechComForm.get('updTechComDef').value;
        let comIdx = this.updTechComForm.get('updTechComIdx').value;
        if (selCom.match(this.comComDef) === null) {
            //console.log('DEFAULT');            
            this.updTechComForm.setValue({ // RESET ALL FORM VALUE
                updTechComClusIdOpt: selClus, updTechComIdx: comIdx, updTechComCatOpt: selCat,
                updTechComComOpt: this.comCompOptDef, updTechComDef: "", updTechComLvl: this.comLvlOptDef,
                updTechComLvlHidden: ""
            });
        } else {
            //console.log('NOT DEFAULT');            
            this.updTechComForm.setValue({ // RESET ALL FORM VALUE
                updTechComClusIdOpt: selClus, updTechComIdx: comIdx, updTechComCatOpt: selCat,
                updTechComComOpt: selCom, updTechComDef: "", updTechComLvl: this.comLvlOptDef,
                updTechComLvlHidden: ""
            });
            this.populateComDef(selClus, selCom, selCat);
        }
    }
    private jobOptDefTechCom = '/jobAdv/getTcJobCompetencyDef';
    //private getOptDefTechComAPI = this.apiUrl + this.jobOptDefTechCom + this.token;
    populateComDef(selClus, selCom, selCat) {
        if (selCom.match(this.comCompOptDef) !== null) {
            //console.log("DEFAULT");
            //this.tglTectComComDef = false;
        } else {
            if (selCat.match(this.comCatOptDef) !== null) {
                selCat = "0";
            }
            //console.log(selClus);console.log(selCat);console.log(selCom);
            let data2 = {
                clusterId: selClus,
                categoryId: selCat,
                compName: selCom,
            }
            // let comComListSend = this.POSTMethodByAPI(this.getOptDefTechComAPI, data2);
            let comComListSend = this._POST_api_Service.POST_data(this.jobOptDefTechCom, data2);
            let cnC = 1;
            let defComCom: 1;
            let defComComName: string;
            let selLvl = this.updTechComForm.get('updTechComLvl').value;
            if (selLvl.match(this.comLvlOptDef) !== null) {
                selLvl = '';
            }
            let retOptCom = comComListSend.subscribe(dataReqRes => {
                this.dataUpdReq = dataReqRes;
                this.comComDef = "";
                this.tglTectComComDef = true;
                if (this.dataUpdReq.length > 0) {
                    this.updTechComForm.setValue({
                        updTechComDef: this.dataUpdReq[0].COMP_DEF, updTechComIdx: this.updTechComForm.get('updTechComIdx').value,
                        updTechComCatOpt: this.updTechComForm.get('updTechComCatOpt').value, updTechComComOpt: this.updTechComForm.get('updTechComComOpt').value,
                        updTechComClusIdOpt: this.updTechComForm.get('updTechComClusIdOpt').value, updTechComLvl: this.updTechComForm.get('updTechComLvl').value,
                        updTechComLvlHidden: selLvl
                    });
                }
            })
        }
    }
    // :end populate competency def on category on changed

    // :start on change level
    lvlChangedUpdLvlHidden(this) {
        let selLvl = this.updTechComForm.get('updTechComLvl').value;
        if (selLvl.match(this.comLvlOptDef) !== null) {
            this.updTechComForm.setValue({
                updTechComDef: this.dataUpdReq[0].COMP_DEF, updTechComIdx: this.updTechComForm.get('updTechComIdx').value,
                updTechComCatOpt: this.updTechComForm.get('updTechComCatOpt').value, updTechComComOpt: this.updTechComForm.get('updTechComComOpt').value,
                updTechComClusIdOpt: this.updTechComForm.get('updTechComClusIdOpt').value, updTechComLvl: this.updTechComForm.get('updTechComLvl').value,
                updTechComLvlHidden: ''
            });
            this.errLevel = true;
        } else {
            this.updTechComForm.setValue({
                updTechComDef: this.dataUpdReq[0].COMP_DEF, updTechComIdx: this.updTechComForm.get('updTechComIdx').value,
                updTechComCatOpt: this.updTechComForm.get('updTechComCatOpt').value, updTechComComOpt: this.updTechComForm.get('updTechComComOpt').value,
                updTechComClusIdOpt: this.updTechComForm.get('updTechComClusIdOpt').value, updTechComLvl: this.updTechComForm.get('updTechComLvl').value,
                updTechComLvlHidden: this.updTechComForm.get('updTechComLvl').value
            });
            this.errLevel = false;
        }
    }
    // :end on change level

    // Submit Add Tech Com
    updateTechCom(idx, clusId, comCat, comName, comDef, comLvl) {
        let clusIdStr: string;
        if (clusId == 0) {
            clusIdStr = this.comClusOptDef;
        }
        this.updTechComForm.setValue({
            updTechComClusIdOpt: clusIdStr, updTechComIdx: idx,
            updTechComCatOpt: comCat, updTechComComOpt: comName, updTechComDef: comDef,
            updTechComLvl: comLvl, updTechComLvlHidden: comLvl
        });
    }
    // :start submit add tech com
    addTechComStyle: string;
    techComApi: string;
    addTechComMsg: string;
    dataUpdTechCom: any = {};
    private jobAddTechCom = '/jobAdv/addJobTechnical';
    //private postAddTechComAPI = this.apiUrl + this.jobAddTechCom + this.token;
    private jobUpdateTechCom = '/jobAdv/editJobTechnical';
    //private postUpdateTechComAPI = this.apiUrl + this.jobUpdateTechCom + this.token;

    onTechComFormSubmit(): void {
        let clusId = this.updTechComForm.get('updTechComClusIdOpt').value;
        let catId = this.updTechComForm.get('updTechComCatOpt').value;
        if (catId.match(this.comCatOptDef) !== null) {
            catId = "0";
        }
        if (this.updTechComForm.get('updTechComIdx').value == 0) {
            this.techComApi = this.jobAddTechCom; // this.postAddTechComAPI;
            this.dataUpdTechCom = {
                positionId: this.posId2,
                clusterId: clusId,
                category: catId,
                compName: this.updTechComForm.get('updTechComComOpt').value,
                compDef: this.updTechComForm.get('updTechComDef').value,
                level: this.updTechComForm.get('updTechComLvl').value,
            }
            this.act = "Add";
        } else {
            this.techComApi = this.jobUpdateTechCom;//this.postUpdateTechComAPI;
            this.dataUpdTechCom = {
                tcNo: this.updTechComForm.get('updTechComIdx').value,
                clusterId: clusId,
                category: catId,
                compName: this.updTechComForm.get('updTechComComOpt').value,
                compDef: this.updTechComForm.get('updTechComDef').value,
                level: this.updTechComForm.get('updTechComLvl').value,
            }
            this.act = "Update";
        }

        //let updTechComSend = this.POSTMethodByAPI(this.techComApi, this.dataUpdTechCom);
        let updTechComSend = this._POST_api_Service.POST_data(this.techComApi, this.dataUpdTechCom);

        let ret = updTechComSend.subscribe(dataTechComRes => {
            this.dataUpdTechCom = dataTechComRes;
            if (this.dataUpdTechCom.status == "OK") {
                this.addTechComMsg = 'Successfully ' + this.act + ' Technical Competencies';
                this.addTechComStyle = " alert-success ";
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
            } else {
                this.addTechComMsg = 'Fail to ' + this.act + ' Technical Competencies';
                this.addTechComStyle = " alert-danger ";
            }
            this.editedTechCom = true;
            setTimeout(function() {
                this.editedTechCom = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })
    }
    // end: submit tech com

    // delete tech com
    delTechCom(idx) {
        this.delTechComForm.setValue({ delTechComIdx: idx });
    }
    delTechComForm: FormGroup;
    //private jobDeleteTechCom = '/jobAdv/delJobTechnical';
    private postDeleteTechComAPI = '/jobAdv/delJobTechnical'; //this.apiUrl + this.jobDeleteTechCom + this.token;
    onDelTechComFormSubmit(): void {
        this.act = "Delete";
        this.reqApi = this.postDeleteTechComAPI;
        this.dataUpdTechCom = {
            tcNo: this.delTechComForm.get('delTechComIdx').value
        }
        // let updTechComSend = this.POSTMethodByAPI(this.reqApi, this.dataUpdTechCom);
        let updTechComSend = this._POST_api_Service.POST_data(this.reqApi, this.dataUpdTechCom);

        let ret = updTechComSend.subscribe(dataTechComRes => {
            this.dataUpdTechCom = dataTechComRes; //dataReqRes;
            if (this.dataUpdTechCom.status == "OK") {
                this.addTechComMsg = 'Successfully ' + this.act + ' Technical Competencies';
                this.addTechComStyle = " alert-success ";
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
            } else {
                this.addTechComMsg = 'Fail to ' + this.act + ' Technical Competencies';
                this.addTechComStyle = " alert-danger ";
            }
            this.editedTechCom = true;
            setTimeout(function() {
                this.editedTechCom = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })
    }
    // :end tech com

    // :start HCBD admin send advertisement for approval
    advPosForm: FormGroup;
    //disableSubmitAdv = true;
    errAdvPeriod = false;
    dataAdvPos: any = {};
    advPosMsg: string;
    advPosStyle: string;
    private postAdvertisePositionAPI = JDVars.jobPostAdv;

    disableSubmit() {
        this.disableSubmitAdv = false;
        /*let posStartDt2 = ((document.getElementById("advPosStartDt") as HTMLInputElement).value);
        console.log(posStartDt2);
        this.advPosForm.setValue({
            advPosIdx2: this.advPosForm.get('advPosIdx2').value,
            advPosRemark: this.advPosForm.get('advPosRemark').value,
            advPosStartDt: this.advPosForm.get('advPosStartDt').value,
            advPosEndDt: ((document.getElementById("advPosEndDt") as HTMLInputElement).value),
            advPosStartDt2: ((document.getElementById("advPosStartDt") as HTMLInputElement).value),
            advPosEndDt2: ((document.getElementById("advPosEndDt") as HTMLInputElement).value),
        })*/
    }
    onadvPosFormSubmit(): void {
        let advPosIdx2 = this.advPosForm.get('advPosIdx2').value;
        let posStartDt = this.advPosForm.get('advPosStartDt').value;
        let posEndDt = this.advPosForm.get('advPosEndDt').value;
        let posStartDt2 = '';//((document.getElementById("advPosStartDt") as HTMLInputElement).value); // <HTMLInputElement>document.getElementById("advPosStartDt2");//this.advPosForm.get('advPosStartDt2').value;
        let posEndDt2 = '';//((document.getElementById("advPosEndDt") as HTMLInputElement).value); // <HTMLInputElement>document.getElementById("advPosEndDt2");//this.advPosForm.get('advPosEndDt2').value;        
        let posRemark = this.advPosForm.get('advPosRemark').value;
        let advPosRemarkCheckBox = this.advPosForm.get('advPosRemarkCheckBox').value;
        let generalMsg = ' Advertise Job Position #' + advPosIdx2;
        let advApi = this.postAdvertisePositionAPI;
        let posDtRange = ((document.getElementById("advPosDtRange") as HTMLInputElement).value);

        let advStartDt = posDtRange.substr(0, 10);//this.pendApprForm.get('advStartDt').value;
        let advEndDt = posDtRange.substr(14, 10); //this.pendApprForm.get('advEndDt').value;

        let advPosRequestor = this.advPosForm.get('advPosRequestor').value;
        /* console.log(advPosRequestor);
        console.log(advApi);
        console.log(advPosIdx2);
        console.log(advStartDt);
        console.log(advEndDt);
        console.log(posRemark); */
        this.dataAdvPos = {
            position_id: advPosIdx2,
            start: advStartDt, // posStartDt2,
            close: advEndDt, // posEndDt2,
            remark: posRemark,
            requester: advPosRequestor,
            public: "Y",
            share: "Y"
        }

        /**** REMARK SEKEJAP TODO NANTO REMOVE   */
        let updQuaSend = this._POST_api_Service.POST_data(advApi, this.dataAdvPos);
        let ret = updQuaSend.subscribe(dataQuaRes => {
            this.dataAdvPos = dataQuaRes;
            //console.log(this.dataAdvPos.status);
            if (this.dataAdvPos.status == "OK") {
                this.advPosMsg = 'Successfully' + generalMsg;
                this.advPosMsg += ' You will be redirected to Advertisement Tracking page shortly. ';
                this.advPosStyle = ' alert-success ';
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
                this.editedAdvPos = true;
                setTimeout(function() {
                    this.editedAdvPos = false;
                    this.routers.navigate(['job/advertisement-tracking/all']);
                }.bind(this), 3000); //wait 3 Seconds and hide
                this.advBtnDisplay = false;
            } else {
                this.advPosMsg = 'Fail to ' + generalMsg + ' (Position has been advertised)';
                this.advPosStyle = ' alert-danger  ';
                this.editedAdvPos = true;
                this.advBtnDisplay = false;//this.advDisabled = true;
            }
        },
            error => {
                console.log('[ERROR] Advertise Job Profile: ' + error);
                this.editedAdvPos = true;
                this.advPosMsg = 'Fail to Advertise Job Profile.'
                this.advPosStyle = " alert-danger ";
            })

    }
    // :end HCBD admin send advertisement for approval */

    showOccMsg = false; advMsgStyle = 'secondary'; apprRemark = false;
    checkOccupied(occ) {
        if (occ == 1) {
            this.showOccMsg = true; this.advMsgStyle = 'warning'; this.apprRemark = true;
        } else {

        }
    }

    requestorListAPI = JDVars.requestorList;
    //optRequestorArr= Array<reqArr>();
    //comlvl: ComLvl = new ComLvl();
    //comLvlList = Array<comLvlArr>();
    optReq: Requestor = new Requestor();
    optReqList = Array<reqArr>();
    //optReqList : any = {}; //= Array<reqArr>();    

    //heroesList = ['Windstorm', 'Bombasto', 'Magneta', 'Tornado'];    
    getRequestor() {
        //this.heroesList = ['Windstorm', 'Bombasto', 'Magneta'];
        let comClusterListSend = this._GET_api_Service.GET_data(this.requestorListAPI);
        this._GET_api_Service.GET_data(this.requestorListAPI).subscribe(data => {
            //this.heroesList = ['Windstorm', 'Bombasto'];
            this.optReqList = data;
            //console.log(this.optReqList);
            //console.log(this.optReqList.length);

            //for (let j = 0; j < data.length; j++) {                
            //    this.heroesList.push(data[j].Pernr_Name);      
            //}
            //console.log(this.heroesList);
        },
            error => console.log('[ERROR - Get Requestor List] ' + error),
            // () => console.log('Done')
        );
        //this.heroesList = ['Windstorm', 'Bombasto', 'Magneta','Test'];
    }

    /*
    onCheckboxChange(occ,event){
        if(occ==1){
            if (event.target.checked) {
                
            } else {

            }
        }
    }*/
}

