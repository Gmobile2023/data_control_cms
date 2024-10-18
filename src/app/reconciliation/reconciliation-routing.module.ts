import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuppliersListComponent } from './suppliers/suppliers-list/suppliers-list.component';
import { AgencyListComponent } from './agencies/agency-list/agency-list.component';
import { ServiceTypeComponent } from './service-type/service-type.component';
import { ServiceListComponent } from './service/service-list/service-list.component';
import { ServiceCreateNavigationComponent } from './service/service-create-navigation/service-create-navigation.component';
import { ServiceCreateComponent } from './service/service-create-navigation/service-create/service-create.component';
import { BatchFileListComponent } from './batch-file/batch-file-list/batch-file-list.component';
import { BatchFileCreateComponent } from './batch-file/batch-file-create/batch-file-create.component';
import { BatchFileDetailComponent } from './batch-file/batch-file-detail/batch-file-detail.component';
import { BatchFileUpdateComponent } from './batch-file/batch-file-update/batch-file-update.component';
import { SupplierServiceListComponent } from './service/service-create-navigation/supplier-service-list/supplier-service-list.component';
import { AgencyServiceListComponent } from './service/service-create-navigation/agency-service-list/agency-service-list.component';
import { ServiceDetailComponent } from './service/service-detail/service-detail.component';
import * as path from 'path';
import { ReportReconciliationComponent } from './report-reconciliation/report-reconciliation/report-reconciliation.component';
import { ReportReconciliationDetailComponent } from './report-reconciliation/report-reconciliation-detail/report-reconciliation-detail.component';
import {TypeemailListComponent} from './TyepEmail/type-email-list/typeemail-list.component';
import {ManageEmailListComponent} from './ManageEmail/manage-email-list/manage-email-list.component';
import {PostControlReportCreateComponent} from './manage/post-control-report-create/post-control-report-create.component';
import {ControlReportCreateComponent} from'./manage/control-report-create/control-report-create.component';
import {ControlManagementListComponent} from './manage/control-management-list/control-management-list.component';
import {ControlManagementCreateComponent} from './manage/control-management-create/control-management-create.component';
import {ConfigureDataCreateComponent} from './manage/configure-data-create/configure-data-create.component'
import { ReportRevenuecontrlComponent } from './report-revenuecontrl/report-revenuecontrl.component';




const routes: Routes = [
  {
    path: 'supplier',
    children: [
      {
        path: '',
        component: SuppliersListComponent,
        pathMatch: 'full',
      },
    ],
    data: { permission: 'Pages.Administration.Supplier' },
  },
  {
    path: 'agency',
    children: [
      {
        path: '',
        component: AgencyListComponent,
        pathMatch: 'full',
      },
    ],
    data: { permission: 'Pages.Administration.Agency' },
  },
  {
    path: 'service-type',
    children: [
      {
        path: '',
        component: ServiceTypeComponent,
        pathMatch: 'full',
      },
    ]
  },
  {
    path: 'service',
    children: [
      {
        path: '',
        component: ServiceListComponent,
        pathMatch: 'full',
      },
      {
        path: 'service-detail',
        component: ServiceDetailComponent,
        pathMatch: 'full',
      },
      {
        path: 'service-create',
        component: ServiceCreateNavigationComponent,
        //pathMatch: 'full',
        children: [
          {
            path: '',
            component: ServiceCreateComponent,
            pathMatch: 'full',
          },
          {
            path: 'supplier-list',
            component: SupplierServiceListComponent,
            pathMatch: 'full'
          },
          {
            path: 'agency-list',
            component: AgencyServiceListComponent,
            pathMatch: 'full'
          }
        ]
      }

    ]
  },
  {
    path: 'batch-file',
    children: [
      {
        path: '',
        component: BatchFileListComponent,
        pathMatch: 'full',
      },
      {
        path: 'create',
        component: BatchFileCreateComponent,
        pathMatch: 'full',
      },
      {
        path: 'detail',
        component: BatchFileDetailComponent,
        pathMatch: 'full',
      },
      {
        path: 'update',
        component: BatchFileUpdateComponent,
        pathMatch: 'full',
      },
    ]
  },
  {
    path: 'report-reconciliation',
    children:[
      {
        path:'',
        component: ReportReconciliationComponent,
        pathMatch: 'full',
      },
      {
        path:'detail',
        component: ReportReconciliationDetailComponent,
        pathMatch: 'full',
      },
    ]

  },
  {
    path: 'typeEmail',
    children: [
      {
        path: '',
        component: TypeemailListComponent,
        
      },
    ]
  },
  {
    path: 'manageEmail',
    children: [
      {
        path: '',
        component: ManageEmailListComponent,
        
      },
    ]
  },
  {
    path: 'configureData',
    children: [
      // {
      //   path: '',
      //   component: ControlManagementListComponent,
        
      // },
      {
        path: 'create',
        component: ControlManagementCreateComponent,
        
      },
      {
        path: 'config-datasource',
        component: ConfigureDataCreateComponent,
        
      },
      {
        path: 'PostControlreport',
        component: PostControlReportCreateComponent,
      },
      {
        path: 'Controlreport',
        component: ControlReportCreateComponent,
      },
    ]
  },
  {
    path: 'report-revenuecontrol',
    component: ReportRevenuecontrlComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReconciliationRoutingModule { }
