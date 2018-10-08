import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { DefaultComponent } from '../../default/default.component';
import { JobAdvertisementDetailComponent } from './job-advertisement-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { POST_Service } from '../../../api/post.service';
import { DatePipe } from '@angular/common';
import { AlertService } from '../../../../auth/_services/alert.service';

let users: any[] = JSON.parse(localStorage.getItem('users')) || [];
let filteredUsers = "";// users.filter(user => {
//});

const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': JobAdvertisementDetailComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule, ReactiveFormsModule
    ], exports: [
        RouterModule,
    ], declarations: [
        JobAdvertisementDetailComponent,
    ], providers: [
        POST_Service, DatePipe, AlertService,
    ],
})
export class JobAdvertisementDetailModule {

    jobDetail() {

    }
}

