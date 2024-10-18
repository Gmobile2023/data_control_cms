import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { finalize } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { ManageService, PackOfDataDto, PagedResultRevenueControlDto, RevenueControlListItem, RevenueControlListSearch } from '@shared/service-proxies/manage-service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ControlManagementCreateComponent } from '../control-management-create/control-management-create.component';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'control-management-list',
  templateUrl: './control-management-list.component.html',
  styleUrls: ['./control-management-list.component.css']
})
export class ControlManagementListComponent extends AppComponentBase {
  @ViewChild('createControlManagementForm', { static: true }) createControlManagementForm: ControlManagementCreateComponent;

  constructor(injector: Injector
    , public _manageService: ManageService
    , private router: Router
  ) {
    super(injector);
  }

  paginator = {
    pageSize: 10,
    pageIndex: 1,
    total: 0
  }
  filterText: string | undefined = "";

  listItem: RevenueControlListItem[] = []

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.primengTableHelper.showLoadingIndicator();
    this._manageService
      .getReveneuControls(new RevenueControlListSearch({
        Filter: this.filterText,
        SkipCount: this.paginator.pageIndex,
        MaxResultCount: this.paginator.pageSize,
      }))
      .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
      .subscribe((result) => {
        this.listItem = result.items;
        this.paginator.total = result.totalCount;
        this.primengTableHelper.hideLoadingIndicator();
      });
  }

  onPageChange(event: any) {
    this.paginator.pageIndex = event.page + 1;
    this.paginator.pageSize = event.rows;

    this.getList();
  }

  navigategetDetail(id: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: { Id: id } // Truyền tham số dưới dạng queryParams
    };
    this.router.navigate(['/app/reconciliation/configureData/create'], navigationExtras);
  }
}
