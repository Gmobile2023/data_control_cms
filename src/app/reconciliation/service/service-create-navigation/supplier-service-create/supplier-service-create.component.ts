import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { BatchFileFieldDataDto, BftemplateService } from '@shared/service-proxies/bftemplate.service';
import { ServiceService, SupplierServiceDto, SupplierServiceListItem, SupplierServiceTemplateDto } from '@shared/service-proxies/service-service';
import { SupplierItemList, SupplierService } from '@shared/service-proxies/supplier-service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FileUpload } from 'primeng/fileupload';
import { finalize } from 'rxjs';

@Component({
  selector: 'supplier-service-create',
  templateUrl: './supplier-service-create.component.html',
  styleUrls: ['./supplier-service-create.component.css']
})
export class SupplierServiceCreateComponent extends AppComponentBase {
  supplierServiceDto: SupplierServiceDto = new SupplierServiceDto()
  supplierDropList: SupplierItemList[] = []
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @ViewChild('ExcelFileUpload', { static: false }) excelFileUpload: FileUpload;
  // @Output() getSuppliers: EventEmitter<any> = new EventEmitter<any>();

  active = false;
  saving = false;
  templateSupplier: string[] = []
  visible: boolean=false;
  visible1: boolean=false;

  constructor(injector: Injector
    , public serviceService: ServiceService
    , private supplierService: SupplierService
    , private route: ActivatedRoute
    , private batchFileService: BftemplateService
    , private _httpClient: HttpClient
  ) {
    super(injector);
  }

  fileNameFormat: string = '';
  invalidFileNameFormat: boolean = false;

  checkFileNameFormat(event: any): void {
    const regex = /(?=.*\{TenDichVu\})(?=.*\{MaNCC\})(?=.*\{Date\})/;
    const fileNameFormat = event.target.value;
    const isTenDichVu = fileNameFormat.includes("{TenDichVu}")
    const isMaNCC = fileNameFormat.includes("{MaNCC}")
    const isDate = fileNameFormat.includes("{Date}")
    const isTenNCC = fileNameFormat.includes("{TenNCC}")

    //this.invalidFileNameFormat = !regex.test(fileNameFormat);
    this.invalidFileNameFormat = !isTenDichVu || (!isMaNCC && !isTenNCC) || !isDate;
}
  serviceId: number
  ngOnInit(): void {
    // Gọi hàm của bạn ở đây
    this.loadData();
  }
  onSendReportChecked() {
    if(!this.supplierServiceDto.sendReportChecked)
      this.supplierServiceDto.isSendMail = false;
  }
 
  showDialog() {
    this.visible = true;
  }
  showDialog1() {
    this.visible1 = true;
  }
    popoverContent = "Sử dụng các cú pháp sau để định dạng tên file\n" +
    "{Date}: gán ngày theo định dạng YYYYMMDD\n" +
    "{TenDichVu}: gán tên dịch vụ đối soát tương ứng \n" +
    "{MaDichVu}: gán mã dịch vụ đối soát tương ứng\n" +
    "{LoaiChuKy}: gán loại chu kỳ đối soát tương ứng\n" +
    "{TenNCC}: gán tên nhà cung cấp\n" +
    "{MaNCC}: gán mã nhà cung cấp\n" ;
    popoverContent1 = "Sử dụng các cú pháp sau để định dạng tên file\n" +
    "{NgayDoiSoat}: gán ngày thực hiện đối soát báo cáo theo định dạng YYYYMMDD\n" +
    "{TenDichVu}: gán tên dịch vụ đối soát tương ứng\n" +
    "{MaDichVu}: gán mã dịch vụ đối soát tương ứng\n" +
    "{LoaiChuKy}: gán loại chu kỳ đối soát tương ứng\n" +
    "{TenNCC}, {MaNCC}\n" +
    "{TenDL}, {MaDL}";
    public getPopoverContentAsHtml(): string {
      return this.popoverContent.replace(/\n/g, '<br>');
    }

    public getPopoverContentAsHtml1(): string {
      return this.popoverContent1.replace(/\n/g, '<br>');
    }
  
  show(id?: number): void {
    const self = this;
    self.active = true;
    this.templateSupplier.length = 0
    this.serviceService.templateBatchFile.length = 0
    
    if (id) {
      const obj = this.serviceService.service.supplierServices.find(x => x.id == id)
      this.supplierServiceDto = SupplierServiceDto.fromJS(obj)
      if (this.supplierServiceDto.template.length > 0) {
        for (let item of this.supplierServiceDto.template)
          if(item.fieldNameTemplateSupplier)
            this.templateSupplier.push(item.fieldNameTemplateSupplier)
      }
    }
    this.getTemplateBatchFile();
    this.onChangeValueFiledSupplier()
    self.modal.show();
  }

  save() {
    const self = this;
    self.saving = true;
    this.supplierServiceDto.status = true
    if (this.supplierServiceDto.cycle == 1) {
      this.supplierServiceDto.timeValue = this.supplierServiceDto.date.getHours().toString() + ":" + this.supplierServiceDto.date.getMinutes().toString() + `/`
    }
    else  this.supplierServiceDto.timeValue = this.supplierServiceDto.date.getHours().toString() + ":" + this.supplierServiceDto.date.getMinutes().toString() + `/${this.supplierServiceDto.day}`

    if (!this.supplierServiceDto.id || this.supplierServiceDto.id <= 0) {
      if (!this.serviceService.service.supplierServices || this.serviceService.service.supplierServices.length <= 0)
        this.supplierServiceDto.id = 1;
      else {
        const ids = this.serviceService.service.supplierServices.map(object => {
          return object.id;
        });

        const max = Math.max(...ids);
        this.supplierServiceDto.id = max + 1;
      }

      self.serviceService.service.supplierServices.push(this.supplierServiceDto);

      const supplier = this.supplierDropList.find(x => x.supplierId == this.supplierServiceDto.supplierId)
      var itemList = SupplierServiceListItem.fromJS({
        supplierName: supplier.supplierName,
        status: this.supplierServiceDto.status ? "Hoạt động" : "Không hoạt động",
        id: this.supplierServiceDto.id,
      })

      self.serviceService.suppliers.push(itemList);
    }
    else {
      const indexInArr = this.serviceService.service.supplierServices.findIndex(x => x.id == this.supplierServiceDto.id)
      this.serviceService.service.supplierServices[indexInArr].cycle = this.supplierServiceDto.cycle;
      this.serviceService.service.supplierServices[indexInArr].supplierId = this.supplierServiceDto.supplierId;
      this.serviceService.service.supplierServices[indexInArr].dataSourceAccount = this.supplierServiceDto.dataSourceAccount;
      this.serviceService.service.supplierServices[indexInArr].dataSourceLink = this.supplierServiceDto.dataSourceLink;
      this.serviceService.service.supplierServices[indexInArr].dataSourcePassword = this.supplierServiceDto.dataSourcePassword;
      this.serviceService.service.supplierServices[indexInArr].emailReceiver = this.supplierServiceDto.emailReceiver;
      this.serviceService.service.supplierServices[indexInArr].isDataSourceFromSupplier = this.supplierServiceDto.isDataSourceFromSupplier;
      this.serviceService.service.supplierServices[indexInArr].isEmailFromSupplier = this.supplierServiceDto.isEmailFromSupplier;
      this.serviceService.service.supplierServices[indexInArr].isSendEmailFalse = this.supplierServiceDto.isSendEmailFalse;
      this.serviceService.service.supplierServices[indexInArr].isSendEmailMatch = this.supplierServiceDto.isSendEmailMatch;
      this.serviceService.service.supplierServices[indexInArr].timeValue = this.supplierServiceDto.timeValue;
      this.serviceService.service.supplierServices[indexInArr].template = this.supplierServiceDto.template;
      this.serviceService.service.supplierServices[indexInArr].emailSendTemplateId = this.supplierServiceDto.emailSendTemplateId;
      this.serviceService.service.supplierServices[indexInArr].daysDifference = this.supplierServiceDto.daysDifference;
      this.serviceService.service.supplierServices[indexInArr].fileNameFormatSend = this.supplierServiceDto.fileNameFormatSend;
      this.serviceService.service.supplierServices[indexInArr].fileNameReconcileFormat = this.supplierServiceDto.fileNameReconcileFormat;
      this.serviceService.service.supplierServices[indexInArr].emailAccount = this.supplierServiceDto.emailAccount;
      this.serviceService.service.supplierServices[indexInArr].emailHost = this.supplierServiceDto.emailHost;
      this.serviceService.service.supplierServices[indexInArr].emailPort = this.supplierServiceDto.emailPort;
      this.serviceService.service.supplierServices[indexInArr].emailPassword = this.supplierServiceDto.emailPassword;
      this.serviceService.service.supplierServices[indexInArr].useDataFromEmail = this.supplierServiceDto.useDataFromEmail;
      this.serviceService.service.supplierServices[indexInArr].useDataFromFtp = this.supplierServiceDto.useDataFromFtp;
      this.serviceService.service.supplierServices[indexInArr].subjectEmailIdentified = this.supplierServiceDto.subjectEmailIdentified;
      this.serviceService.service.supplierServices[indexInArr].isUseSupplierCode = this.supplierServiceDto.isUseSupplierCode;
      this.serviceService.service.supplierServices[indexInArr].isUseSupplierName = this.supplierServiceDto.isUseSupplierName;
      this.serviceService.service.supplierServices[indexInArr].isSendMail = this.supplierServiceDto.isSendMail;

      const supplier = this.supplierDropList.find(x => x.supplierId == this.supplierServiceDto.supplierId)
      const indexInList = self.serviceService.suppliers.findIndex(x => x.id == this.supplierServiceDto.id)
      self.serviceService.suppliers[indexInList].supplierName = supplier.supplierName
    }

    self.saving = false
    this.supplierServiceDto = new SupplierServiceDto();
    self.modal.hide();
  }

  close(): void {
    this.active = false;
    this.supplierServiceDto = new SupplierServiceDto();
    this.modal.hide();
  }

  loadData() {
    this.supplierService.getSupplierGetAll('')
      .subscribe((response: any) => {
        if (response?.responseStatus?.errorCode == '00') {
          this.supplierDropList = response?.results
        }
      })
  }

  changeInputChooseSupplier() {
    this.changeInputIsDataSourceFromSupplier()
    this.changeInputIsEmailFromSupplier()
  }

  changeInputIsDataSourceFromSupplier() {
    if (this.supplierServiceDto.isDataSourceFromSupplier && this.supplierServiceDto.supplierId) {
      const supplier = this.supplierDropList.find(x => x.supplierId == this.supplierServiceDto.supplierId)
      this.supplierServiceDto.dataSourceLink = supplier.sftpLink
      this.supplierServiceDto.dataSourceAccount = supplier.sftpLinkAccount
      this.supplierServiceDto.dataSourcePassword = supplier.sftpLinkPassword
    }
  }

  changeInputIsEmailFromSupplier() {
    if (this.supplierServiceDto.isEmailFromSupplier && this.supplierServiceDto.supplierId) {
      const supplier = this.supplierDropList.find(x => x.supplierId == this.supplierServiceDto.supplierId)
      this.supplierServiceDto.emailReceiver = supplier.email
    }
  }

  getTemplateBatchFile() {
    this.batchFileService.getBatchFileFieldData(this.serviceService.service.bfSourceId)
      .subscribe((response: any) => {
        if (response?.responseStatus?.errorCode == '00') {
          for (let item of response?.results) {
            this.serviceService.templateBatchFile.push(BatchFileFieldDataDto.fromJS(item))
          }

          const tempReconcile = this.serviceService.templateBatchFile.filter(x => x.IsReconcile)

          for (var i = this.supplierServiceDto.template.length - 1; i >= 0; i--) {
            var element = this.supplierServiceDto.template[i];

            // Kiểm tra xem phần tử có trong list2 không
            if (!tempReconcile.find(x => x.Id == element.fieldDataBatchFileId)) {
              // Nếu không tìm thấy, xóa phần tử đó khỏi list1
              this.supplierServiceDto.template.splice(i, 1);
            }
          }

          for (let item of tempReconcile) {
            const colMap = this.supplierServiceDto.template.find(x => x.fieldDataBatchFileId == item.Id)

            if (!colMap) {
              this.supplierServiceDto.template.push(SupplierServiceTemplateDto.fromJS({
                fieldDataBatchFileId: item.Id,
                fieldNameTemplateBatchFile: item.FieldDataName,
                isRequired: item.IsRequired,
                isKey: item.IsKey
              }))
            }
          }
        }
      })
  }

 onServiceTypeChange(event: any) {
    if (!event.value) {
        this.supplierServiceDto.supplierId = null; // Reset the value when nothing is selected
    }
}
  onServiceTypeSelect(item: any) {
    if (item && item.supplierId) {
        this.supplierServiceDto.supplierId = item.supplierId;
        // Tùy theo nhu cầu, bạn có thể thực hiện các hành động khác ở đây
    }
}

  uploadExcel(data: { files: File }): void {
    const formData: FormData = new FormData();
    const file = data.files[0];
    formData.append('file', file, file.name);

    const url = AppConsts.remoteServiceBaseUrl + '/api/services/app/Service/UploadGetHeader'

    this._httpClient
      .post<any>(url, formData)
      .pipe(finalize(() => this.excelFileUpload.clear()))
      .subscribe((response) => {
        if (response.success) {
          // this.notify.success(this.l('ImportUsersProcessStart'));
          this.notify.success('Upload file thành công');
          if (response?.result?.responseStatus?.errorCode == "00") {
            this.templateSupplier.length = 0;
            this.templateSupplier = response?.result?.results;

            for(let item of this.supplierServiceDto.template)
            {
               item.fieldNameTemplateSupplier = ""
            }
          }
          else {
            this.notify.error(response?.result?.responseStatus?.message);
          }
        } else if (response.error != null) {
          // this.notify.error(this.l('ImportUsersUploadFailed'));
          this.notify.error('Có lỗi xảy ra');
        }
      });
  }

  onUploadExcelError(): void {
    this.notify.error("Có lỗi xảy ra");
  }

  onchangeRadioCodeOrName(key: any) {
    if (key == 1) {
      this.supplierServiceDto.isUseSupplierName = true
      this.supplierServiceDto.isUseSupplierCode = false
    }

    if (key == 2) {
      this.supplierServiceDto.isUseSupplierName = false
      this.supplierServiceDto.isUseSupplierCode = true
    }
  }

  onchangeRadioUseDataFrom(key: any) {
    if (key == 1) {
      this.supplierServiceDto.useDataFromEmail = true
      this.supplierServiceDto.useDataFromFtp = false
    }

    if (key == 2) {
      this.supplierServiceDto.useDataFromEmail = false
      this.supplierServiceDto.useDataFromFtp = true
    }
  }

  invalidTemplates = false
  checkInvalidTemplates()
  {
      let result = true;
      for(let item of this.supplierServiceDto.template)
      {
        if(item.isRequired && !item.fieldNameTemplateSupplier)
        {
           result = false
           break
        }
      }

      return result
  }

  onChangeValueFiledSupplier()
  {
      this.invalidTemplates = this.checkInvalidTemplates()
  }
}
