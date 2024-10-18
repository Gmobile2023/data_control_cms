import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DownloandFileFtpParam, FileService } from '@shared/service-proxies/file-service';
import { ReportRevenueDoneReconcileDto, ReportRevenueDoneReconcileSearch, ReportRevenueService } from '@shared/service-proxies/report-revenue-service';
import { finalize } from 'rxjs';

@Component({
  selector: 'report-revenuecontrl',
  templateUrl: './report-revenuecontrl.component.html',
  styleUrls: ['./report-revenuecontrl.component.css']
})
export class ReportRevenuecontrlComponent extends AppComponentBase {
  constructor(injector: Injector
    , public reportService: ReportRevenueService
    , private fileService: FileService
  ) {
    super(injector);
  }

  paginator = {
    pageSize: 10,
    pageIndex: 1,
    total: 0
  }
  filterText: string | undefined = "";
  timeFrom: Date = null;
  timeTo: Date = null;

  listItems: ReportRevenueDoneReconcileDto[] = [];

  ngOnInit(): void {
    this.getReportRevenue()
  }

  getReportRevenue() {

    this.primengTableHelper.showLoadingIndicator();

    this.reportService
      .getList(
        new ReportRevenueDoneReconcileSearch({
          Filter: this.filterText,
          SkipCount: this.paginator.pageIndex,
          MaxResultCount: this.paginator.pageSize,
          TimeFrom: this.timeFrom,
          TimeTo: this.timeTo
        })
      )
      .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
      .subscribe((result) => {
        this.paginator.total = result.totalCount;
        this.listItems = result.items;
        //this.setUsersProfilePictureUrl(this.primengTableHelper.records);
        this.primengTableHelper.hideLoadingIndicator();
      });
  }

  onPageChange(event: any) {
    this.paginator.pageIndex = event.page + 1;
    this.paginator.pageSize = event.rows;

    this.getReportRevenue();
  }

  messageError: string;
  showDialogError: boolean;

  showDialog(message: string) {
    this.messageError = message;
    this.showDialogError = true
  }

  downloadFile(serviceId: number, pathFile: string) {
    const param = DownloandFileFtpParam.fromJS({
      typeService: 1,
      serviceId: serviceId,
      pathFile: pathFile
    })

    var pathFileSplit = pathFile.split('/')
    var fileName = pathFileSplit[pathFileSplit.length - 1]
    this.fileService.downloadFileFtp(param).subscribe((data: any) => {
      console.log(data);
      if (data.responseStatus && data.responseStatus.errorCode == "01") {
        this.message.error(data.responseStatus.message);
      }
      else {
        var file = data.results;
        // Decode base64 data
        const decodedData = atob(file);

        // Convert the decoded data to a Uint8Array
        const uint8Array = new Uint8Array(decodedData.length);
        for (let i = 0; i < decodedData.length; ++i) {
          uint8Array[i] = decodedData.charCodeAt(i);
        }

        // Create a Blob from the Uint8Array
        const blob = new Blob([uint8Array], { type: 'application/octet-stream' });

        // Create a download link and trigger the click event
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;

        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      }
    });
  }
}
