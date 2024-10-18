import { Component, Injector, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { MatchingDataDto, ReportReconcileService, ReportReconcileSupplierDetailDto, TickingDataDto } from '@shared/service-proxies/report-reconcile-service';
import { MatchingLogsComponent } from '../matching-logs/matching-logs.component';
import { finalize } from 'rxjs';
import { ThemeSettingsDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'report-reconciliation-detail',
  templateUrl: './report-reconciliation-detail.component.html',
  styleUrls: ['./report-reconciliation-detail.component.css']
})
export class ReportReconciliationDetailComponent extends AppComponentBase {
  @ViewChild('matchingLogsModal', { static: true }) matchingLogsModal: MatchingLogsComponent;

  @ViewChild('tableInternal', { read: ElementRef }) tableInternal: ElementRef<any>;
  @ViewChild('tableSupplier', { read: ElementRef }) tableSupplier: ElementRef<any>;

  constructor(injector: Injector
    , private reportService: ReportReconcileService
    , private router: Router
    , private route: ActivatedRoute
  ) {
    super(injector);
  }
  reportId: number | undefined;
  report: ReportReconcileSupplierDetailDto = new ReportReconcileSupplierDetailDto();
  mathDataDto: MatchingDataDto = new MatchingDataDto()
  matching = false;
  reSending = false;
  tickDto: TickingDataDto = new TickingDataDto()
  tickList = []
  validMatching: boolean = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.reportId = params['ReportId']; // Lấy giá trị của tham số
    });

    this.getDetail();
  }
  getListMatchingLogs(): void {
    this.matchingLogsModal.show(this.report.reportId);
  }
  getDetail() {
    if (!this.reportId)
      return;

    this.reportService.getReportReconcileDetail(this.reportId)
      .subscribe((data: any) => {
        if (data.responseStatus && data.responseStatus.errorCode == "01") {
          this.message.info(data.responseStatus.message);
        }
        else {
          this.report = new ReportReconcileSupplierDetailDto(data.results);
        }
      });
  }

  searchByKey(data: { [key: string]: any }[], searchKey: string): any {
    if (!data) return "";
    return data[searchKey];
  }

  checkData(id: number, type: string) {
    const itemTick = this.tickList.find(x => x.id == id && x.type == type)
    if (itemTick) {
      const indexItemTick = this.tickList.indexOf(itemTick)
      this.tickList.splice(indexItemTick, 1)
    }
    else if (!itemTick)
      this.tickList.push({ id: id, type: type })

    if (this.tickList.length == 2) {
      const itemInternal = this.tickList.find(x => x.type == 'internal')
      const itemSupplier = this.tickList.find(x => x.type == 'supplier')

      if(itemInternal && itemSupplier) this.validMatching = true
      else this.validMatching = false
      
    }
    else this.validMatching = false;
  }

  matchingData() {
    this.matching = true;
    this.mathDataDto.matchingType = 1
    const itemInternal = this.tickList.find(x => x.type == 'internal')
    const itemSupplier = this.tickList.find(x => x.type == 'supplier')

    this.mathDataDto.idInternal = itemInternal.id
    this.mathDataDto.idSupplier = itemSupplier.id
    this.mathDataDto.noteMathData = this.noteMathData
    this.reportService.matchingData(this.mathDataDto).pipe(finalize(() => (this.matching = false)))
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.getDetail();
        this.resetData();
        this.noteMathData = ""
        this.showDialogNoteMath = false
      });
  }

  reSendReport() {
    this.reSending = true;
    this.reportService.resendReport(this.report.reportId).pipe(finalize(() => (this.reSending = false)))
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
      });
  }

  tickingData() {
    // Tạo một Set để lưu trữ các id duy nhất
    let uniqueIds = new Set();

    // Mảng mới chứa các object có id duy nhất
    let uniqueObjects = this.tickList.filter(obj => {
      if (!uniqueIds.has(obj.id)) {
        uniqueIds.add(obj.id);
        return true;
      }
      return false;
    });

    this.tickDto.listId = uniqueObjects.map(x => x.id)
    this.tickDto.noteMathData = this.noteMathData
    this.matching = true
    this.reportService.tickingData(this.tickDto)
      .pipe(finalize(() => (this.matching = false)))
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.getDetail();
        this.resetData();
        this.noteMathData = ""
        this.showDialogNoteMath = false
      });
  }

  resetData() {
    this.mathDataDto = new MatchingDataDto()
    this.matching = false;
    this.reSending = false;
    this.tickDto = new TickingDataDto()
    this.tickList = []
    this.validMatching = false;
  }

  @ViewChild('scrollOne') scrollOne: ElementRef;
  @ViewChild('scrollTwo') scrollTwo: ElementRef;

  currentElement: string;
  updateCurrentElement(element: 'scrollOne' | 'scrollTwo') {
    this.currentElement = element;
  }

  updateVerticalScroll(event): void {
    if (this.currentElement === 'scrollTwo') {
      this.tableInternal.nativeElement.scrollTop = event.target.scrollTop;
    } else if (this.currentElement === 'scrollOne') {
      this.tableSupplier.nativeElement.scrollTop = event.target.scrollTop;
    }
  }

  noteMathData: string = ""
  showDialogNoteMath: boolean;
  typeMath
  showDialogNoteMathFunc(typeMath: number) {
    this.typeMath = typeMath
    this.showDialogNoteMath = true
  }

  closeDialogNoteMathFunc() {
    this.showDialogNoteMath = false
    this.noteMathData = ""
  }

  mathConfirm() {
    if (this.typeMath == 1) this.matchingData()
    if (this.typeMath == 2) this.tickingData()
  }
}
