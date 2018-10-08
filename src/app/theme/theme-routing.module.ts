import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_guards/auth.guard';


const routes: Routes = [
    {
        'path': '',
        'component': ThemeComponent,
        'canActivate': [AuthGuard],
        'children': [
            {
                'path': 'index',
                'loadChildren': '.\/pages\/default\/blank\/blank.module#BlankModule',
            },
            {
                'path': 'profile',
                'loadChildren': '.\/pages\/profile\/profile.module#ProfileModule',
            },
            {
                'path': 'setup\/welcome',
                'loadChildren': '.\/pages\/setup\/welcome\/setup-welcome.module#SetupWelcomeModule',
            },
            {
                'path': 'job',
                'loadChildren': '.\/pages\/job\/default.module#ApptDefaultModule',
            },
            /*  {
                 'path': 'job\/new',
                 'loadChildren': '.\/pages\/job\/job-new\/job-new.module#JobNewModule',
             },
             {
                 'path': 'job\/list',
                 'loadChildren': '.\/pages\/job\/job-list\/job-list.module#JobListModule',
             }, 
             {
                 'path': 'job\/cluster',
                 'loadChildren': '.\/pages\/job\/job-cluster\/job-cluster.module#JobClusterModule',
             },
             {
                 'path': 'job\/vacant',
                 'loadChildren': '.\/pages\/job\/job-vacant\/job-vacant.module#JobVacantModule',
             },
             {
                 'path': 'job\/pending-approval',
                 'loadChildren': '.\/pages\/job\/job-pending-approval\/job-pending-approval.module#JobPendingApprovalModule',
             },*/
            {
                'path': 'job\/detail\/:id',
                'loadChildren': '.\/pages\/job\/job-detail\/job-detail.module#JobDetailModule',
            },
            {
                'path': 'job\/detail',
                'loadChildren': '.\/pages\/job\/job-detail\/job-detail.module#JobDetailModule',
            },
            {
                'path': 'job\/profile',
                'loadChildren': '.\/pages\/job\/job-profile\/job-profile.module#JobProfileModule',
            },
            {
                'path': 'job\/advertisement-tracking\/:type',
                'loadChildren': '.\/pages\/job\/job-advertisement-tracking\/job-advertisement-tracking.module#JobAdvertisementTrackingModule',
            },
            // http://localhost:4200/job/advertisement-tracking/detail/undefined
            {
                'path': 'job\/:display-state\/detail\/:id',
                'loadChildren': '.\/pages\/job\/job-advertisement-detail\/job-advertisement-detail.module#JobAdvertisementDetailModule',
            },
            {
                'path': 'job\/pending-approval',
                'loadChildren': '.\/pages\/job\/job-pending-approval\/job-pending-approval.module#JobPendingApprovalModule',
            },
            {
                'path': 'job\/:display-state\/detail\/:id',
                'loadChildren': '.\/pages\/job\/job-advertisement-detail\/job-advertisement-detail.module#JobAdvertisementDetailModule',
            },

            // --- user management
            {
                'path': 'user\/list',
                'loadChildren': '.\/pages\/user\/user-list\/user-list.module#UserListModule',
            },
            /*{
                'path': 'user\/new',
                'loadChildren': '.\/pages\/user\/user-new\/user-new.module#UserNewModule',
            },
            {
                'path': 'user\/group\/list',
                'loadChildren': '.\/pages\/user\/user-group\/user-group.module#UserGroupListModule',
            },*/

            // ----- USER 's JOB ADVERTISEMENT
            {
                'path': 'job\/advertisement\/list',
                'loadChildren': '.\/pages\/client\/job\/advertisement\/list\/job-adv-list.module#JobAdvListModule',
            },
            {
                'path': 'job\/advertisement\/detail\/:applied\/:idx',
                'loadChildren': '.\/pages\/client\/job\/advertisement\/detail\/job-adv-detail.module#JobAdvDetailModule',
            }
        ],
    },
    {
        'path': '**',
        'redirectTo': 'welcome',
        'pathMatch': 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ThemeRoutingModule { }