import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { GlobalVariable } from '../pages/ghcm-global';
import { Observable } from "rxjs/Rx";
import { Router } from "@angular/router";

@Injectable()
export class GET_Service {
    apiUrl: string;
    /*usrLoginLvl = GlobalVariable.USER_LEVEL;
    usrLoginRole=GlobalVariable.USER_ROLE;
    usrLoginToken=GlobalVariable.USER_TOKEN;*/
    baseApiUrl = GlobalVariable.BASE_API_URL;
    baseApiKey = GlobalVariable.API_KEY;

    constructor(private http: Http, private _router: Router) {
    }

    GET_data(api) {
        let localToken = JSON.parse(localStorage.getItem('currentUser')).token;
        //this.checkToken(localToken);
        if (localToken) {
            try {
                let headersComCat = new Headers();
                headersComCat.append('token', localToken);
                headersComCat.append('Content-Type', 'application/json');
                let optionsComCat = new RequestOptions({ headers: headersComCat });
                let apiUrl = this.baseApiUrl + api + '?api_key=' + this.baseApiKey;
                return this.http.get(apiUrl, optionsComCat)
                    .map((res: Response) => res.json());
            } catch (e) {
                console.log("[ERROR] Get Method: " + e);
                return null;
            }
        }
    }

    checkToken(localToken) {
        let apiUrl = this.baseApiUrl + '/user/auth?api_key=' + this.baseApiKey;
        let headersComCat = new Headers();
        headersComCat.append('token', localToken);
        headersComCat.append('Content-Type', 'application/json');
        let optionsComCat = new RequestOptions({ headers: headersComCat });
        return this.http.get(apiUrl, optionsComCat)
            .map((res: Response) => res.json()
                .catch((error: any) => {
                    localStorage.clear();
                    //this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                    this._router.navigate(['/login']);
                    /*if (error.status === 401) {                    
                        return '-1';
                    }
                    else  {
                        return Observable.throw(new Error(error.status));
                    }  */
                }));
    }

}