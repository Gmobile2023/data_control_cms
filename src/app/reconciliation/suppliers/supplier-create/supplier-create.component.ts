import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { CreateOrUpdateRoleInput, RoleEditDto, RoleServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrUpdateSupplierParam, SupplierDto, SupplierService } from '@shared/service-proxies/supplier-service';

@Component({
  selector: 'supplier-create',
  templateUrl: './supplier-create.component.html',
  styleUrls: ['./supplier-create.component.css']
})
export class SupplierCreateComponent extends AppComponentBase {
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

  @Output() getSuppliers: EventEmitter<any> = new EventEmitter<any>();

  active = false;
  saving = false;

  supplier: SupplierDto = new SupplierDto();
  constructor(injector: Injector, private _supplierService: SupplierService) {
      super(injector);
  }

  show(roleId?: number): void {
      const self = this;
      self.active = true;

      self._supplierService.getSupplierForEdit(roleId).subscribe((data : any) => {
          if(data.responseStatus && data.responseStatus.errorCode == "01")
          {
             this.message.info(data.responseStatus.message);
             this.close();
             this.getSuppliers.emit(null);
          }
          else{
            self.supplier = SupplierDto.fromJS(data.results);
            self.modal.show();
          }
      });
  }

//   onShown(): void {
//       document.getElementById('RoleDisplayName').focus();
//   }

  save(): void {
    const self = this;

    const input = new CreateOrUpdateSupplierParam();

    input.companyName = self.supplier.companyName;
    input.description = self.supplier.description;
    input.supplierName = self.supplier.supplierName;
    input.email = self.supplier.email;
    input.sFTPLink = self.supplier.sFTPLink;
    input.sFTPLinkAccount = self.supplier.sFTPLinkAccount;
    input.sFTPLinkPassword = self.supplier.sFTPLinkPassword;
    input.supplierCode = self.supplier.supplierCode;

    this.saving = true;
    if (!self.supplier.supplierId) {
      this._supplierService
        .createSupplier(input)
        .pipe(finalize(() => (this.saving = false)))
        .subscribe((data:any) => {
          if (data.responseStatus && data.responseStatus.errorCode == "01") {
            this.message.error(data.responseStatus.message);
          }
          else
          {
            this.notify.info(this.l('SavedSuccessfully'));
            this.close();
            this.getSuppliers.emit(null);
          }
          
        });
    } else {
      this._supplierService
      .updateSupplier(input, self.supplier.supplierId) // Gửi supplierCode là chuỗi
      .pipe(finalize(() => (this.saving = false)))
      .subscribe((data:any) => {
        if (data.responseStatus && data.responseStatus.errorCode == "01") {
          this.message.error(data.responseStatus.message);
        }
        else
        {
          this.notify.info(this.l('SavedSuccessfully'));
        this.close();
        this.getSuppliers.emit(null);
        }
        
      });
    }
  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }
}
