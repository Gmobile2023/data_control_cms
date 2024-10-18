import { Component, Injector, ViewChild } from '@angular/core';
import { AgencyCreateComponent } from '../agency-create/agency-create.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AgencyItemList, AgencyService, GetListAgencyParam } from '@shared/service-proxies/agency-service';
import { LazyLoadEvent } from 'primeng/api';
import { finalize } from 'rxjs';

@Component({
  selector: 'agency-list',
  templateUrl: './agency-list.component.html',
  styleUrls: ['./agency-list.component.css']
})
export class AgencyListComponent extends AppComponentBase  {
  @ViewChild('createAgencyModal', { static: true }) createAgencyModal: AgencyCreateComponent;

  /**
   *
   */
  constructor(injector: Injector,private _agencyService: AgencyService) {
    super(injector);
    
  }

  ngOnInit(): void {
    // Gọi hàm của bạn ở đây
    this.getAgencies();
  }

  paginator = {
    pageSize : 10,
    pageIndex : 1,
    total: 0
  }
  filterText : string | undefined = "";
  agencies:  AgencyItemList[] = []

  createAgency(): void {
    this.createAgencyModal.show();
  }

  getAgencies(event?: LazyLoadEvent) {
   
    this.primengTableHelper.showLoadingIndicator();

    this._agencyService
      .getAgencies(
        new GetListAgencyParam({
           AgencyName : this.filterText,
           SkipCount: this.paginator.pageIndex,
           MaxResultCount: this.paginator.pageSize
        })
      )
      .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
      .subscribe((result) => {
        this.paginator.total = result.totalCount;
        this.agencies = result.items;
        //this.setUsersProfilePictureUrl(this.primengTableHelper.records);
        this.primengTableHelper.hideLoadingIndicator();
      });
  }

  deleteAgency(agency: AgencyItemList): void {

    this.message.confirm(`Đại lý ${agency.agencyName} sẽ bị xóa.`, this.l('AreYouSure'), (isConfirmed) => {
        if (isConfirmed) {
            this._agencyService.deleteAgency(agency.agencyId).subscribe((data : any) => {
              if (data.responseStatus && data.responseStatus.errorCode == "01") {
                this.message.info(data.responseStatus.message);
              }
              else {
                this.notify.success(this.l('SuccessfullyDeleted'));
                this.getAgencies();
              }
            });
        }
    });
  }

  onPageChange(event : any) {
    this.paginator.pageIndex = event.page + 1;
    this.paginator.pageSize = event.rows;

    this.getAgencies();
  }
}
