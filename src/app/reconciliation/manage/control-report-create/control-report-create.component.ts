import { Component, Injector, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'control-report-create',
  templateUrl: './control-report-create.component.html',
  styleUrls: ['./control-report-create.component.css']
})
export class ControlReportCreateComponent extends AppComponentBase {
  @ViewChild('createOrEditModal') modal: ModalDirective;
  nhaptenbc: string;
  bangdl:string;
  truongdl:string;
  nhapcotchinh:string;
  tencotphu:string;
  themcotphu: boolean = false;
  loaidl: string;
  chonham:string;
  onChangeSendReportChecked()
  {
    // if(!this._serviceService.service.sendReportChecked)
    // {
    //   this._serviceService.service.isSendMail = false
    //   this._serviceService.service.isUploadFile = false
    // }
  }

  updateStatus()
  {

  }

  complete(){
    
  }
}
