import { Component, Injector, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DataService, InternalNetworkNumberDto, ManageService, PackOfDataDto } from '@shared/service-proxies/manage-service';
import { finalize } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FileUpload } from 'primeng/fileupload';
import { AppConsts } from '@shared/AppConsts';
import { forIn } from 'lodash-es';

@Component({
  selector: 'control-management-create',
  templateUrl: './control-management-create.component.html',
  styleUrls: ['./control-management-create.component.css']
})
export class ControlManagementCreateComponent extends AppComponentBase {
  listItems: any[];
  listItemCreate: any[];
  listItemPhone: any[];
  showApiButton: boolean = false;
  apiChecked = false;
  showUploadButton: boolean = false;
  packOfData: PackOfDataDto = new PackOfDataDto();
  dataService: DataService = new DataService();

  @ViewChild('ExcelFileInternalNumberUpload', { static: false }) excelFileInternalNumberUpload: FileUpload;
  @ViewChild('ExcelFilePackOfDataUpload', { static: false }) excelFilePackOfDataUpload: FileUpload;
  constructor(
    injector: Injector
    , private router: Router
    , public _manageService: ManageService
    , private http: HttpClient
    , private _httpClient: HttpClient
    , private route: ActivatedRoute
  ) {
    super(injector);
  }

  public templatePackOfDate = [
    "STT"
    , "Mã gói cước"
    , "Tên gói cước"
    , "Giá gói"
    , "Chu kỳ"
    , "Thời gian gia hạn gói"
    , "Thoại nội mạng"
    , "Thoại ngoại mạng"
    , "SMS nội mạng"
    , "SMS ngoại mạng"
    , "Data"
    , "Giá SMS nội mạng"
    , "Giá SMS ngoại mạng"
    , "Giá thoại nội mạng"
    , "Giá thoại ngoại mạng"
    , "Giá data"
    , "Gói cơ bản"
    , "Trạng thái"
  ]

  ngOnInit(): void {
    this.getDetail()
  }

  toggleApiButton() {
    this.showApiButton = !this.showApiButton;
  }

  toggleUploadButton() {
    this.showUploadButton = !this.showUploadButton;
  }

  uploadPackOfData(data: { files: File }): void {
    const formData: FormData = new FormData();
    const file = data.files[0];
    formData.append('file', file, file.name);

    const url = AppConsts.remoteServiceBaseUrl + '/api/services/app/RevenueControl/UploadFilePackOfData'

    this._httpClient
      .post<any>(url, formData)
      .pipe(finalize(() => this.excelFilePackOfDataUpload.clear()))
      .subscribe((response) => {
        console.log(response)
        if (response.success) {
          // this.notify.success(this.l('ImportUsersProcessStart'));
          this.notify.success('Upload file thành công');
          if (response?.result?.responseStatus?.errorCode == "00") {
            this._manageService.dataService.packOfDataDtos = []
            //this.batchFile.BatchFileFieldDataDtos.length = 0
            for (const value of response?.result?.results) {
              let item = PackOfDataDto.fromJS(value)
              this._manageService.dataService.packOfDataDtos.push(item)
            }

            console.log(this._manageService.dataService.packOfDataDtos)
          }
          else {
            this.notify.error(response?.result?.responseStatus?.message);
          }
        } else if (response.error != null) {
          // this.notify.error(this.l('ImportUsersUploadFailed'));
          this.notify.error('Có lỗi xảy ra');
        }
      });
  }

  uploadInternalNumber(data: { files: File }) {
    const formData: FormData = new FormData();
    const file = data.files[0];
    formData.append('file', file, file.name);

    const url = AppConsts.remoteServiceBaseUrl + '/api/services/app/RevenueControl/UploadFileInternallNetworkNumber';

    this._httpClient
      .post<any>(url, formData)
      .pipe(finalize(() => this.excelFileInternalNumberUpload.clear()))
      .subscribe((response) => {
        console.log(response);
        if (response.success) {
          this.notify.success('Upload file thành công');
          if (response?.result?.responseStatus?.errorCode === '00') {
            this._manageService.dataService.internalNetworkNumberDtos = [];
            for (const value of response?.result?.results) {
              const item = InternalNetworkNumberDto.fromJS(value);
              this._manageService.dataService.internalNetworkNumberDtos.push(item);
            }
          } else {
            this.notify.error(response?.result?.responseStatus?.message);
          }
        } else if (response.error != null) {
          this.notify.error('Có lỗi xảy ra');
        }
      });

  }

  complete() {
    this._manageService.saving = true;
    this._manageService
      .CreateDataService()
      .pipe(finalize(() => this._manageService.saving = false))
      .subscribe((data: any) => {
        console.log('Data from createDataService():', data);
        if (data.responseStatus && data.responseStatus.errorCode == "01") {
          this.message.error(data.responseStatus.message);
        }
        else {
          this.notify.info(this.l('SavedSuccessfully'));
         // this.router.navigate(['/app/reconciliation/configureData']);
         // this._manageService.dataService = new DataService();
        }

      });
  }

  cancel() {
    this._manageService.dataService = new DataService();
    this.router.navigate(['/app/reconciliation/configureData']);
  }

  onUploadExcelError(): void {
    this.notify.error("Có lỗi xảy ra");
  }

  ChoseIsBasic(rowIndex) {
    this._manageService.dataService.packOfDataDtos[rowIndex].isBasic = true;

    for (let i = 0; i < this._manageService.dataService.packOfDataDtos.length; i++) {
      if (i == rowIndex) continue;
      this._manageService.dataService.packOfDataDtos[i].isBasic = false;
    }

  }

  getDetail() {

    if(!this._manageService.dataService.id)
    {
      this._manageService.getRevenueControlDetail()
      .subscribe();
    }

  }

  downloaddownloadTemplaetInternalNumber() {
    this._manageService.downloadTemplateInternalNumber().subscribe((data: any) => {
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
        link.download = "DauSo.xlsx";

        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      }
    });
  }

  downloadTemplaetPOD() {
    this._manageService.downloadTemplatePOD().subscribe((data: any) => {
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
        link.download = "GoiCuoc.xlsx";

        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      }
    });
  }
}
