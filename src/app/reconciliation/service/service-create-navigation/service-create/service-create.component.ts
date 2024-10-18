import { Component, Injector, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { BatchFileItemList, BftemplateService } from '@shared/service-proxies/bftemplate.service';
import { ServiceDto, ServiceService, EmailTemplate } from '@shared/service-proxies/service-service';
import { DropdownListServiceTypeParam, ServiceTypeItemList, ServiceTypeService } from '@shared/service-proxies/servicetype-service';
import { finalize } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { Dropdown } from 'primeng/dropdown';

@Component({
  selector: 'service-create',
  templateUrl: './service-create.component.html',
  styleUrls: ['./service-create.component.css']
})
export class ServiceCreateComponent extends AppComponentBase {

  constructor(injector: Injector, private router: Router
    , private _serviceTypeService: ServiceTypeService
    , private _bfService: BftemplateService
    , public _serviceService: ServiceService
  ) {
    super(injector);
  }
  filterText: string | undefined = "";
  filterTextBF: string | undefined = "";
  listItems: ServiceTypeItemList[] = [];
  listItemsBF: BatchFileItemList[] = [];
  listEmail: EmailTemplate[] = [];
  isReadyView = false;
  visible:boolean =false;
  

  ngOnInit(): void {
    this.getDropdownServiceType();
    this.getDropdownBF();
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const ele = document.getElementById('pannelCreateService');
    ele.click();
  }
 
  showDialog() {
    this.visible = true;
  }
  
  onChangeSendReportChecked()
  {
    if(!this._serviceService.service.sendReportChecked)
    {
      this._serviceService.service.isSendMail = false
      this._serviceService.service.isUploadFile = false
    }
  }
  
  popoverContent = "Sử dụng các cú pháp sau để định dạng tên file:\n" +
  "- {Date}: gán ngày theo định dạng YYYYMMDD\n" +
  "- {TenDichVu}: gán tên dịch vụ đối soát tương ứng\n" +
  "- {MaDichVu}: gán mã dịch vụ đối soát tương ứng\n" +
  "- {LoaiChuKy}: gán loại chu kỳ đối soát tương ứng\n" +
  "- {TenNCC}: gán tên nhà cung cấp\n" +
  "- {MaNCC}: gán mã nhà cung cấp";
  public getPopoverContentAsHtml(): string {
    return this.popoverContent.replace(/\n/g, '<br>');
  }
  getDropdownServiceType() {

    this.primengTableHelper.showLoadingIndicator();

    this._serviceTypeService
      .getDropdownServiceType(
        new DropdownListServiceTypeParam({
          ServiceTypeName: this.filterText
        })
      )
      .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
      .subscribe((result) => {
        this.listItems = result;
        this.primengTableHelper.hideLoadingIndicator();
        this.isReadyView = true;
      });
  }
  
  getDropdownBF() {

    this.primengTableHelper.showLoadingIndicator();

    this._bfService
      .getBatchFileGetAll(
        this.filterTextBF
      )
      .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
      .subscribe((result: any) => {
        this.listItemsBF = result.results;
        this.primengTableHelper.hideLoadingIndicator();
        this.isReadyView = true;
      });
  }
  onServiceTemplateTypeChange(selectedItem: ServiceTypeItemList) {
    if (selectedItem) {
        this._serviceService.service.serviceTypeId = selectedItem.id;
        
    }
}
onBfTemplateTypeChange(selectedItem: BatchFileItemList) {
  if (selectedItem) {
      this._serviceService.service.bfSourceId = selectedItem.BatchFileId;
  }
}
onEmailTemplateTypeChange(selectedItem: EmailTemplate) {
  if (selectedItem) {
      this._serviceService.service.emailSendTemplateId = selectedItem.id;
      
  }
}
  invalidFileNameFormat: boolean = false;

  checkFileNameFormat(event: any): void {
    //const regex = /(?=.*\{TenDichVu\})(?=.*\{Date\})/;
    const fileNameFormat = event.target.value;
    //this.invalidFileNameFormat = !regex.test(fileNameFormat);
    this.invalidFileNameFormat = !fileNameFormat.includes("{TenDichVu}") || !fileNameFormat.includes("{Date}");
}


  complete() {

    this._serviceService.saving = true;
    this._serviceService
      .createService()
      .pipe(finalize(() => this._serviceService.saving = false))
      .subscribe((data: any) => {
        if (data.responseStatus && data.responseStatus.errorCode == "01") {
          this.message.error(data.responseStatus.message);
        }
        else
        {
          this.notify.info(this.l('SavedSuccessfully'));
          this.router.navigate(['/app/reconciliation/service']);
          this._serviceService.service = new ServiceDto();
          this._serviceService.agencies = [];
          this._serviceService.suppliers = [];
          this._serviceService.date = new Date()
          this._serviceService.templateBatchFile = [];
          this._serviceService.serviceId = undefined
        }
        
      });
  }

  cancel() {
    this.router.navigate(['/app/reconciliation/service']);
    this._serviceService.service = new ServiceDto();
    this._serviceService.saving = false;
    this._serviceService.suppliers = []
    this._serviceService.agencies = [];
    this._serviceService.date = new Date()
    this._serviceService.templateBatchFile = [];
    this._serviceService.serviceId = undefined
  }
  
}
