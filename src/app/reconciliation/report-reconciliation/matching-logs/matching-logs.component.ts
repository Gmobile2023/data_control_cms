import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { MatchingLogsDto, ReportReconcileService } from '@shared/service-proxies/report-reconcile-service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'matching-logs',
  templateUrl: './matching-logs.component.html',
  styleUrls: ['./matching-logs.component.css']
})
export class MatchingLogsComponent extends AppComponentBase{
  @ViewChild('matchingLogsModal', { static: true }) modal: ModalDirective;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() getServiceType: EventEmitter<any> = new EventEmitter<any>();
  saving:any;

  constructor(injector: Injector
    , private reportService: ReportReconcileService
  ) {
    super(injector);
  }

  datas : MatchingLogsDto[] = []

  show(reportId : number | undefined): void {
    this.reportService.getLogsByReportId(reportId)
    .subscribe((data:any) => {
      if (data.responseStatus && data.responseStatus.errorCode == "01") {
        this.message.info(data.responseStatus.message);
      }
      else {
        this.datas = data.results;
      }
    })
    const self = this;
    self.modal.show();
  }

  close(){
    const self = this;
    self.modal.hide();
  }
}
