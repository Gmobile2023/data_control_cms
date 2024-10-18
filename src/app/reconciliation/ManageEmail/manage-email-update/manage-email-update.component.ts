import { Component, Injector, ViewChild, EventEmitter, Output } from '@angular/core';
import { finalize } from 'rxjs';
import { CreateOrUpdateManageEmailParam, ManageEmailDto, ManageEmailService } from '@shared/service-proxies/manage-email-service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/common/app-component-base';
import { extend } from 'lodash-es';
import { TypeEmailDto } from '@shared/service-proxies/type-email-service';
import { TypeEmailService, DropdownListEmailTypeParam, TypeEmailItemList } from '@shared/service-proxies/type-email-service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'manage-email-update',
  templateUrl: './manage-email-update.component.html',
  styleUrls: ['./manage-email-update.component.css']
})
export class ManageEmailUpdateComponent extends AppComponentBase {
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() getManageEmail: EventEmitter<any> = new EventEmitter<any>();
  isVisible = false;
  active = false;
  saving = false;
  manageEmail: ManageEmailDto = new ManageEmailDto();
  message: any;
  notify: any;
  selectedValue = new FormControl();
  visible: boolean = false;
  
  typeEmailItemList : TypeEmailItemList= new TypeEmailItemList();
  emailTypeName: string
  constructor(injector: Injector, private _manageEmailService: ManageEmailService,private typeEmailService: TypeEmailService,private activatedRoute: ActivatedRoute ) {
    super(injector);
  }
  filterText: string | undefined = "";
  productListItem: TypeEmailDto[] = [];
  listItems: TypeEmailItemList[] = [];
  isReadyView = false;
  
  ngOnInit() {
    
    this.loadDropdownData();
    
    
  }
  showDialog() {
    this.visible = true;
  }
  popoverContent = "Khai báo nội dung \"Tiêu đề\" hoặc \"Nội dung\" sử dụng các cú pháp sau: \n" +
    "- {TenNCC}, {TenDaiLy}: gán tên NCC hoặc tên Đại lý tương ứng \n" +
    "- {TenDichVu}: gán tên dịch vụ \n" +
    "- {NgayBatDau}: gán ngày/giờ bắt đầu đối soát \n" +
    "- {NgayKetThuc}: gán ngày/giờ kết thúc chu kỳ đối soát \n" +
    "- {NgayDoiSoat}: gán ngày/giờ thực hiện đối soát \n" +
    "- {Today}: gán ngày/giờ gửi email";

  public getPopoverContentAsHtml(): string {
    return this.popoverContent.replace(/\n/g, '<br>');
  }

  loadDropdownData() {

    this.primengTableHelper.showLoadingIndicator();

    this.typeEmailService
      .getDropdownList(
        new DropdownListEmailTypeParam({
          emailTemplateTypeName: this.filterText
        })
      )
      .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
      .subscribe((result: any) => {
        this.listItems = result.results;
        this.primengTableHelper.hideLoadingIndicator();
        this.isReadyView = true;
      });
  }

  getDataFromCreateComponent() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const createdData = params.get('createdData');
      if (createdData) {
        const data = JSON.parse(createdData);
        // Xử lý dữ liệu từ trang tạo mới
        console.log('Data from create component:', data);
      }
    });
  }
  onEmailTypeSelect(item: any) {
    if (item && item.emailTemplateTypeId) {
        this.manageEmail.emailTemplateTypeId = item.emailTemplateTypeId;
    }
  }
//   onEmailTypeChange(event: any) {
//     if (!event.value) {
//         this.manageEmail.emailTemplateTypeId = null;
//     }
// }
  onEmailTemplateTypeChange(selectedItem: TypeEmailItemList) {
    if (selectedItem) {
        this.manageEmail.emailTemplateTypeId = selectedItem.id;
        this.emailTypeName = selectedItem.emailTemplateTypeName
        console.log('Selected Email Template Type ID:', this.manageEmail.emailTemplateTypeId);
    }
}


  save(): void {
    const self = this;

    const input = new CreateOrUpdateManageEmailParam();
    input.emailTemplateTypeId = self.manageEmail.emailTemplateTypeId;
    input.emailTemplateCode = self.manageEmail.emailTemplateCode;
    input.description = self.manageEmail.description;
    input.emailTemplateName = self.manageEmail.emailTemplateName;
    input.id = self.manageEmail.id;
    input.titleEmail = self.manageEmail.titleEmail;

    this.saving = true;
    this._manageEmailService
      .updateManageEmail(input, self.manageEmail.id) // Gửi supplierCode là chuỗi
      .pipe(finalize(() => (this.saving = false)))
      .subscribe((data: any) => {
        if (data.responseStatus && data.responseStatus.errorCode == "01") {
          this.message.error(data.responseStatus.message);
        }
        else {
          this.notify.info(this.l('SavedSuccessfully'));
          this.close();
          this.getManageEmail.emit(null);
        }

      });
  }

  show(id?: number): void {
    const self = this;
    self.active = true;

      self._manageEmailService.getManageEmailForEdit(id).subscribe((data : any) => {
        
          if(data.responseStatus && data.responseStatus.errorCode == "01")
          {
             this.message.info(data.responseStatus.message);
             this.close();
             this.getManageEmail.emit(null);
          }
          else{
            self.manageEmail = ManageEmailDto.fromJS(data.results);
            self.manageEmail.emailTemplateTypeId = data.results.emailTemplateTypeId;
            const emailType= this.listItems.find(x => x.id == self.manageEmail.emailTemplateTypeId)
            self.emailTypeName = emailType?.emailTemplateTypeName;
            self.modal.show();
          }
      });
  }
  
  close(): void {
    this.active = false;
    this.manageEmail = new CreateOrUpdateManageEmailParam();
    this.modal.hide();
  }
}
