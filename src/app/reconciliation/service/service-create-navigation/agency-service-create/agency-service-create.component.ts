import { Component, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AgencyItemList, AgencyService } from '@shared/service-proxies/agency-service';
import { BatchFileFieldDataDto, BftemplateService } from '@shared/service-proxies/bftemplate.service';
import { AgencyServiceDto, AgencyServiceListItem, AgencyServiceTemplateReportDto, ServiceService } from '@shared/service-proxies/service-service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'agency-service-create',
  templateUrl: './agency-service-create.component.html',
  styleUrls: ['./agency-service-create.component.css']
})
export class AgencyServiceCreateComponent extends AppComponentBase {
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

  constructor(injector: Injector
    , public serviceService: ServiceService
    , private agencyService: AgencyService
    , private batchFileService: BftemplateService
  ) {
    super(injector);
  }

  agencyDropList: AgencyItemList[] = []
  agencyDto: AgencyServiceDto = new AgencyServiceDto()
  active = false;
  saving = false;
  visible: boolean = false;

  ngOnInit(): void {
    // Gọi hàm của bạn ở đây
    this.loadData();

    if (!this.serviceService.templateBatchFile || this.serviceService.templateBatchFile.length <= 0)
      this.getTemplateBatchFile()
  }

  showDialog() {
    this.visible = true;
  }
  popoverContent: string = "Sử dụng các cú pháp sau để định dạng tên file\n" +
  "- {NgayXuat}: gán ngày thực hiện xuất báo cáo theo định dạng YYYYMMDD\n" +
  "- {NgayDoiSoat}: gán ngày thực hiện đối soát báo cáo theo định dạng YYYYMMDD\n" +
  "- {TenDichVu}: gán tên dịch vụ đối soát tương ứng\n" +
  "- {MaDichVu}: gán mã dịch vụ đối soát tương ứng\n" +
  "- {LoaiChuKy}: gán loại chu kỳ đối soát tương ứng\n" +
  "- {TenNCC}, {MaNCC}\n" +
  "- {TenDL}, {MaNCC}";


  isCheckboxChecked: boolean = false;
  

  onAgencyTypeChange(event: any) {
    if (!event.value) {
        this.agencyDto.agencyId = null; // Reset the value when nothing is selected
    }
}
  onAgencyTypeSelect(item: any) {
  if (item && item.agencyId) {
      this.agencyDto.agencyId = item.agencyId;
      // Thực hiện các hành động khác ở đây nếu cần
  }
}

  onEmailTypeChange(event: any) {
    if (!event.value) {
        this.agencyDto.emailSendTemplateId = null; // Reset the value when nothing is selected
    }
  }
  onEmailTypeSelect(item: any) {
  if (item && item.id) {
      this.agencyDto.emailSendTemplateId = item.id;
      // Thực hiện các hành động khác ở đây nếu cần
  }
  }



  show(id?: number): void {
    const self = this;
    self.active = true;
    if (id) {
      const obj = this.serviceService.service.agencyServices.find(x => x.id == id)
      this.agencyDto = AgencyServiceDto.fromJS(obj)
    }

    this.checkDuplicateById()
    self.modal.show();
  }

  save() {
    const self = this;
    self.saving = true;
    this.agencyDto.status = true
    if (this.agencyDto.cycle == 1) {
      this.agencyDto.timeValue = this.agencyDto.date.getHours().toString() + ":" + this.agencyDto.date.getMinutes().toString() + `/`
    }
    else this.agencyDto.timeValue = this.agencyDto.date.getHours().toString() + ":" + this.agencyDto.date.getMinutes().toString() + `/${this.agencyDto.day}`

    if (!this.agencyDto.id || this.agencyDto.id <= 0) {
      if (!this.serviceService.service.agencyServices || this.serviceService.service.agencyServices.length <= 0) {
        this.agencyDto.id = 1;
      }
      else {
        const ids = this.serviceService.service.agencyServices.map(object => {
          return object.id;
        });

        const max = Math.max(...ids);
        this.agencyDto.id = max + 1;
      }
      self.serviceService.service.agencyServices.push(this.agencyDto);

      const agency = this.agencyDropList.find(x => x.agencyId == this.agencyDto.agencyId)
      var actionList = "";
      if (this.agencyDto.isSendFailMail || this.agencyDto.isSendSuccessMail)
        actionList = actionList + "Gửi email"
      if (this.agencyDto.isUploadSuccessFile || this.agencyDto.isUploadFailFile) {
        if (actionList != "") {
          actionList = actionList + ", Upload File"
        }
        else {
          actionList = actionList + "Upload File"
        }

      }
      var itemList = AgencyServiceListItem.fromJS({
        agencyName: agency.agencyName,
        status: this.agencyDto.status ? "Hoạt động" : "Không hoạt động",
        id: this.agencyDto.id,
        actionList: actionList
      })

      self.serviceService.agencies.push(itemList);
    }
    else {

      const indexInArr = this.serviceService.service.agencyServices.findIndex(x => x.id == this.agencyDto.id)
      this.serviceService.service.agencyServices[indexInArr].cycle = this.agencyDto.cycle;
      this.serviceService.service.agencyServices[indexInArr].agencyId = this.agencyDto.agencyId;
      this.serviceService.service.agencyServices[indexInArr].account = this.agencyDto.account;
      this.serviceService.service.agencyServices[indexInArr].password = this.agencyDto.password;
      this.serviceService.service.agencyServices[indexInArr].email = this.agencyDto.email;
      this.serviceService.service.agencyServices[indexInArr].isUseAgencyEmail = this.agencyDto.isUseAgencyEmail;
      this.serviceService.service.agencyServices[indexInArr].isSendSuccessMail = this.agencyDto.isSendSuccessMail;
      this.serviceService.service.agencyServices[indexInArr].isSendFailMail = this.agencyDto.isSendFailMail;
      this.serviceService.service.agencyServices[indexInArr].uploadReportFileLink = this.agencyDto.uploadReportFileLink;
      this.serviceService.service.agencyServices[indexInArr].isUseUploadReportFileLink = this.agencyDto.isUseUploadReportFileLink;
      this.serviceService.service.agencyServices[indexInArr].isUploadFailFile = this.agencyDto.isUploadFailFile;
      this.serviceService.service.agencyServices[indexInArr].isUploadSuccessFile = this.agencyDto.isUploadSuccessFile;
      this.serviceService.service.agencyServices[indexInArr].timeValue = this.agencyDto.timeValue;
      this.serviceService.service.agencyServices[indexInArr].template = this.agencyDto.template;
      this.serviceService.service.agencyServices[indexInArr].emailSendTemplateId = this.agencyDto.emailSendTemplateId;
      this.serviceService.service.agencyServices[indexInArr].isUseAgencyCode = this.agencyDto.isUseAgencyCode;
      this.serviceService.service.agencyServices[indexInArr].isUseAgencyName = this.agencyDto.isUseAgencyName;
      this.serviceService.service.agencyServices[indexInArr].fileNameFormatSend = this.agencyDto.fileNameFormatSend;
      this.serviceService.service.agencyServices[indexInArr].isSendMailAfterReconcile = this.agencyDto.isSendMailAfterReconcile;

      const agencies = this.agencyDropList.find(x => x.agencyId == this.agencyDto.agencyId)
      const indexInList = self.serviceService.agencies.findIndex(x => x.id == this.agencyDto.id)
      self.serviceService.agencies[indexInList].agencyName = agencies.agencyName
      var actionList = "";
      if (this.agencyDto.isSendFailMail || this.agencyDto.isSendSuccessMail)
        actionList = actionList + "Gửi email"
      if (this.agencyDto.isUploadSuccessFile || this.agencyDto.isUploadFailFile) {
        if (actionList != "") {
          actionList = actionList + ", Upload File"
        }
        else {
          actionList = actionList + "Upload File"
        }

      }
      self.serviceService.agencies[indexInList].actionList = actionList
    }


    self.saving = false
    this.agencyDto = new AgencyServiceDto();
    self.modal.hide();
  }
  updateStatus(id: number, status: boolean) {
    const indexInArr = this.serviceService.service.agencyServices.findIndex(x => x.id == id)
    this.serviceService.service.agencyServices[indexInArr].status = status;
    const indexInList = this.serviceService.agencies.findIndex(x => x.id == id)
    this.serviceService.agencies[indexInList].status = status ? "Hoạt động" : "Không hoạt động"
  }
  close(): void {
    this.active = false;
    this.agencyDto = new AgencyServiceDto();
    this.modal.hide();
  }

  loadData() {
    this.agencyService.getAgencyGetAll('')
      .subscribe((response: any) => {
        if (response?.responseStatus?.errorCode == '00') {
          this.agencyDropList = response?.results
        }
      })
  }

  changeInputChooseAgency() {
    this.changeInputIsDataSourceFromAgency()
    this.changeInputIsEmailFromAgency()
  }

  changeInputIsDataSourceFromAgency() {
    if (this.agencyDto.isUseUploadReportFileLink && this.agencyDto.agencyId) {
      const agency = this.agencyDropList.find(x => x.agencyId == this.agencyDto.agencyId)
      this.agencyDto.uploadReportFileLink = agency.sftpLink
      this.agencyDto.account = agency.sftpLinkAccount
      this.agencyDto.password = agency.sftpLinkPassword
    }
  }

  changeInputIsEmailFromAgency() {
    if (this.agencyDto.isUseAgencyEmail && this.agencyDto.agencyId) {
      const agency = this.agencyDropList.find(x => x.agencyId == this.agencyDto.agencyId)
      this.agencyDto.email = agency.email
    }
  }

  toggleTemplateExport(id) {
    const item = this.agencyDto.template.find(x => x.fieldDataBatchFileId == id);

    if (!item) {
      // Nếu số không tồn tại trong mảng, thêm vào mảng
      const col = this.serviceService.templateBatchFile.find(x => x.Id == id)
      this.agencyDto.template.push(AgencyServiceTemplateReportDto.fromJS({
        fieldDataBatchFileId: id,
        fieldDataName: col.FieldDataName
      }))
    } else {
      const index = this.agencyDto.template.indexOf(item);
      // Nếu số đã tồn tại trong mảng, xóa nó đi
      this.agencyDto.template.splice(index, 1);
    }

    this.checkDuplicateById()
  }

  isChecked(id) {
    const item = this.agencyDto.template.find(x => x.fieldDataBatchFileId == id);

    if (!item) return false;
    else return true;

  }

  onchangeRadioCodeOrName(key: any) {
    if (key == 1) {
      this.agencyDto.isUseAgencyName = true
      this.agencyDto.isUseAgencyCode = false
    }

    if (key == 2) {
      this.agencyDto.isUseAgencyName = false
      this.agencyDto.isUseAgencyCode = true
    }
  }

  getTemplateBatchFile() {
    this.batchFileService.getBatchFileFieldData(this.serviceService.service.bfSourceId)
      .subscribe((response: any) => {
        if (response?.responseStatus?.errorCode == '00') {
          for (let item of response?.results) {
            this.serviceService.templateBatchFile.push(BatchFileFieldDataDto.fromJS(item))
          }
        }
      })
  }

  checkAll = false
  checkAllFunc() {
    this.agencyDto.template = []
    if (this.checkAll) {
      for (let item of this.serviceService.templateBatchFile) {
        this.agencyDto.template.push(AgencyServiceTemplateReportDto.fromJS(
          {
            fieldDataName: item.FieldDataName,
            fieldDataBatchFileId: item.Id
          }
        ))
      }
    }
    else this.agencyDto.template = []
  }

  checkDuplicateById() {
    let isDuplicate = true;
    for (let obj1 of   this.serviceService.templateBatchFile) {
      const itemDuplicate = this.agencyDto.template.find(x => x.fieldDataBatchFileId == obj1.Id)
      if (!itemDuplicate) 
      {
        isDuplicate = false
        break;
      }
    }
    this.checkAll = isDuplicate
  }
}
