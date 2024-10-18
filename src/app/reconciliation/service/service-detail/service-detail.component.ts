import { HttpClient } from '@angular/common/http';
import { Component, Injector } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AgencyServiceListItem, ServiceDetailRespon, ServiceService, SupplierServiceListItem } from '@shared/service-proxies/service-service';

@Component({
  selector: 'service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent extends AppComponentBase{
  serviceId: number;
  constructor(injector: Injector, private router: Router
    , public serviceService: ServiceService
    , private route: ActivatedRoute
    , private _httpClient: HttpClient
  ) {
    super(injector);
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.serviceId = params['serviceId'];
      if (this.serviceId) {
        const url = AppConsts.remoteServiceBaseUrl + '/api/services/app/Service/GetServiceDetail?id=' + this.serviceId

        this._httpClient
          .get<any>(url)
          .subscribe((response) => {
            if (response.success) {
              if (response?.result?.responseStatus?.errorCode == "00") {
                  const objDetail = response?.result?.results
                  this.serviceService.serviceDetail = ServiceDetailRespon.fromJS(objDetail)

                  this.serviceService.suppliersForDetail = []
                  for(let item of objDetail.listSupplier)
                  {
                    this.serviceService.suppliersForDetail.push(SupplierServiceListItem.fromJS(item))
                  }

                  this.serviceService.agenciesForDetail = []
                  for(let item of objDetail.listAgency)
                  {
                    this.serviceService.agenciesForDetail.push(AgencyServiceListItem.fromJS(item))
                  }
              }
              else {
                this.notify.error(response?.result?.responseStatus?.message);
              }
            } else if (response.error != null) {
              this.notify.error('Có lỗi xảy ra');
            }
          });
      }
    });
  }
  navigateDetail(serviceId : any)
  {
    const navigationExtras: NavigationExtras = {
      queryParams: { serviceId: serviceId } // Truyền tham số dưới dạng queryParams
    };
    this.router.navigate(['/app/reconciliation/service/service-create'], navigationExtras);
  }
}
