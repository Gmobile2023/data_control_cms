import { Component, Injector, ViewChild, EventEmitter,Output } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
// import { EmailTemplateService, EmailTemplate, GetEmailTemplatesInput } from '@shared/service-proxies/typeEmail';
import { finalize } from 'rxjs';
import { CreateOrUpdateTypeEmailParam, TypeEmailDto, TypeEmailService } from '@shared/service-proxies/type-email-service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'typeemail-create',
  templateUrl: './typeemail-create.component.html',
  styleUrls: ['./typeemail-create.component.css']
})
export class TypeemailCreateComponent extends AppComponentBase {
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() getTypeEmail: EventEmitter<any> = new EventEmitter<any>();
  isVisible = false;
  active = false;
  saving = false;
  typeEmail: TypeEmailDto = new TypeEmailDto();
  constructor(injector: Injector, private _typeEmailService: TypeEmailService) {
    super(injector);
  }
  

  

  
  save(): void {
    const self = this;

    const input = new CreateOrUpdateTypeEmailParam();

    input.emailTemplateTypeCode = self.typeEmail.emailTemplateTypeCode;
    input.description = self.typeEmail.description;
    input.emailTemplateTypeName = self.typeEmail.emailTemplateTypeName;
    

    this.saving = true
    this._typeEmailService
      .createTypeEmail(this.typeEmail)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe((data: any) => {
        if (data.responseStatus && data.responseStatus.errorCode == "01") {
          this.message.error(data.responseStatus.message);
        }
        else {
          this.notify.info(this.l('SavedSuccessfully'));
          // this.router.navigate(['/app/reconciliation/batch-file']);
          this.typeEmail = new CreateOrUpdateTypeEmailParam();
          this.modal.hide();
          this.getTypeEmail.emit(null);
        }

      });
  }
  show(id?: number): void {
    const self = this;
      self.active = true;
      self.modal.show();
  }
  close(): void {
    this.active = false;
    this.typeEmail = new CreateOrUpdateTypeEmailParam();
    this.modal.hide();
  }
}



