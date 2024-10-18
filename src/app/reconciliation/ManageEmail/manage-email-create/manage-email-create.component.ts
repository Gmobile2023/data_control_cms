import { Component, Injector, ViewChild, EventEmitter, Output } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { finalize, from } from 'rxjs';
import { CreateOrUpdateManageEmailParam, ManageEmailDto, ManageEmailService, TypeEmailListItem } from '@shared/service-proxies/manage-email-service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TypeEmailDto } from '@shared/service-proxies/type-email-service';
// import { TypeEmailService, TypeEmailItemList} from '@shared/service-proxies/type-email-service';
import { TypeEmailService, DropdownListEmailTypeParam, TypeEmailItemList } from '@shared/service-proxies/type-email-service';
import { FormControl } from '@angular/forms';
import { id } from '@swimlane/ngx-charts';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'manage-email-create',
  templateUrl: './manage-email-create.component.html',
  styleUrls: ['./manage-email-create.component.css']
})
export class ManageEmailCreateComponent extends AppComponentBase {
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() getManageEmail: EventEmitter<any> = new EventEmitter<any>();
  isVisible = false;
  active = false;
  saving = false;
  Msgvisible: boolean = false;
  isEmailCodeExisted: boolean = false;
  selectedId: string | undefined;
  selectedEmailTypeId: string;

  countries: any[] | undefined;

  selectedValue = new FormControl();
  manageEmail: ManageEmailDto = new ManageEmailDto();
  typeEmailItemList : TypeEmailItemList= new TypeEmailItemList();
  constructor(injector: Injector, private _manageEmailService: ManageEmailService, private typeEmailService: TypeEmailService ) {
    super(injector);
  }
  filterText: string | undefined = "";
  productListItem: TypeEmailDto[] = [];
  listItems: TypeEmailItemList[] = [];
  isReadyView = false;
  selectedEmailTemplate: any;
  
  
  ngOnInit() {
    this.loadDropdownData();
  }

  showDialog() {
    this.Msgvisible = true;
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

  selectEmailTemplate(template: any): void {
    this.selectedEmailTemplate = template;
  }

  save(): void {
    const self = this;

    const input = new CreateOrUpdateManageEmailParam();
    input.emailTemplateTypeId = self.manageEmail.emailTemplateTypeId;
    input.emailTemplateCode = self.manageEmail.emailTemplateCode;
    input.description = self.manageEmail.description;
    input.emailTemplateName = self.manageEmail.emailTemplateName;
    input.titleEmail =self.manageEmail.titleEmail;
    

    this.saving = true
    this._manageEmailService
      .createManageEmail(this.manageEmail)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe((data: any) => {
        if (data.responseStatus && data.responseStatus.errorCode == "01") {
          this.message.error(data.responseStatus.message);
        }
        else {
          this.notify.info(this.l('SavedSuccessfully'));
          // this.router.navigate(['/app/reconciliation/batch-file']);
          
          this.modal.hide();
          this.getManageEmail.emit(null);
          this.manageEmail = new CreateOrUpdateManageEmailParam();
        }
      });
  }
  show(id?: number): void {
    const self = this;
    self.active = true;
    self.modal.show();
  }
  close(): void {
    this.active = false;
    this.manageEmail = new CreateOrUpdateManageEmailParam();
    this.modal.hide();
  }

  popoverContent =
    "Khai báo nội dung \"Tiêu đề\" hoặc \"Nội dung\" sử dụng các cú pháp sau: \n" +
    "- {TenNCC}, {TenDaiLy}: gán tên NCC hoặc tên Đại lý tương ứng \n" +
    "- {TenDichVu}: gán tên dịch vụ \n" +
    "- {NgayBatDau}: gán ngày/giờ bắt đầu đối soát \n" +
    "- {NgayKetThuc}: gán ngày/giờ kết thúc chu kỳ đối soát \n" +
    "- {NgayDoiSoat}: gán ngày/giờ thực hiện đối soát \n" +
    "- {Today}: gán ngày/giờ gửi email";
  public getPopoverContentAsHtml(): string {
    return this.popoverContent.replace(/\n/g, '<br>');
  }
}

