import { HttpClient } from '@angular/common/http';
import { Component, Injector, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ServiceService } from '@shared/service-proxies/service-service';
import { BatchFileFieldDataDto, BatchFileFieldDataType, BatchFileFieldDataTypeMapping, BftemplateService, CreateOrUpdateBatchFile } from '@shared/service-proxies/bftemplate.service';
import { environment } from 'environments/environment';
import { FileUpload } from 'primeng/fileupload';
import { empty, finalize } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';



@Component({
  selector: 'batch-file-create',
  templateUrl: './batch-file-create.component.html',
  styleUrls: ['./batch-file-create.component.css']
})
export class BatchFileCreateComponent extends AppComponentBase {
  batchFile: CreateOrUpdateBatchFile = new CreateOrUpdateBatchFile()
  fieldDataType = Object.values(BatchFileFieldDataType).filter(value => typeof value === 'number');
  BatchFileFieldDataTypeMapping = BatchFileFieldDataTypeMapping;
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  active = false;
  saving = false;
  @ViewChild('ExcelFileUpload', { static: false }) excelFileUpload: FileUpload;
  @Output() getBatchFile: EventEmitter<any> = new EventEmitter<any>();

  batchFileFieldDataDto: BatchFileFieldDataDto = new BatchFileFieldDataDto()

  constructor(injector: Injector
    , public serviceService: ServiceService
    , private _batchFileService: BftemplateService
    , private router: Router
    , private _httpClient: HttpClient
  ) {
    super(injector);
  }

 
  showOption: string = 'option1';
  ngOnInit(): void {
    // Gọi hàm của bạn ở đây
    this.batchFile.BatchFileFieldDataDtos = [];
  }

  show(id?: number): void {
    const self = this;
    self.active = true;


    self.modal.show();
  }


  selectedCheckboxIndex: number | null = null;
  onCheckboxChange(index: number) {
    
    if (this.batchFile.BatchFileFieldDataDtos[index].IsKey) {
      this.batchFile.BatchFileFieldDataDtos[index].initialIsRequired = this.batchFile.BatchFileFieldDataDtos[index].IsRequired;
      this.batchFile.BatchFileFieldDataDtos[index].initialIsReconcile = this.batchFile.BatchFileFieldDataDtos[index].IsReconcile;

      this.batchFile.BatchFileFieldDataDtos[index].IsRequired = true;
      this.batchFile.BatchFileFieldDataDtos[index].IsReconcile = true;
    }
    else {
      this.batchFile.BatchFileFieldDataDtos[index].IsRequired = false;
      this.batchFile.BatchFileFieldDataDtos[index].IsReconcile = false;
    }

    if (this.selectedCheckboxIndex !== null && this.selectedCheckboxIndex !== index) {

      // this.batchFile.BatchFileFieldDataDtos[this.selectedCheckboxIndex].IsKey = false;
      // this.batchFile.BatchFileFieldDataDtos[this.selectedCheckboxIndex].IsRequired = false;
      // this.batchFile.BatchFileFieldDataDtos[this.selectedCheckboxIndex].IsReconcile = false;
      this.batchFile.BatchFileFieldDataDtos[this.selectedCheckboxIndex].IsKey = false;

      // Nếu IsRequired và IsReconcile được tích SAU isKey
      if (!this.batchFile.BatchFileFieldDataDtos[this.selectedCheckboxIndex].initialIsRequired &&
        !this.batchFile.BatchFileFieldDataDtos[this.selectedCheckboxIndex].initialIsReconcile) {
        this.batchFile.BatchFileFieldDataDtos[this.selectedCheckboxIndex].IsRequired = false;
        this.batchFile.BatchFileFieldDataDtos[this.selectedCheckboxIndex].IsReconcile = false;
      } else {
        this.batchFile.BatchFileFieldDataDtos[this.selectedCheckboxIndex].IsRequired = true;
        this.batchFile.BatchFileFieldDataDtos[this.selectedCheckboxIndex].IsReconcile = true;
      }
    }
    this.selectedCheckboxIndex = index;


  }
  prevSelectedIndex2: number | null = null;
  prevSelectedIndex: number | null = null;
  onSelectionChange(index: number, value: string, index2: number) {
    if (value === '1' && this.prevSelectedIndex !== null && this.prevSelectedIndex !== index) {
      this.batchFile.BatchFileFieldDataDtos[this.prevSelectedIndex].ColumnIdentified = 0;
    }

    if (value === '1') {
      this.prevSelectedIndex = index;
    } else if (this.prevSelectedIndex === index) {
      this.prevSelectedIndex = null;
    }

    if (value === '2' && this.prevSelectedIndex2 !== null && this.prevSelectedIndex2 !== index2) {
      this.batchFile.BatchFileFieldDataDtos[this.prevSelectedIndex2].ColumnIdentified = 0;
    }
    if (value === '2') {
      this.prevSelectedIndex2 = index2;
    } else if (this.prevSelectedIndex2 === index2) {
      this.prevSelectedIndex2 = null;
    }
  }

  onchangeRadioUseDataFrom(key: any) {
    if (key == 1) {
      this.batchFile.useDataFromEmail = false
      this.batchFile.useDataFromFtp = true
    }

    if (key == 2) {
      this.batchFile.useDataFromEmail = true
      this.batchFile.useDataFromFtp = false
    }
  }

  addRowTableField() {
    this.batchFile.BatchFileFieldDataDtos.push(BatchFileFieldDataDto.fromJS({
      IsKey: false,
      FieldDataName: '',
      DataType: BatchFileFieldDataType.Text,
      BatchFileId: 0,
      ColumnIdentified: 0,
      IsReconcile: false,
      IsRequred: false
    }))
  }

  // deleteRowTableField(row: any) {
  //   const index = this.batchFile.BatchFileFieldDataDtos.indexOf(row);
  //   if (index > -1) { // only splice array when item is found
  //     this.batchFile.BatchFileFieldDataDtos.splice(index, 1); // 2nd parameter means remove one item only
  //   }
  // }

  save() {
    this.saving = true
    this._batchFileService
      .CreateBatchFile(this.batchFile)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe((data: any) => {
        if (data.responseStatus && data.responseStatus.errorCode == "01") {
          this.message.error(data.responseStatus.message);
        }
        else {
          this.notify.info(this.l('SavedSuccessfully'));
          this.router.navigate(['/app/reconciliation/batch-file']);
          this.batchFile = new CreateOrUpdateBatchFile();
          this.isRequiredAll = false
          this.isReconcileAll = false
          this.modal.hide();
          this.getBatchFile.emit(null);
          
        }

      });
  }
  cancel(): void {
    this.active = false;
    this.batchFile = new CreateOrUpdateBatchFile();
    this.batchFile.BatchFileFieldDataDtos = [];
    this.modal.hide();
    this.isRequiredAll = false
    this.isReconcileAll = false
  }

  uploadExcel(data: { files: File }): void {
    const formData: FormData = new FormData();
    const file = data.files[0];
    formData.append('file', file, file.name);

    const url = AppConsts.remoteServiceBaseUrl + '/api/services/app/BatchFile/UploadFileGetBatchFileFieldData'

    this._httpClient
      .post<any>(url, formData)
      .pipe(finalize(() => this.excelFileUpload.clear()))
      .subscribe((response) => {
        console.log(response)
        if (response.success) {
          // this.notify.success(this.l('ImportUsersProcessStart'));
          this.notify.success('Upload file thành công');
          if (response?.result?.responseStatus?.errorCode == "00") {
            this.batchFile.BatchFileFieldDataDtos = []
            //this.batchFile.BatchFileFieldDataDtos.length = 0
            for (const value of response?.result?.results) {
              let item = BatchFileFieldDataDto.fromJS(value)
              this.batchFile.BatchFileFieldDataDtos.push(item)
            }

            console.log(this.batchFile.BatchFileFieldDataDtos)
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

  
  onUploadExcelError(): void {
    this.notify.error("Có lỗi xảy ra");
  }

  trackByFn(index: number, el: any): number {
    return index;
  }

  isReconcileAll = false
  isRequiredAll = false

  toggleReconcileAll() {
   
    for (let item of this.batchFile.BatchFileFieldDataDtos) {
      if(item.IsKey) continue;
      item.IsReconcile = this.isReconcileAll
    }
  }

  toggleRequiredAll() {

    for (let item of this.batchFile.BatchFileFieldDataDtos) {
      if(item.IsKey) continue;
      item.IsRequired = this.isRequiredAll
    }
  }

  changeIsReconcileItem ()
  {
     const itemReconcileFaile = this.batchFile.BatchFileFieldDataDtos.find(x => !x.IsReconcile)
     if(itemReconcileFaile) this.isReconcileAll = false
     else  this.isReconcileAll = true
  }

  changeIsRequiredItem ()
  {
     const itemRequiredFaile = this.batchFile.BatchFileFieldDataDtos.find(x => !x.IsRequired)
     if(itemRequiredFaile) this.isRequiredAll = false
     else  this.isRequiredAll = true
  }
}

