import { Component, Injector, ViewChild, EventEmitter,Output } from '@angular/core';
import { finalize } from 'rxjs';
import { CreateOrUpdateTypeEmailParam, TypeEmailDto, TypeEmailService } from '@shared/service-proxies/type-email-service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/common/app-component-base';
import { extend } from 'lodash-es';


@Component({
  selector: 'typeemail-update',
  templateUrl: './typeemail-update.component.html',
  styleUrls: ['./typeemail-update.component.css']
})
export class TypeemailUpdateComponent extends AppComponentBase {
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() getTypeEmail: EventEmitter<any> = new EventEmitter<any>();
  isVisible = false;
  active = false;
  saving = false;
  typeEmail: TypeEmailDto = new TypeEmailDto();
  message: any;
  notify: any;
  constructor(injector: Injector, private _typeEmailService: TypeEmailService) {
    super(injector);
  }

  
  save(): void {
    const self = this;

    const input = new CreateOrUpdateTypeEmailParam();

    input.emailTemplateTypeCode = self.typeEmail.emailTemplateTypeCode;
    input.description = self.typeEmail.description;
    input.emailTemplateTypeName = self.typeEmail.emailTemplateTypeName;
    input.id = self.typeEmail.id;
    
    this.saving = true;
   
      
      this._typeEmailService
      .updateTypeEmail(input, self.typeEmail.id) // Gửi supplierCode là chuỗi
      .pipe(finalize(() => (this.saving = false)))
      .subscribe((data:any) => {
        if (data.responseStatus && data.responseStatus.errorCode == "01") {
          this.message.error(data.responseStatus.message);
        }
        else
        {
          this.notify.info(this.l('SavedSuccessfully'));
        this.close();
        this.getTypeEmail.emit(null);
        }
        
      });
  }
  
 

  show(id?: number): void {
    const self = this;
      self.active = true;

      self._typeEmailService.getTypeEmailForEdit(id).subscribe((data : any) => {
        
          if(data.responseStatus && data.responseStatus.errorCode == "01")
          {
             this.message.info(data.responseStatus.message);
             this.close();
             this.getTypeEmail.emit(null);
          }
          else{
            self.typeEmail = TypeEmailDto.fromJS(data.results);
            self.modal.show();
          }
      });
  }
  close(): void {
    this.active = false;
    this.typeEmail = new CreateOrUpdateTypeEmailParam();
    this.modal.hide();
  }
}


