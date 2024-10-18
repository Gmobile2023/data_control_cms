import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReconciliationRoutingModule } from './reconciliation-routing.module';
import { SuppliersListComponent } from './suppliers/suppliers-list/suppliers-list.component';
import { TreeDragDropService } from 'primeng/api';
import {
  BsDatepickerConfig,
  BsDatepickerModule,
  BsDaterangepickerConfig,
  BsLocaleService,
} from 'ngx-bootstrap/datepicker';
import { NgxBootstrapDatePickerConfigService } from '../../assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SubheaderModule } from '@app/shared/common/sub-header/subheader.module';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
import { SupplierCreateComponent } from './suppliers/supplier-create/supplier-create.component';
import { AgencyCreateComponent } from './agencies/agency-create/agency-create.component';
import { AgencyListComponent } from './agencies/agency-list/agency-list.component';
import { ServiceTypeComponent } from './service-type/service-type.component';
import { CreateServiceTypeComponent } from './service-type/create-service-type/create-service-type.component';
import { ServiceListComponent } from './service/service-list/service-list.component';
import { ServiceCreateNavigationComponent } from './service/service-create-navigation/service-create-navigation.component';
import { ToastModule } from 'primeng/toast';
import { StepsModule } from 'primeng/steps';
import { ServiceCreateComponent } from './service/service-create-navigation/service-create/service-create.component';
import { BatchFileListComponent } from './batch-file/batch-file-list/batch-file-list.component';
import { BatchFileCreateComponent } from './batch-file/batch-file-create/batch-file-create.component';
import { BatchFileDetailComponent } from './batch-file/batch-file-detail/batch-file-detail.component';
import { BatchFileUpdateComponent } from './batch-file/batch-file-update/batch-file-update.component';
import { AgencyServiceCreateComponent } from './service/service-create-navigation/agency-service-create/agency-service-create.component';
import { SupplierServiceListComponent } from './service/service-create-navigation/supplier-service-list/supplier-service-list.component';
import { AgencyServiceListComponent } from './service/service-create-navigation/agency-service-list/agency-service-list.component';
import { SupplierServiceCreateComponent } from './service/service-create-navigation/supplier-service-create/supplier-service-create.component';
import { CalendarModule } from 'primeng/calendar';
import { ServiceDetailComponent } from './service/service-detail/service-detail.component';
import { ReportReconciliationComponent } from './report-reconciliation/report-reconciliation/report-reconciliation.component';
import { ReportReconciliationDetailComponent } from './report-reconciliation/report-reconciliation-detail/report-reconciliation-detail.component';
import { MatchingLogsComponent } from './report-reconciliation/matching-logs/matching-logs.component';
import { ModalListFileComponent } from './report-reconciliation/modal-list-file/modal-list-file.component';
import { ManageEmailListComponent } from './ManageEmail/manage-email-list/manage-email-list.component';
import { ManageEmailCreateComponent } from './ManageEmail/manage-email-create/manage-email-create.component';
import { ManageEmailUpdateComponent } from './ManageEmail/manage-email-update/manage-email-update.component';
import { TypeemailListComponent } from './TyepEmail/type-email-list/typeemail-list.component';
import { TypeemailCreateComponent } from './TyepEmail/type-email-create/typeemail-create.component';
import { TypeemailUpdateComponent } from './TyepEmail/type-email-update/typeemail-update.component';
import { ManageEmailDetailComponent } from './ManageEmail/manage-email-detail/manage-email-detail.component';
import { ModalFileReconcileSupplierComponent } from './report-reconciliation/modal-file-reconcile-supplier/modal-file-reconcile-supplier.component';
import { PanelModule } from 'primeng/panel';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ModalFileReconcileAgencyComponent } from './report-reconciliation/modal-file-reconcile-agency/modal-file-reconcile-agency.component';
import { ControlManagementListComponent } from './manage/control-management-list/control-management-list.component';
import { ControlManagementCreateComponent } from './manage/control-management-create/control-management-create.component';
import { ConfigureDataCreateComponent } from './manage/configure-data-create/configure-data-create.component';
import { ConfigurePostReconciliationListComponent } from './manage/configure-post-reconciliation-list/configure-post-reconciliation-list.component';
import { PostControlReportCreateComponent } from './manage/post-control-report-create/post-control-report-create.component';
import { CheckboxModule } from 'primeng/checkbox';
import { ControlReportCreateComponent } from './manage/control-report-create/control-report-create.component';
import { ReportRevenuecontrlComponent } from './report-revenuecontrl/report-revenuecontrl.component';

@NgModule({
  declarations: [
    SuppliersListComponent,
    SupplierCreateComponent,
    AgencyCreateComponent,
    AgencyListComponent,
    ServiceTypeComponent,
    CreateServiceTypeComponent,
    ServiceListComponent,
    ServiceCreateNavigationComponent,
    ServiceCreateComponent,
    BatchFileListComponent,
    BatchFileCreateComponent,
    BatchFileDetailComponent,
    BatchFileUpdateComponent,
    SupplierServiceListComponent,
    AgencyServiceListComponent,
    AgencyServiceCreateComponent,
    SupplierServiceCreateComponent,
    ServiceDetailComponent,
    ReportReconciliationComponent,
    ReportReconciliationDetailComponent,
    MatchingLogsComponent,
    ModalListFileComponent,
    TypeemailListComponent,
    ManageEmailListComponent,
    ManageEmailCreateComponent,
    ManageEmailUpdateComponent,
    TypeemailCreateComponent,
    TypeemailUpdateComponent,
    ManageEmailDetailComponent,
    ModalFileReconcileSupplierComponent,
    ModalFileReconcileAgencyComponent,
    ControlManagementListComponent,
    ControlManagementCreateComponent,
    ConfigureDataCreateComponent,
    ConfigurePostReconciliationListComponent,
    PostControlReportCreateComponent,
    ControlReportCreateComponent,
    ReportRevenuecontrlComponent
  ],
  imports: [
    CommonModule,
    ReconciliationRoutingModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    SubheaderModule,
    AppSharedModule,
    AdminSharedModule,
    ToastModule,
    StepsModule,
    CalendarModule,
    PanelModule,
    NgSelectModule,
    FormsModule,
    CheckboxModule,
  ]
})
export class ReconciliationModule { }
