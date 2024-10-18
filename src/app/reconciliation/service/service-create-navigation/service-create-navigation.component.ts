import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ThemeSettingsDto } from '@shared/service-proxies/service-proxies';
import { AgencyServiceListItem, EmailTemplate, ServiceDto, ServiceService, SupplierServiceListItem } from '@shared/service-proxies/service-service';
import { environment } from 'environments/environment';
import { forEach, forIn } from 'lodash-es';

@Component({
  selector: 'service-create-navigation',
  templateUrl: './service-create-navigation.component.html',
  styleUrls: ['./service-create-navigation.component.css'],
})
export class ServiceCreateNavigationComponent extends AppComponentBase {

  serviceId: number

  constructor(injector: Injector, private router: Router
    , public serviceService: ServiceService
    , private route: ActivatedRoute
    , private _httpClient: HttpClient
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.serviceService.service = new ServiceDto();
    this.serviceService.agencies = [];
    this.serviceService.suppliers = [];
    this.serviceService.date = new Date()
    this.serviceService.templateBatchFile = [];
    
    this.route.queryParams.subscribe(params => {
      this.serviceId = params['serviceId'];
      this.serviceService.service.sendReportChecked =  this.serviceService.service.isSendMail ||  this.serviceService.service.isUploadFile
      if (this.serviceId && !this.serviceService.serviceId) {
        const url = AppConsts.remoteServiceBaseUrl + '/api/services/app/Service/DetailForUpdate?ServiceId=' + this.serviceId

        this._httpClient
          .get<any>(url)
          .subscribe((response) => {
            if (response.success) {
              if (response?.result?.responseStatus?.errorCode == "00") {
                const objDetail = response?.result?.results
                this.serviceService.service = ServiceDto.fromJS(objDetail)

                const splitArr = this.serviceService.service.timeValue.split('/')
                const time = splitArr[0].split(':')
                this.serviceService.date = new Date(0, 0, 0, Number(time[0]), Number(time[1]))
                this.serviceService.day = splitArr[1]
               
                this.serviceService.suppliers = []
                for (let item of objDetail.supplierServiceListItems) {
                  this.serviceService.suppliers.push(SupplierServiceListItem.fromJS(item))
                }

                this.serviceService.agencies = []
                for (let item of objDetail.agencyServiceListItems) {
                  this.serviceService.agencies.push(AgencyServiceListItem.fromJS(item))
                }

                this.serviceService.serviceId = this.serviceId
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

    this.serviceService.getListEmailTemplate()
    .subscribe((response :any) => {
      if (response.responseStatus?.errorCode == "00") {
         this.serviceService.emailTemplates = []
         for(let item of response.results)
         {
            this.serviceService.emailTemplates.push(EmailTemplate.fromJS(item))
         }
      }
      else {
        this.notify.error(response?.result?.responseStatus?.message);
      }
    })
  }
}
