import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { DefaultComponent } from '../../default/default.component';
import { JobDetailComponent } from './job-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { POST_Service } from '../../../api/post.service';
import { GET_Service } from '../../../api/get.service';
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
                'component': JobDetailComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule, ReactiveFormsModule
    ], exports: [
        RouterModule,
    ], providers: [
        POST_Service,
        GET_Service, AlertService,
    ], declarations: [
        JobDetailComponent,
    ],
})
export class JobDetailModule {

    jobDetail() {

    }
}

