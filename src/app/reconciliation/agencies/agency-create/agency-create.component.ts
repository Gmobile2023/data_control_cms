import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AgencyDto, AgencyService, CreateOrUpdateAgencyParam } from '@shared/service-proxies/agency-service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs';

@Component({
  selector: 'agency-create',
  templateUrl: './agency-create.component.html',
  styleUrls: ['./agency-create.component.css']
})
export class AgencyCreateComponent extends AppComponentBase{
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

  @Output() getAgencies: EventEmitter<any> = new EventEmitter<any>();

  active = false;
  saving = false;

  agency: AgencyDto = new AgencyDto();
  constructor(injector: Injector, private _agencyService: AgencyService) {
      super(injector);
  }

  show(roleId?: number): void {
      const self = this;
      self.active = true;

      self._agencyService.getAgencyForEdit(roleId).subscribe((data : any) => {
          if(data.responseStatus && data.responseStatus.errorCode == "01")
          {
             this.message.info(data.responseStatus.message);
             this.close();
             this.getAgencies.emit(null);
          }
          else{
            self.agency = AgencyDto.fromJS(data.results);
            self.modal.show();
          }
      });
  }

//   onShown(): void {
//       document.getElementById('RoleDisplayName').focus();
//   }

  save(): void {
      const self = this;

      const input = new CreateOrUpdateAgencyParam();
      input.companyName = self.agency.companyName;
      input.description = self.agency.description;
      input.agencyName = self.agency.agencyName;
      input.agencyCode = self.agency.agencyCode;
      input.email = self.agency.email;
      input.sFTPLink = self.agency.sFTPLink;
      input.sFTPLinkAccount = self.agency.sFTPLinkAccount;
      input.sFTPLinkPassword = self.agency.sFTPLinkPassword;

      this.saving = true;
        if(!self.agency.agencyId)
        {
          this._agencyService
          .createAgency(input)
          .pipe(finalize(() => (this.saving = false)))
          .subscribe((data:any) => {
            if (data.responseStatus && data.responseStatus.errorCode == "01") {
              this.message.error(data.responseStatus.message);
            }
            else{
              this.notify.info(this.l('SavedSuccessfully'));
              this.close();
              this.getAgencies.emit(null);
            }
              
          });
        }
       else{
        this._agencyService
        .updateAgency(input, self.agency.agencyId)
        .pipe(finalize(() => (this.saving = false)))
        .subscribe((data:any) => {
          if (data.responseStatus && data.responseStatus.errorCode == "01") {
            this.message.error(data.responseStatus.message);
          }
          else{
            this.notify.info(this.l('SavedSuccessfully'));
            this.close();
            this.getAgencies.emit(null);
          }
            
        });
      }
   }

  close(): void {
      this.active = false;
      this.modal.hide();
  }
}
