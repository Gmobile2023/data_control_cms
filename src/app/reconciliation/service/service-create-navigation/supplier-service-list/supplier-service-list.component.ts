import { HttpClient } from '@angular/common/http';
import { Component, Injector, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ServiceDto, ServiceService, SupplierServiceListItem } from '@shared/service-proxies/service-service';
import { environment } from 'environments/environment';
import { SupplierServiceCreateComponent } from '../supplier-service-create/supplier-service-create.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'supplier-service-list',
  templateUrl: './supplier-service-list.component.html',
  styleUrls: ['./supplier-service-list.component.css']
})
export class SupplierServiceListComponent extends AppComponentBase {
  constructor(injector: Injector
    , private router: Router
    , public service: ServiceService
    , private _httpClient: HttpClient
  ) {
    super(injector);
  }

  @ViewChild('createSupplierModal', { static: true }) createSupplierModal: SupplierServiceCreateComponent;
  suppliers : SupplierServiceListItem[] = []

  ngOnInit(): void {
  }

  openCreateModal(id? : number)
  {
     this.createSupplierModal.show(id);
  }

  cancel()
  {
    this.router.navigate(['/app/reconciliation/service']);
    this.service.service  = new ServiceDto();
    this.service.saving = false;
    this.service.suppliers = []
    this.service.agencies=[];
    this.service.date = new Date()
    this.service.templateBatchFile = [];
    this.service.serviceId = undefined
  }

  complete()
  {
    this.service.saving = true;
    this.service
      .createService()
      .pipe(finalize(() => this.service.saving = false))
      .subscribe((result : any) => {
         this.notify.info(this.l('SavedSuccessfully'));
         this.router.navigate(['/app/reconciliation/service']);
         this.service.service=new ServiceDto();
         this.service.agencies=[];
         this.service.suppliers=[];
         this.service.date = new Date()
         this.service.templateBatchFile = [];
         this.service.serviceId = undefined
      });
  }

  updateStatus(id: number, status: boolean) {
    const indexInArr = this.service.service.supplierServices.findIndex(x => x.id == id)
    this.service.service.supplierServices[indexInArr].status = status;
    const indexInList = this.service.suppliers.findIndex(x => x.id == id)
    this.service.suppliers[indexInList].status = status ? "Hoạt động" : "Không hoạt động"

    this.notify.info(this.l('SavedSuccessfully'));
  }
}
