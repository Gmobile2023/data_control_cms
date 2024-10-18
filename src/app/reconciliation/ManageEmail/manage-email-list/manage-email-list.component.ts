import { Component, Injector, ViewChild, NgModule } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ManageEmailCreateComponent } from '../manage-email-create/manage-email-create.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LazyLoadEvent } from 'primeng/api';
import { ManageEmailUpdateComponent } from '../manage-email-update/manage-email-update.component';
import { CreateOrUpdateManageEmailParam, ManageEmailDto, ManageEmailService, UpdateStatusEmailTemplate } from '@shared/service-proxies/manage-email-service';
import { GetListManageEmailParam, ManageEmailItemList, PagedResultDtoOfManageEmailListDto } from '@shared/service-proxies/manage-email-service';
import { finalize, from } from 'rxjs';
import { ManageEmailDetailComponent } from '../manage-email-detail/manage-email-detail.component';


@Component({
  selector: 'manage-email-list',
  templateUrl: './manage-email-list.component.html',
  styleUrls: ['./manage-email-list.component.css']
})
export class ManageEmailListComponent extends AppComponentBase {
  @ViewChild('createManageEmailModal', { static: true }) createManageEmailModal: ManageEmailCreateComponent;
  @ViewChild('updateManageEmailModal', { static: true }) updateManageEmailModal: ManageEmailUpdateComponent;
  @ViewChild('detailManageEmailModal', { static: true }) detailManageEmailModal: ManageEmailDetailComponent;
  // typeEmail : TypeemailCreateComponent[] = []
  constructor(injector: Injector, private _manageEmailService: ManageEmailService) {
    super(injector);
  }
  ngOnInit(): void {
    // Gọi hàm của bạn ở đây
    this.getManageEmail();
  }
  paginator = {
    pageSize: 10,
    pageIndex: 1,
    total: 0
  }

  filterText: string | undefined = "";
  products: ManageEmailItemList[] = []

  openCreateModal(id?: number) {
    this.createManageEmailModal.show();
  }
  openUpdateModal(id?: number) {
    this.updateManageEmailModal.show();
  }

  getManageEmail(event?: LazyLoadEvent) {

    this.primengTableHelper.showLoadingIndicator();

    this._manageEmailService
      .getManageEmail(
        new GetListManageEmailParam({
          emailTemplateName: this.filterText,
          SkipCount: this.paginator.pageIndex,
          MaxResultCount: this.paginator.pageSize
        })
      )
      .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
      .subscribe((result) => {
        this.paginator.total = result.totalCount;
        this.products = result.items;
        //this.setUsersProfilePictureUrl(this.primengTableHelper.records);
        this.primengTableHelper.hideLoadingIndicator();
      });
  }

  deleteManageEmail(manageEmail: ManageEmailItemList): void {

    this.message.confirm(`Mẫu Email ${manageEmail.emailTemplateName} sẽ bị xóa`, this.l('AreYouSure'), (isConfirmed) => {
      if (isConfirmed) {
        this._manageEmailService.deleteManageEmail(manageEmail.id).subscribe((data: any) => {
          //this.reloadPage();
          if (data.responseStatus && data.responseStatus.errorCode == "01") {
            this.message.info(data.responseStatus.message);
          }
          else {
            this.notify.success(this.l('SuccessfullyDeleted'));
            this.getManageEmail();
          }
        });
      }
    });
  }

  onPageChange(event: any) {
    this.paginator.pageIndex = event.page + 1;
    this.paginator.pageSize = event.rows;

    this.getManageEmail();
  }

  navigateUpdate(id: any) {
    this.updateManageEmailModal.show(id);
  }
  navigateDetail(id: any) {
    this.detailManageEmailModal.show(id);
  }

  updateStatus(idEmailTemplate: number, active: boolean) {
    this.primengTableHelper.showLoadingIndicator();
    let email = this.products.find(x => x.id == idEmailTemplate)
    this._manageEmailService
      .updateStatusEmailTemplate(
        new UpdateStatusEmailTemplate(
          {
            emailTemplateId: idEmailTemplate,
            active: active
          }
        )
      )
      .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
      .subscribe((data: any) => {
        if (data.responseStatus && data.responseStatus.errorCode == "01") {
          this.message.info(data.responseStatus.message);
          email.active = !email.active  
        }
        else {
          this.notify.success(this.l('Cập nhật trạng thái thành công'));
        }

        //this.getManageEmail();
      });
  }
}