import { Component, Injector, ViewChild, NgModule } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { TypeemailCreateComponent } from '../type-email-create/typeemail-create.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrUpdateTypeEmailParam, TypeEmailDto, TypeEmailService } from '@shared/service-proxies/type-email-service';
import { GetListTypeEmailParam, TypeEmailItemList, PagedResultDtoOfTypeEmailListDto } from '@shared/service-proxies/type-email-service';
import { finalize, from } from 'rxjs';
import {TypeemailUpdateComponent} from '../type-email-update/typeemail-update.component'

@Component({
  selector: 'typeemail-list',
  templateUrl: './typeemail-list.component.html',
  styleUrls: ['./typeemail-list.component.css']
})

export class TypeemailListComponent extends AppComponentBase {

  @ViewChild('createTypeEmailModal', { static: true }) createTypeEmailModal: TypeemailCreateComponent;
  @ViewChild('updateTypeEmailModal', { static: true }) updateTypeEmailModal: TypeemailUpdateComponent;
  // typeEmail : TypeemailCreateComponent[] = []
  constructor(injector: Injector, private _typeEmailService: TypeEmailService) {
    super(injector);
  }
  ngOnInit(): void {
    // Gọi hàm của bạn ở đây
    this.getTypeEmail();
  }
  paginator = {
    pageSize : 10,
    pageIndex : 1,
    total: 0
  }
  
  filterText : string | undefined = "";
  products:  TypeEmailItemList[] = []

  openCreateModal(id? : number)
  {
     this.createTypeEmailModal.show();
  }
  openUpdateModal(id? : number): void {
    this.updateTypeEmailModal.show(id);
  }

  getTypeEmail(event?: LazyLoadEvent) {
   
    this.primengTableHelper.showLoadingIndicator();

    this._typeEmailService
      .getTypeEmail(
        new GetListTypeEmailParam({
          emailTemplateTypeName : this.filterText,
           SkipCount: this.paginator.pageIndex,
           MaxResultCount: this.paginator.pageSize
        })
      )
      .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
      .subscribe((result) => {
        this.paginator.total = result.totalCount;
        this.products = result.items;
        //this.setUsersProfilePictureUrl(this.primengTableHelper.records);
        this.primengTableHelper.hideLoadingIndicator();
      });
  }

  deleteTypeEmail(typeEmail: TypeEmailItemList): void {

    this.message.confirm(`Mẫu Email ${typeEmail.emailTemplateTypeName} sẽ bị xóa`, this.l('AreYouSure'), (isConfirmed) => {
        if (isConfirmed) {
            this._typeEmailService.deleteTypeEmail(typeEmail.id).subscribe((data : any) => {
              if (data.responseStatus && data.responseStatus.errorCode == "01") {
                this.message.info(data.responseStatus.message);
              }
              else {
                this.notify.success(this.l('SuccessfullyDeleted'));
                this.getTypeEmail();
              }  
            });
        }
    });
  }

  onPageChange(event: any) {
    this.paginator.pageIndex = event.page + 1;
    this.paginator.pageSize = event.rows;

    this.getTypeEmail();
  }

  navigateUpdate(id:any){
    this.updateTypeEmailModal.show(id);
  }
 }
