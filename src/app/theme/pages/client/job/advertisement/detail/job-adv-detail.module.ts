import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { DefaultComponent } from '../../../../default/default.component';
import { JobAdvDetailComponent } from './job-adv-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
                'component': JobAdvDetailComponent,
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
        JobAdvDetailComponent,
    ],
})
export class JobAdvDetailModule {

    jobDetail() {

    }
}

