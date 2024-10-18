import { Component, HostListener, Injector } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { GetServiceParam, ServiceItemList, ServiceService, ServiceDto, UpdateStatusServiceParam } from '@shared/service-proxies/service-service';
import { DropdownListServiceTypeParam, ServiceTypeItemList, ServiceTypeService } from '@shared/service-proxies/servicetype-service';
import { LazyLoadEvent } from 'primeng/api';
import { finalize } from 'rxjs';

@Component({
  selector: 'service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent extends AppComponentBase {

  filterText: string | undefined = "";
  agencyId: number | undefined;
  agencyCode: string = "";
  supplierId: number | undefined;
  serviceTypeId: any | undefined;
  cycle: number | undefined = 0;
  status: number | undefined;
  paginator = {
    pageSize: 10,
    pageIndex: 1,
    total: 0
  }
  listItems: ServiceItemList[] = []
  listItemsServiceType: ServiceTypeItemList[] = [];
  selectedStatus: string = "Chọn trạng thái";
  serviceList: ServiceDto = new ServiceDto();

  constructor(injector: Injector
    , public _serviceService: ServiceService
    , private _serviceTypeService: ServiceTypeService
    , private router: Router
  ) {
    super(injector);
  }
  
  ngOnInit(): void {

    // Gọi hàm của bạn ở đây
    this.getService();
    this.getDropdownServiceType();

  }

  complete(status: any, id: any) {
    this._serviceService.updateserviceStatusParam.status = status;
    this._serviceService.updateserviceStatusParam.serviceId = id;
    this._serviceService
      .updateServiceStatus()
      .subscribe((result: any) => {
        this.notify.info(this.l('SavedSuccessfully'));
        const item = this.listItems.find(i => i.id === id);
        this._serviceService.updateServiceStatus().subscribe((result: any) => {
          item.status = status
        });
        //  this.getService()
        this._serviceService.updateserviceStatusParam = new UpdateStatusServiceParam();
      });
  }

  getService(event?: LazyLoadEvent) {

    this.primengTableHelper.showLoadingIndicator();
    this._serviceService
      .getService(
        new GetServiceParam({
          ServiceName: this.filterText,
          ServiceTypeId: this.serviceTypeId === "0" ? null : this.serviceTypeId,
          SupplierId: this.supplierId,
          AgencyId: this.agencyId,
          Status: this.status,
          Cycle: this.cycle,
          SkipCount: this.paginator.pageIndex,
          MaxResultCount: this.paginator.pageSize,
          agencyCode: this.agencyCode,
        })
      )
      .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
      .subscribe((result) => {
        this.listItems = result.items;
        this.paginator.total = result.totalCount;
        this.primengTableHelper.hideLoadingIndicator();
      });
  }

  onPageChange(event: any) {
    this.paginator.pageIndex = event.page + 1;
    this.paginator.pageSize = event.rows;

    this.getService();
  }

  getDropdownServiceType() {

    this.primengTableHelper.showLoadingIndicator();

    this._serviceTypeService
      .getDropdownServiceType(
        new DropdownListServiceTypeParam({
          ServiceTypeName: ""
        })
      )
      .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
      .subscribe((result) => {
        this.listItemsServiceType = this.listItemsServiceType.concat(result);
        this.primengTableHelper.hideLoadingIndicator();
      });
  }

  navigateDetail(serviceId: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: { serviceId: serviceId } // Truyền tham số dưới dạng queryParams
    };
    this.router.navigate(['/app/reconciliation/service/service-create'], navigationExtras);
  }

  navigategetDetail(serviceId: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: { serviceId: serviceId } // Truyền tham số dưới dạng queryParams
    };
    this.router.navigate(['/app/reconciliation/service/service-detail'], navigationExtras);
  }

  getStatusText(status: number) {
    return status == 1 ? "Hoạt động" : "Không hoạt động";
  }

  deleteSupplier(service: ServiceItemList): void {
    this.message.confirm(`Dịch vụ ${service.serviceName} sẽ bị xóa`, this.l('AreYouSure'), (isConfirmed) => {
      if (isConfirmed) {
        this._serviceService.deleteService(service.id).subscribe(() => {
          this.notify.success(this.l('SuccessfullyDeleted'));
          this.getService();
        });
      }
    });
  }

  onServiceTypeChange(event: any) {
    if (!event.value) {
      this.serviceTypeId = null; // Reset the value when nothing is selected
    }
  }

  onServiceTypeSelect(selectedItem: any) {
    if (selectedItem) {
      this.serviceTypeId = selectedItem.id;
      // Tùy theo nhu cầu, bạn có thể thực hiện các hành động khác ở đây
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const ele = document.getElementById('mydiv');
    ele.click();
  }
}


