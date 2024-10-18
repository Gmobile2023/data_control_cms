import { Component, Injector, ViewChild, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { BatchFileDetail, BatchFileFieldDataType, BatchFileFieldDataTypeMapping, BftemplateService } from '@shared/service-proxies/bftemplate.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'batch-file-detail',
  templateUrl: './batch-file-detail.component.html',
  styleUrls: ['./batch-file-detail.component.css']
})
export class BatchFileDetailComponent extends AppComponentBase {
  constructor(injector: Injector
    , private _batchFileService: BftemplateService
    , private router: Router
    , private route: ActivatedRoute
  ) {
    super(injector);
  }
  fieldDataType = Object.values(BatchFileFieldDataType).filter(value => typeof value === 'number');
  BatchFileFieldDataTypeMapping = BatchFileFieldDataTypeMapping;
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  active =false;
  saving = false;
  @Output() getBactchFile: EventEmitter<any> = new EventEmitter<any>();
  batchFileId: number | undefined;
  batchFile: BatchFileDetail;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.batchFileId = params['batchFileId']; // Lấy giá trị của tham số
    });

    this.getDetail();
  }

  show(batchFileId?: number): void {
    const self = this;
    self.active = true;
    this.batchFileId =batchFileId;
    self._batchFileService.getBatchFileDetail(batchFileId).subscribe((data : any) => {
      if(data.responseStatus && data.responseStatus.errorCode == "01")
      {
         this.message.info(data.responseStatus.message);
         this.cancel();
      }
      else{
        self.batchFile = BatchFileDetail.fromJS(data.results) ;
        self.modal.show();
      }
    });
  }

  getDetail() {
    if (!this.batchFileId)
      return;

    this._batchFileService.getBatchFileDetail(this.batchFileId)
      .subscribe((data: any) => {
        if (data.responseStatus && data.responseStatus.errorCode == "01") {
          this.message.info(data.responseStatus.message);
        }
        else {
          this.batchFile = BatchFileDetail.fromJS(data.results);
          console.log('batchFile chi tiết/n')
          console.log(this.batchFile)
        }
      });
  }
  cancel(): void {
    this.active = false;
    
    this.modal.hide();
  }

  navigateUpdate()
  {
    const navigationExtras: NavigationExtras = {
      queryParams: { batchFileId: this.batchFileId  } // Truyền tham số dưới dạng queryParams
    };
    
  }
}
