import { Component, Injector, ViewChild } from '@angular/core';
import { SupplierCreateComponent } from '../supplier-create/supplier-create.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LazyLoadEvent } from 'primeng/api';
import { GetListSupplierParam, SupplierItemList, SupplierService } from '@shared/service-proxies/supplier-service';
import { finalize } from 'rxjs';

@Component({
  selector: 'suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.css']
})
export class SuppliersListComponent extends AppComponentBase {
  @ViewChild('createSupplierModal', { static: true }) createSupplierModal: SupplierCreateComponent;

  /**
   *
   */
  constructor(injector: Injector,private _supplerService: SupplierService) {
    super(injector);
    
  }

  ngOnInit(): void {
    // Gọi hàm của bạn ở đây
    this.getSuppliers();
  }

  paginator = {
    pageSize : 10,
    pageIndex : 1,
    total: 0
  }
  filterText : string | undefined = "";
   products:  SupplierItemList[] = []

  createSupplier(): void {
    this.createSupplierModal.show();
  }

  getSuppliers(event?: LazyLoadEvent) {
   
    this.primengTableHelper.showLoadingIndicator();

    this._supplerService
      .getSuppliers(
        new GetListSupplierParam({
           SupplierName : this.filterText,
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

  deleteSupplier(supplier: SupplierItemList): void {

    this.message.confirm(`Nhà cung cấp ${supplier.supplierName} sẽ bị xóa`, this.l('AreYouSure'), (isConfirmed) => {
        if (isConfirmed) {
            this._supplerService.deleteSupplier(supplier.supplierId).subscribe((data : any) => {
              if (data.responseStatus && data.responseStatus.errorCode == "01") {
                this.message.info(data.responseStatus.message);
              }
              else {
                this.notify.success(this.l('SuccessfullyDeleted'));
                this.getSuppliers();
              }
            });
        }
    });
  }

  onPageChange(event : any) {
    this.paginator.pageIndex = event.page + 1;
    this.paginator.pageSize = event.rows;

    this.getSuppliers();
  }
}
