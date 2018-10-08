import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { DefaultComponent } from '../../default/default.component';
import { JobProfileComponent } from './job-profile.component';
//import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipe, SortByPipe } from './pipes';
import { POST_Service } from '../../../api/post.service';
import { AuthRoutingModule } from '../../../../../app/auth/auth-routing.routing';
import { AlertService } from '../../../../auth/_services/alert.service';
// C:\Projects\ghcm_portal\src\app\auth\_services\alert.service.ts
//'./_services/alert.service';
// import { AuthRoutingModule } from 'C:\Projects\ghcm_portal\src\app\auth\auth-routing.routing.ts';

/* '..//auth-routing.routing'; */

const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': JobProfileComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        //BrowserModule, 
        FormsModule, HttpModule,
        CommonModule, RouterModule.forChild(routes), LayoutModule,
    ],
    providers: [
        AlertService,
        POST_Service
    ], exports: [
        RouterModule,
    ], declarations: [
        JobProfileComponent, FilterPipe, SortByPipe
    ], bootstrap: [JobProfileComponent]
})
export class JobProfileModule {
}