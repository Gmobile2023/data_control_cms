import { Component, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AgencyServiceListItem, ServiceDto, ServiceService, SupplierServiceListItem } from '@shared/service-proxies/service-service';
import { environment } from 'environments/environment';
import { AgencyServiceCreateComponent } from '../agency-service-create/agency-service-create.component';
import { Router } from '@angular/router';
import { ServiceTypeService } from '@shared/service-proxies/servicetype-service';
import { BftemplateService } from '@shared/service-proxies/bftemplate.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'agency-service-list',
  templateUrl: './agency-service-list.component.html',
  styleUrls: ['./agency-service-list.component.css']
})
export class AgencyServiceListComponent extends AppComponentBase{
  @ViewChild('createAgencyServiceModal', { static: true }) createAgencyServiceModal: AgencyServiceCreateComponent;
  agencies : AgencyServiceListItem[] = [];

  constructor(injector: Injector, private router: Router
    , private _serviceTypeService : ServiceTypeService
    , private _bfService : BftemplateService
    , public _serviceService : ServiceService
    ) {
    super(injector);
  }

  ngOnInit(): void {

  }
  createServiceType(): void {
    this.createAgencyServiceModal.show();
  }

  openCreateModal(id? : number)
  {
     this.createAgencyServiceModal.show(id);
  }
  cancel()
  {
     this.router.navigate(['/app/reconciliation/service']);
     this._serviceService.service  = new ServiceDto();
     this._serviceService.saving = false;
     this._serviceService.suppliers = [];
     this._serviceService.agencies=[];
     this._serviceService.date = new Date()
     this._serviceService.templateBatchFile = [];
     this._serviceService.serviceId = undefined
  }
  updateStatus(id: number, status: boolean) {
    const indexInArr = this._serviceService.service.agencyServices.findIndex(x => x.id == id)
    this._serviceService.service.agencyServices[indexInArr].status = status;
    const indexInList = this._serviceService.agencies.findIndex(x => x.id == id)
    this._serviceService.agencies[indexInList].status = status ? "Hoạt động" : "Không hoạt động"

    this.notify.info(this.l('SavedSuccessfully'));
  }
  complete()
  {
    this._serviceService.saving = true;
    this._serviceService
      .createService()
      .pipe(finalize(() => this._serviceService.saving = false))
      .subscribe((result : any) => {
         this.notify.info(this.l('SavedSuccessfully'));
         this.router.navigate(['/app/reconciliation/service']);
         this._serviceService.service=new ServiceDto();
         this._serviceService.agencies=[];
         this._serviceService.suppliers=[];
         this._serviceService.date = new Date()
         this._serviceService.templateBatchFile = [];
         this._serviceService.serviceId = undefined
      });
  }
}
