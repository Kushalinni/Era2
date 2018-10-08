import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
declare var mWizard: any;

@Component({
    selector: 'app-appt-new',
    templateUrl: './appt-new.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ApptNewComponent implements OnInit, AfterViewInit {
    constructor() {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        (<any>$('#m_datepicker_6')).datepicker({
            todayHighlight: true,
            orientation: "bottom left",
            templates: {
                leftArrow: '<i class="la la-angle-left"></i>',
                rightArrow: '<i class="la la-angle-right"></i>'
            }
        });

        new mWizard('m_wizard', {
            startStep: 1
        });
    }
}