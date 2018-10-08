import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { DefaultComponent } from '../../default/default.component';
import { UserListComponent } from './user-list.component';
//import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { FilterPipe} from './filter.pipe';
import { FilterPipe, SortByPipe } from './pipes'
const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': UserListComponent,
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
        UserListComponent, FilterPipe, SortByPipe
    ], bootstrap: [UserListComponent]
})
export class UserListModule {
}