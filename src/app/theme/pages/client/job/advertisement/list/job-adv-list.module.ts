import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { DefaultComponent } from '../../../../default/default.component';
import { JobAdvListComponent } from './job-adv-list.component';
//import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { FilterPipe} from './filter.pipe';
import { FilterPipe, SortByPipe } from './pipes';
import { DatePipe } from '@angular/common';

const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': JobAdvListComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        //BrowserModule, 
        FormsModule, HttpModule,
        CommonModule, RouterModule.forChild(routes), LayoutModule,
    ], exports: [
        RouterModule,
    ], declarations: [
        JobAdvListComponent, FilterPipe, SortByPipe
    ], bootstrap: [JobAdvListComponent],
    providers: [DatePipe]
})
export class JobAdvListModule {
}