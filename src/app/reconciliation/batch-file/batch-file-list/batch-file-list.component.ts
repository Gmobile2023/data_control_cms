import { Component, Injector,ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { BatchFileItemList, BatchFileSearchListDto, BftemplateService } from '@shared/service-proxies/bftemplate.service';
import { LazyLoadEvent } from 'primeng/api';
import { finalize } from 'rxjs';
import {BatchFileCreateComponent} from '../batch-file-create/batch-file-create.component';
import {BatchFileUpdateComponent} from '../batch-file-update/batch-file-update.component';
import { BatchFileDetailComponent } from '../batch-file-detail/batch-file-detail.component';

@Component({
  selector: 'batch-file-list',
  templateUrl: './batch-file-list.component.html',
  styleUrls: ['./batch-file-list.component.css']
})
export class BatchFileListComponent extends AppComponentBase {

  constructor(injector: Injector
    , private _batchFileService: BftemplateService
    , private router: Router
    ) {
    super(injector);
    
  }
  @ViewChild('createBatchFileModal', { static: true }) createBatchFileModal: BatchFileCreateComponent;
  suppliers : BatchFileSearchListDto[] = []


  @ViewChild('updateBatchFileModal', { static: true }) updateBatchFileModal: BatchFileUpdateComponent;
  @ViewChild('detailBatchFileModal', { static: true }) detailBatchFileModal: BatchFileDetailComponent;

  ngOnInit(): void {
    // Gọi hàm của bạn ở đây
    this.getBatchFiles();
  }

  openCreateModal(id? : number)
  {
     this.createBatchFileModal.show();
  }
  openUpdateModal(id? : number)
  {
     this.updateBatchFileModal.show();
  }

  paginator = {
    pageSize : 10,
    pageIndex : 1,
    total: 0
  }
  filterText : string | undefined = "";
  items:  BatchFileItemList[] = []

  getBatchFiles(event?: LazyLoadEvent) {
   
    this.primengTableHelper.showLoadingIndicator();

    this._batchFileService
      .getBatchFiles(
        new BatchFileSearchListDto({
          BatchFileName : this.filterText,
           SkipCount: this.paginator.pageIndex,
           MaxResultCount: this.paginator.pageSize
        })
      )
      .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
      .subscribe((result) => {
        this.paginator.total = result.totalCount;
        this.items = result.items;
        //this.setUsersProfilePictureUrl(this.primengTableHelper.records);
        this.primengTableHelper.hideLoadingIndicator();
      });
  }

  deleteBatchFile(batchFile: BatchFileItemList): void {
    this.message.confirm(`Mẫu BF ${batchFile.FileName} sẽ bị xóa`, this.l('AreYouSure'), (isConfirmed) => {
        if (isConfirmed) {
            this._batchFileService.deleteBatchFile(batchFile.BatchFileId).subscribe((data : any) => {
                //this.reloadPage();
                if (data.responseStatus && data.responseStatus.errorCode == "01") {
                  this.message.info(data.responseStatus.message);
                }
                else {
                  this.notify.success(this.l('SuccessfullyDeleted'));
                  this.getBatchFiles();
                }
            });
        }
    });
  }

  onPageChange(event : any) {
    this.paginator.pageIndex = event.page + 1;
    this.paginator.pageSize = event.rows;

    this.getBatchFiles();
  }

  navigateDetail(batchId : any)
  {
    // const navigationExtras: NavigationExtras = {
    //   queryParams: { batchFileId: batchId } // Truyền tham số dưới dạng queryParams
    // };
    // this.router.navigate(['/app/reconciliation/batch-file'], navigationExtras);
    this.detailBatchFileModal.show();
  }

  navigateUpdate(batchId : any)
  {
    // const navigationExtras: NavigationExtras = {
    //   queryParams: { batchFileId: batchId } // Truyền tham số dưới dạng queryParams
    // };
    // this.router.navigate(['/app/reconciliation/batch-file/update'], navigationExtras);
    this.updateBatchFileModal.show(batchId);
  }
}
