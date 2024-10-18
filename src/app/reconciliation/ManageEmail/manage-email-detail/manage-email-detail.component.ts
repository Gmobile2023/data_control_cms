import { Component, Injector, ViewChild, EventEmitter,Output } from '@angular/core';
import { finalize } from 'rxjs';
import { CreateOrUpdateManageEmailParam, ManageEmailDto, ManageEmailService } from '@shared/service-proxies/manage-email-service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/common/app-component-base';
import { extend } from 'lodash-es';
import { TypeEmailDto } from '@shared/service-proxies/type-email-service';
import { TypeEmailService, DropdownListEmailTypeParam, TypeEmailItemList} from '@shared/service-proxies/type-email-service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'manage-email-detail',
  templateUrl: './manage-email-detail.component.html',
  styleUrls: ['./manage-email-detail.component.css']
})
export class ManageEmailDetailComponent extends AppComponentBase{
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
  constructor(injector: Injector, private _manageEmailService: ManageEmailService,private typeEmailService: TypeEmailService ) {
    super(injector);
  }
  filterText: string | undefined = "";
  productListItem: TypeEmailDto[]=[];
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
