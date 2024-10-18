import { Component, Injector, OnInit, ViewChild, HostListener, ElementRef} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ListSearchParam, ReportReconcileService, ReportReconcileSupplierListItem } from '@shared/service-proxies/report-reconcile-service';
import { SupplierItemList, SupplierService } from '@shared/service-proxies/supplier-service';
import { finalize } from 'rxjs';
import { ModalListFileComponent } from '../modal-list-file/modal-list-file.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalFileReconcileSupplierComponent } from '../modal-file-reconcile-supplier/modal-file-reconcile-supplier.component';
import { Dropdown } from 'primeng/dropdown';
import { ModalFileReconcileAgencyComponent } from '../modal-file-reconcile-agency/modal-file-reconcile-agency.component';
import { DownloandFileFtpParam, FileService } from '@shared/service-proxies/file-service';

@Component({
  selector: 'report-reconciliation',
  templateUrl: './report-reconciliation.component.html',
  styleUrls: ['./report-reconciliation.component.css']
})

export class ReportReconciliationComponent extends AppComponentBase implements OnInit {
  dateForm: FormGroup;
  constructor(injector: Injector
    , private reportService: ReportReconcileService
    , private supplierService: SupplierService
    , private router: Router
    , private formBuilder: FormBuilder
    , private fileService : FileService
  ) {
    super(injector);

  }
  listItems: any[] = [];
  
  @ViewChild('modalListFile', { static: true }) modalListFile: ModalListFileComponent;
  @ViewChild('modalFileSupplier', { static: true }) modalFileSupplier: ModalFileReconcileSupplierComponent;
  @ViewChild('modalFileAgency', { static: true }) modalFileAgency: ModalFileReconcileAgencyComponent;
  @ViewChild('yourDropdown') yourDropdown: Dropdown;
  @ViewChild('yourDropdown', { read: ElementRef }) dropdownPanel: ElementRef;
  
  ngOnInit(): void {
    // Gọi hàm của bạn ở đây
    this.getReportReconciles();
    this.loadData();
    this.dateForm = this.formBuilder.group({
      creationFrom: ['', Validators.required], // Bạn có thể thêm các validator khác nếu cần
      creationTo: ['', Validators.required]
    }, { validator: this.dateRangeValidator });
  }

  dateRangeValidator(formGroup: FormGroup) {
    const creationFrom = formGroup.get('creationFrom').value;
    const creationTo = formGroup.get('creationTo').value;

    // Kiểm tra nếu "Từ ngày" lớn hơn "Đến ngày"
    if (creationFrom && creationTo && creationFrom > creationTo) {
      formGroup.get('creationTo').setErrors({ dateRange: true });
    } else {
      formGroup.get('creationTo').setErrors(null);
    }
  }

  paginator = {
    pageSize: 10,
    pageIndex: 1,
    total: 0
  }
  filter: any = {
    reconcileCode: "",
    serviceName: "",
    creationFrom: null,
    creationTo: null,
    supplierId: 0,
    status: ""
  }
  lstObj: ReportReconcileSupplierListItem[] = []
  suppliers: SupplierItemList[] = []

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const ele = document.getElementById('mydiv');
    ele.click();
  }

  getReportReconciles() {

    this.primengTableHelper.showLoadingIndicator();

    this.reportService
      .getReportReconcil(
        new ListSearchParam({
          CreationTimeFrom: this.filter.creationFrom,
          CreationTimeTo: this.filter.creationTo,
          ReconcileCode: this.filter.reconcileCode,
          ServiceName: this.filter.serviceName,
          Status: this.filter.status,
          SupplierId: this.filter.supplierId,
          SkipCount: this.paginator.pageIndex,
          MaxResultCount: this.paginator.pageSize
        })
      )
      .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
      .subscribe((result) => {
        this.paginator.total = result.totalCount;
        this.lstObj = result.items;
        //this.setUsersProfilePictureUrl(this.primengTableHelper.records);
        this.primengTableHelper.hideLoadingIndicator();
      });
  }

  onPageChange(event: any) {
    this.paginator.pageIndex = event.page + 1;
    this.paginator.pageSize = event.rows;

    this.getReportReconciles();
  }

  loadData() {
    this.supplierService.getSupplierGetAll('')
      .subscribe((response: any) => {
        if (response?.responseStatus?.errorCode == '00') {
          this.suppliers = response?.results
        }
      }) 
  }

  navigateDetail(id: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: { ReportId: id } // Truyền tham số dưới dạng queryParams
    };
    this.router.navigate(['/app/reconciliation/report-reconciliation/detail'], navigationExtras);
  }

  showModalFile() {
    event.preventDefault();
    this.modalListFile.show()
  }

  showMdalFileSupplier()
  {
    event.preventDefault();
    this.modalFileSupplier.show()
  }

  showMdalFileAgency()
  {
    event.preventDefault();
    this.modalFileAgency.show()
  }

  messageError: string;
  reportIdCurrent: number;
  showDialogError: boolean;
  isReReconcile: boolean;
  reReconciling: boolean;
  showDialog(message: string, reportId: number, isReReconcile: boolean) {
    this.messageError = message;
    this.reportIdCurrent = reportId;
    this.showDialogError = true
    this.isReReconcile = isReReconcile
  }

  reReconcile() {
    this.reReconciling = true
    this.reportService.reReconcile(this.reportIdCurrent)
      .pipe(finalize(() => {
        this.showDialogError = false
        this.reReconciling = false
      }))
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.getReportReconciles()
        this.messageError = ''
        this.reportIdCurrent = 0

      })
  }

  closeDialog(listItem: any) {
    listItem.showDialog = false;
  }

  downloadFile(data: any) {
    const param = DownloandFileFtpParam.fromJS({
      typeService: 0,
      serviceId: data.serviceId,
      pathFile: data.pathFile
    })

    var pathFileSplit = data.pathFile.split('/')
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
