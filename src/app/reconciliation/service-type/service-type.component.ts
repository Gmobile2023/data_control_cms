import { Component, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateServiceTypeComponent } from './create-service-type/create-service-type.component';
import { GetServiceTypeParam, ServiceTypeItemList, ServiceTypeService } from '@shared/service-proxies/servicetype-service';
import { LazyLoadEvent } from 'primeng/api';
import { finalize } from 'rxjs';

@Component({
  selector: 'service-type',
  templateUrl: './service-type.component.html',
  styleUrls: ['./service-type.component.css']
})
export class ServiceTypeComponent extends AppComponentBase{
  @ViewChild('createServiceTypeModal', { static: true }) createServiceTypeModal: CreateServiceTypeComponent;

  constructor(injector: Injector,private _serviceTypeService: ServiceTypeService) {
    super(injector);
    
  }
  ngOnInit(): void {
    // Gọi hàm của bạn ở đây
    this.getServiceType();
  }
  paginator = {
    pageSize : 10,
    pageIndex : 1,
    total: 0
  }
   filterText : string | undefined = "";
   listItems:  ServiceTypeItemList[] = []
  createServiceType(): void {
    this.createServiceTypeModal.show();
  }
  getServiceType(event?: LazyLoadEvent) {
   
    this.primengTableHelper.showLoadingIndicator();

    this._serviceTypeService
      .getServiceType(
        new GetServiceTypeParam({
           ServiceTypeName : this.filterText,
           SkipCount: this.paginator.pageIndex,
           MaxResultCount: this.paginator.pageSize
        })
      )
      .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
      .subscribe((result) => {
        this.listItems = result.items;
        this.paginator.total = result.totalCount;
        this.primengTableHelper.hideLoadingIndicator();
      });
  }
  onPageChange(event : any) {
    this.paginator.pageIndex = event.page + 1;
    this.paginator.pageSize = event.rows;

    this.getServiceType();
  }
  deleteServiceType(serviceType: ServiceTypeItemList): void {

    this.message.confirm(`Loại dịch vụ ${serviceType.serviceTypeName} sẽ bị xóa`, this.l('AreYouSure'), (isConfirmed) => {
        if (isConfirmed) {
            this._serviceTypeService.deleteServiceType(serviceType.id)
            .subscribe((data : any) => {
              if (data.responseStatus && data.responseStatus.errorCode == "01") {
                this.message.info(data.responseStatus.message);
              }
              else {
                this.notify.success(this.l('SuccessfullyDeleted'));
                this.getServiceType();
              }
                
            });
        }
    });
  }


  



}
