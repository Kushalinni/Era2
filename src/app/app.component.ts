import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Helpers } from "./helpers";
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
    selector: 'body',
    templateUrl: './app.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
    title = 'app';
    globalBodyClass = 'm-page--loading-non-block m-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default';
    deviceInfo = null;
    constructor(private _router: Router , private deviceService: DeviceDetectorService) {
        this.epicFunction();
    }
    
    epicFunction() {
        console.log('hello `App` component');
        this.deviceInfo = this.deviceService.getDeviceInfo();
        const isMobile = this.deviceService.isMobile();
        const isTablet = this.deviceService.isTablet();
        const isDesktopDevice = this.deviceService.isDesktop();
        console.log(this.deviceInfo);
        console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
        console.log(isTablet);  // returns if the device us a tablet (iPad etc)
        console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.
      }
    ngOnInit() {
        this._router.events.subscribe((route) => {
            if (route instanceof NavigationStart) {
                Helpers.setLoading(true);
                Helpers.bodyClass(this.globalBodyClass);
            }
            if (route instanceof NavigationEnd) {
                Helpers.setLoading(false);
            }
        });
    }
}