import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateServiceTypeParam, ServiceTypeDTO, ServiceTypeService } from '@shared/service-proxies/servicetype-service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs';

@Component({
  selector: 'create-service-type',
  templateUrl: './create-service-type.component.html',
  styleUrls: ['./create-service-type.component.css']
})
export class CreateServiceTypeComponent extends AppComponentBase {
  @ViewChild('createServiceTypeModal', { static: true }) modal: ModalDirective;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() getServiceType: EventEmitter<any> = new EventEmitter<any>();


  serviceType: ServiceTypeDTO = new ServiceTypeDTO();
  constructor(injector: Injector, private _serviceTypeService: ServiceTypeService) {
    super(injector);
  }
  show(roleId?: number): void {
    const self = this;
    self.active = true;
    if (roleId) {
      self._serviceTypeService.getServiceTypeForEdit(roleId).subscribe((data: any) => {
        if (data.responseStatus && data.responseStatus.errorCode == "01") {
          this.message.info(data.responseStatus.message);
          this.close();
          this.getServiceType.emit(null);
        }
        else {
          self.serviceType = ServiceTypeDTO.fromJS(data.results);
          self.modal.show();
        }
      });
    }
    else {
      self.modal.show();
    }

  }

  active = false;
  saving = false;

  save(): void {
    const self = this;

    const input = new CreateServiceTypeParam();
    input.serviceTypeCode = self.serviceType.serviceTypeCode;
    input.serviceTypeName = self.serviceType.serviceTypeName;
    input.description = self.serviceType.description;

    this.saving = true;
    if (!self.serviceType.id) {
      this._serviceTypeService
        .createServiceType(input)
        .pipe(finalize(() => (this.saving = false)))
        .subscribe((data: any) => {
          if (data.responseStatus && data.responseStatus.errorCode == "01") {
            this.message.error(data.responseStatus.message);
          }
          else {
            this.notify.info(this.l('SavedSuccessfully'));
            this.close();
            this.getServiceType.emit(null);
            this.serviceType = new ServiceTypeDTO;
          }

        },
        );
    }
    else {
      this._serviceTypeService
        .updateServiceType(input, self.serviceType.id)
        .pipe(finalize(() => (this.saving = false)))
        .subscribe((data:any) => {
          if (data.responseStatus && data.responseStatus.errorCode == "01") {
            this.message.error(data.responseStatus.message);
          }
          else {
            this.notify.info(this.l('SavedSuccessfully'));
            this.close();
            this.getServiceType.emit(null);
            this.serviceType = new ServiceTypeDTO;
          }
        });
    }

  }
  close(): void {
    this.active = false;
    this.serviceType = new ServiceTypeDTO();
    this.modal.hide();

  }
}
