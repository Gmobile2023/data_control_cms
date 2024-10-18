import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FileReportSupplierUpload, ReportReconcileService } from '@shared/service-proxies/report-reconcile-service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'modal-file-reconcile-supplier',
  templateUrl: './modal-file-reconcile-supplier.component.html',
  styleUrls: ['./modal-file-reconcile-supplier.component.css']
})
export class ModalFileReconcileSupplierComponent extends AppComponentBase {
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() downloadFile = new EventEmitter<any>();
  datas: FileReportSupplierUpload[] = []
  constructor(injector: Injector
    , private reportService: ReportReconcileService
  ) {
    super(injector);

  }

  ngOnInit(): void {}
  
  show() {
    this.reportService.getListFileReportSupplier()
      .subscribe((data: any) => {
        if (data.responseStatus && data.responseStatus.errorCode == "01") {
          this.message.info(data.responseStatus.message);
        }
        else {
          this.datas = data.results;
          console.log(this.datas)
        }
      })

    const self = this;
    self.modal.show();
  }

  close(): void {
    this.modal.hide();
  }

  getFileName(filePath) {
    if (!filePath) return ""
    const filePathSplit = filePath.split('/')
    const fileName = filePathSplit[filePathSplit.length - 1]
    return fileName
  }

  getFile(serviceId: number, pathFile: string)
  {
    this.downloadFile.emit({serviceId: serviceId, pathFile: pathFile});
  }
}
