import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DataService, ManageService } from '@shared/service-proxies/manage-service';
import { EmailTemplate, ServiceService } from '@shared/service-proxies/service-service';
import { ModalDirective, BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs';
@Component({
  selector: 'post-control-report-create',
  templateUrl: './post-control-report-create.component.html',
  styleUrls: ['./post-control-report-create.component.css']
})
export class PostControlReportCreateComponent extends AppComponentBase {

  constructor(injector: Injector,
    public _manageService: ManageService,
    private _httpClient: HttpClient,
    private router: Router,
    public serviceService: ServiceService
    , private route: ActivatedRoute
  ) {
    super(injector);

  }

  ngOnInit(): void {
    this.loadListEmailTemplate()
    this.getDetail()
  }

  CheckBoxSendReportChange()
  {
     if(!this._manageService.isSendReport)
     {
      this._manageService.dataService.isUpload = false;
      this._manageService.dataService.isSendMail = false;
     }
  }

  complete() {
    this._manageService.saving = true;
    this._manageService
      .CreateDataService()
      .pipe(finalize(() => this._manageService.saving = false))
      .subscribe((data: any) => {
        console.log('Data from createDataService():', data);
        if (data.responseStatus && data.responseStatus.errorCode == "01") {
          this.message.error(data.responseStatus.message);
        }
        else {
          this.notify.info(this.l('SavedSuccessfully'));
         // this.router.navigate(['/app/reconciliation/configureData']);
         // this._manageService.dataService = new DataService();
        }

      });
  }

  cancel() {
    this._manageService.dataService = new DataService();
    this.router.navigate(['/app/reconciliation/configureData']);
  }

  onChangeSendReportChecked() {
    // if(!this._serviceService.service.sendReportChecked)
    // {
    //   this._serviceService.service.isSendMail = false
    //   this._serviceService.service.isUploadFile = false
    // }
  }

  loadListEmailTemplate() {
    this.serviceService.getListEmailTemplate()
      .subscribe((response: any) => {
        if (response.responseStatus?.errorCode == "00") {
          this.serviceService.emailTemplates = []
          for (let item of response.results) {
            this.serviceService.emailTemplates.push(EmailTemplate.fromJS(item))
          }
        }
        else {
          this.notify.error(response?.result?.responseStatus?.message);
        }
      })
  }

  getDetail() {
    if(!this._manageService.dataService.id)
    {
      this._manageService.getRevenueControlDetail()
      .subscribe(()=>{
         
      });
    }
  }
}
