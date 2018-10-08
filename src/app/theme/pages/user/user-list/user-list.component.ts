import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";

import { GlobalVariable } from '../../ghcm-global';



@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    encapsulation: ViewEncapsulation.None,
    // KALAU ADA CSS SENDIRI styleUrls:['/job-vacant.component.css']
})

export class UserListComponent {//} implements OnInit {
    title1 = 'User Management';
    title2 = 'User List';
    searchPlaceholder = 'Staff Id/Name/Position/LOB';
    totalRes = '0';

    private baseApiUrl = GlobalVariable.BASE_API_URL;
    private baseApiToken = GlobalVariable.API_KEY;
    apiUrl = this.baseApiUrl + '/jobAdv/searchForJobAdvPosition?api_key=' + this.baseApiToken;
    data: any = {};
    param: string;
    name: string = '';
    found: boolean;
    public termName: string;
    public termStaffId: string;
    public termPos: string;
    public termStt: string;

    constructor(private http: Http) {
        //this.getJobProfile();
        //this.getProfileData();
    }

    onNameKeyUp(event: any) {
        this.name = event.target.value;
        this.found = false;
        //console.log(event.target.value);
    }

    getProfile() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        let data = {
            text: this.name
        }

        return this.http.post(this.apiUrl, data, options)
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
                }
            });
    }

    getProfileData() {
        this.getProfile().subscribe(data => {
            console.log(data);
            this.data = data;
            this.totalRes = this.data.results.length;
        })
    }

    //ngOnInit() {
    //} 
}