import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { GlobalVariable } from '../../theme/pages/ghcm-global';
//import { environment } from "environments/environment";
// we can now access environment.apiUrl
//const API_URL = environment.apiUrl;

@Injectable()
export class AuthenticationService {

    constructor(private http: Http) {
    }

    login(email: string, password: string) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let options = new RequestOptions({ headers: headers });

        let data = new URLSearchParams()
        data.set('userid', email)
        data.set('password', password);

        //http://ghcm.iot.tmrnd.com.my
        let apiLogin = '/user/portal/login'; ///user/login
        console.log(GlobalVariable.BASE_API_URL + apiLogin + '?api_key=' + GlobalVariable.API_KEY);
        return this.http.post(GlobalVariable.BASE_API_URL + apiLogin + '?api_key=' + GlobalVariable.API_KEY, data, options)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token && (user.results == true)) {
                    // user.token = 'fake-jwt-token'; //20180725 - removed to get the actual token
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    //user.token = 
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    ///console.log(user.token);
                } /*else {
                    console.log("username error");
                    Error('Email or password is incorrect');
                    localStorage.setItem('currentUser', JSON.stringify(''));
                } */
            })
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
                else if (error.status === 401) {
                    return Observable.throw('ID or password is incorrect');
                }
                else if (error.status === 304) {
                    return Observable.throw(new Error(error.status));
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}
