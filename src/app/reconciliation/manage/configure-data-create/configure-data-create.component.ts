import { ModalDirective, BsModalRef } from 'ngx-bootstrap/modal';
import { Component, Injector, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DataService, TemplateBf1Dto, ManageService } from '@shared/service-proxies/manage-service';
import { finalize } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { Dropdown } from 'primeng/dropdown';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'configure-data-create',
  templateUrl: './configure-data-create.component.html',
  styleUrls: ['./configure-data-create.component.css']
})
export class ConfigureDataCreateComponent extends AppComponentBase {

  @ViewChild('createOrEditModal') modal: ModalDirective; 

  header: string = '';
  active = false;
  saving = false;

  constructor(injector: Injector,
    public _manageService: ManageService,
    private _httpClient: HttpClient,
    private router: Router,
    ) {
    super(injector);

  }

  ngOnInit(): void {
    this.getDetail()
  }

  onchangeRadiobf1(key: any) {
    if (key == 1) {
      this._manageService.dataService.useDataFromEmailBF1 = false
      this._manageService.dataService.useDataFromFtpBF1 = true
    }

    if (key == 2) {
      this._manageService.dataService.useDataFromEmailBF1 = true
      this._manageService.dataService.useDataFromFtpBF1 = false
    }
  }

  onchangeRadiobf2(key: any) {
    if (key == 1) {
      this._manageService.dataService.useDataFromEmailBF2 = false
      this._manageService.dataService.useDataFromFtpBF2 = true
    }

    if (key == 2) {
      this._manageService.dataService.useDataFromEmailBF2 = true
      this._manageService.dataService.useDataFromFtpBF2 = false
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
          //this.router.navigate(['/app/reconciliation/configureData']);
        //  this._manageService.dataService = new DataService();
        }

      });
  }

  cancel() {
    this._manageService.dataService = new DataService();
    this.router.navigate(['/app/reconciliation/configureData']);
  }

  getDetail() {

    if(!this._manageService.dataService.id)
    {
      this._manageService.getRevenueControlDetail()
      .subscribe();
    }
  
  }
}