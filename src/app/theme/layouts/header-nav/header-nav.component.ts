import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';

declare let mLayout: any;
@Component({
    selector: "app-header-nav",
    templateUrl: "./header-nav.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class HeaderNavComponent implements OnInit, AfterViewInit {

    currUsr = JSON.parse(localStorage.getItem('currentUser'));
    lgnName = this.currUsr.body.name;
    lgnEmail = this.currUsr.body.email;
    lgnComp = this.currUsr.body.company;
    lgnRole = this.currUsr.job_role;

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        mLayout.initHeader();
    }

}