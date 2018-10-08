import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../_services/user.service";
import { Observable } from "rxjs/Rx";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private _router: Router, private _userService: UserService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // console.log('masuk sini 12');
        console.log(currentUser);
        //console.log(this._userService.verify());
        return this._userService.verify()
            .map(
            data => {
                console.log(data);
                //if (data !== null) {
                if (data && data.results) {
                    // logged in so return true
                    return true;
                } else {
                    // error when verify so redirect to login page with the return url
                    this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                    return false;
                }
            },
            error => {
                // error when verify so redirect to login page with the return url               
                this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                return false;
            }).catch((error: any) => {
                localStorage.clear();
                this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                if (error.status === 401) {
                    return '-1';
                }
                else {
                    return Observable.throw(new Error(error.status));
                }
            });
    }
}