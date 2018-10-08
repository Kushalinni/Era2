import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';

@Component({
    selector: 'app-setup-welcome',
    templateUrl: './setup-welcome.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class SetupWelcomeComponent implements OnInit, AfterViewInit {
    constructor(private _script: ScriptLoaderService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        //NOT WORKING
        //this._script.loadScripts('app-widgets-summernote',
        //    ['/assets/demo/default/custom/components/forms/widgets/summernote.js']);

        (<any>$('.summernote')).summernote({
            height: 150
        });
    }
}