import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { ApiException, throwException, blobToText } from './service-proxies';

import { DateTime, Duration } from "luxon";
import { environment } from 'environments/environment';
import { AppConsts } from '@shared/AppConsts';
import { BatchFileFieldDataDto } from './bftemplate.service';


export const API_BASE_URL = new InjectionToken<string>('https://localhost:44301');

@Injectable()
export class ServiceService {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    public serviceId: number;
    public service: ServiceDto = new ServiceDto();
    public updateserviceStatusParam: UpdateStatusServiceParam = new UpdateStatusServiceParam();
    public serviceDetail:ServiceDetailRespon=new ServiceDetailRespon();
    public saving: boolean = false;
    public suppliersForDetail: SupplierServiceListItem[] = []
    public suppliers: SupplierServiceListItem[] = []
    public agencies: AgencyServiceListItem[] = []
    public agenciesForDetail: AgencyServiceListItem[] = []
    private serviceDetailForUpdate: ServiceDetailForUpdate = new ServiceDetailForUpdate()
    public templateBatchFile : BatchFileFieldDataDto[] = []

    public date: any = new Date()
    public day: any = "1"
    public emailTemplates : EmailTemplate[] = []

    public lstWeekDays = [
        { value: "1", text: "Thứ 2" },
        { value: "2", text: "Thứ 3" },
        { value: "3", text: "Thứ 4" },
        { value: "4", text: "Thứ 5" },
        { value: "5", text: "Thứ 6" },
        { value: "6", text: "Thứ 7" },
        { value: "0", text: "Chủ nhật" },
    ]

    public lstMonthDays = [
        { value: "1", text: "Ngày 1" },
        { value: "2", text: "Ngày 2" },
        { value: "3", text: "Ngày 3" },
        { value: "4", text: "Ngày 4" },
        { value: "5", text: "Ngày 5" },
        { value: "6", text: "Ngày 6" },
        { value: "7", text: "Ngày 7" },
        { value: "8", text: "Ngày 8" },
        { value: "9", text: "Ngày 9" },
        { value: "10", text: "Ngày 10" },
        { value: "11", text: "Ngày 11" },
        { value: "12", text: "Ngày 12" },
        { value: "13", text: "Ngày 13" },
        { value: "14", text: "Ngày 14" },
        { value: "15", text: "Ngày 15" },
        { value: "16", text: "Ngày 16" },
        { value: "17", text: "Ngày 17" },
        { value: "18", text: "Ngày 18" },
        { value: "19", text: "Ngày 19" },
        { value: "20", text: "Ngày 20" },
        { value: "21", text: "Ngày 21" },
        { value: "22", text: "Ngày 22" },
        { value: "23", text: "Ngày 23" },
        { value: "24", text: "Ngày 24" },
        { value: "25", text: "Ngày 25" },
        { value: "26", text: "Ngày 26" },
        { value: "27", text: "Ngày 27" },
        { value: "28", text: "Ngày 28" },
        { value: "29", text: "Ngày 29" },
        { value: "30", text: "Ngày 30" },
        { value: "31", text: "Ngày 31" },
    ]

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
        this.service.timeValue = '1'
    }

    getService(body: GetServiceParam | undefined): Observable<PagedResultServiceDto> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Service/Search";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_: any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processGetService(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetService(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<PagedResultServiceDto>;
                }
            } else
                return _observableThrow(response_) as any as Observable<PagedResultServiceDto>;
        }));
    }

    protected processGetService(response: HttpResponseBase): Observable<PagedResultServiceDto> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = PagedResultServiceDto.fromJS(resultData200);
                return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf(null as any);
    }
    /**
    * @param id (optional) 
    * @return Success
    */
    getListSupplier(): Observable<SupplierServiceListItem[]> {
        let url_ = AppConsts.remoteServiceBaseUrl + '/api/services/app/Service/GetListSupplierService?'
        if (this.serviceId === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (this.serviceId !== undefined)
            url_ += "ServiceId=" + encodeURIComponent("" + this.serviceId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processGetListSupplier(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetListSupplier(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<SupplierServiceListItem[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<SupplierServiceListItem[]>;
        }));
    }

    protected processGetListSupplier(response: HttpResponseBase): Observable<SupplierServiceListItem[]> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                return _observableOf(resultData200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }

        return _observableOf(null as any);
    }

    createService(): Observable<any> {
        if (this.service.cycle == 1)
            this.service.timeValue = this.date.getHours().toString() + ":" + this.date.getMinutes().toString() + `/`
        else this.service.timeValue = this.date.getHours().toString() + ":" + this.date.getMinutes().toString() + `/${this.day}`

        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Service/CreateService";

        if (this.service.id !== undefined && this.service.id > 0)
            url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Service/UpdateService?ServiceId=" + encodeURIComponent("" + this.service.id) + "&";

        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(this.service);

        let options_: any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
            })
        };

        let request;
        if (this.service.id !== undefined && this.service.id > 0)
            request = this.http.request("put", url_, options_)
        else request = this.http.request("post", url_, options_)

        return request.pipe(_observableMergeMap((response_: any) => {
            return this.processCreateService(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateService(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<any>;
                }
            } else
                return _observableThrow(response_) as any as Observable<any>;
        }));
    }

    protected processCreateService(response: HttpResponseBase): Observable<any> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                return _observableOf(resultData200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf(null as any);
    }

    updateService(): Observable<any> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Service/UpdateService?";

        if (this.service.id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (this.service.id !== undefined)
            url_ += "ServiceId=" + encodeURIComponent("" + this.service.id) + "&";

        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(this.service);

        let options_: any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
            })
        };

        return this.http.request("put", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processCreateService(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateService(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<any>;
                }
            } else
                return _observableThrow(response_) as any as Observable<any>;
        }));
    }
    protected processUpdateServiceSatus(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                return _observableOf(null as any);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf(null as any);
    }
    updateServiceStatus(): Observable<void> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Service/UpdateServiceStatus";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = JSON.stringify(this.updateserviceStatusParam);
        let options_: any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
            })
        };
        return this.http.request("put", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processUpdateServiceSatus(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateService(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    deleteService(id: number | undefined): Observable<void> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Service/DeleteService?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "serviceId=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
            })
        };

        return this.http.request("delete", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processDeleteService(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDeleteService(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processDeleteService(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
            return _observableOf(null as any);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf(null as any);
    }

    getListEmailTemplate(): Observable<EmailTemplate[]> {
        let url_ = AppConsts.remoteServiceBaseUrl + '/api/services/app/EmailTemplate/GetDropdownList'
       
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processGetListEmailTemplate(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetListEmailTemplate(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<EmailTemplate[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<EmailTemplate[]>;
        }));
    }

    protected processGetListEmailTemplate(response: HttpResponseBase): Observable<EmailTemplate[]> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                return _observableOf(resultData200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }

        return _observableOf(null as any);
    }
}

export class GetServiceParam implements IGetServiceParam {

    ServiceName: string;
    ServiceTypeId: number;
    AgencyId: number;
    agencyCode:string;
    SupplierId: number;
    Cycle: number;
    Status: number;
    SkipCount: number;
    MaxResultCount: number;

    constructor(data?: IGetServiceParam) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.ServiceName = _data["ServiceName"];
            this.ServiceTypeId = _data["ServiceTypeId"]
            this.AgencyId = _data["AgencyId"]
            this.SupplierId = _data["SupplierId"]
            
            this.Cycle = _data["Cycle"]
            this.Status = _data["Status"]
            this.SkipCount = _data["SkipCount"];
            this.MaxResultCount = _data["MaxResultCount"];
        }
    }

    static fromJS(data: any): GetServiceParam {
        data = typeof data === 'object' ? data : {};
        let result = new GetServiceParam();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["ServiceName"] = this.ServiceName;
        data["ServiceTypeId"] = this.ServiceTypeId;
        data["AgencyId"] = this.AgencyId;
        data["SupplierId"] = this.SupplierId;
        data["Cycle"] = this.Cycle;
        data["Status"] = this.Status;
        data["SkipCount"] = this.SkipCount;
        data["MaxResultCount"] = this.MaxResultCount;
        return data;
    }
}

export interface IGetServiceParam {
    ServiceName: string | undefined;
    ServiceTypeId: number;
    AgencyId: number;
    agencyCode: string;
    SupplierId: number;
    Cycle: number;
    Status: number;
    SkipCount: number;
    MaxResultCount: number;
}
export class PagedResultServiceDto implements IPagedResultServiceDto {
    totalCount!: number;
    items!: ServiceItemList[] | undefined;

    constructor(data?: IPagedResultServiceDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.totalCount = _data["totalCount"];
            if (Array.isArray(_data["items"])) {
                this.items = [] as any;
                for (let item of _data["items"])
                    this.items!.push(ServiceItemList.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultServiceDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultServiceDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["totalCount"] = this.totalCount;
        if (Array.isArray(this.items)) {
            data["items"] = [];
            for (let item of this.items)
                data["items"].push(item.toJSON());
        }
        return data;
    }
}

export interface IPagedResultServiceDto {
    totalCount: number;
    items: ServiceItemList[] | undefined;
}
export class ServiceItemList implements IServiceItemList {

    id: number | undefined
    serviceName: string | undefined;
    serviceCode: string | undefined;
    serviceTypeName: string | undefined;
    cycle: number | undefined;
    supplierName: string | undefined;
    agencyName: string | undefined;
    description: string | undefined;
    status: number | undefined;
    displayStatus?: string;

    constructor(data?: IServiceItemList) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.serviceCode = _data["serviceCode"];
            this.serviceName = _data["serviceName"];
            this.serviceTypeName = _data["serviceTypeName"];
            this.supplierName = _data["supplierName"];
            this.agencyName = _data["agencyName"];
            this.cycle = _data["cycle"];
            this.status = _data["status"];
            this.description = _data["description"];
            this.id = _data["id"];
        }
    }

    static fromJS(data: any): ServiceItemList {
        data = typeof data === 'object' ? data : {};
        let result = new ServiceItemList();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["serviceName"] = this.serviceName;
        data["serviceCode"] = this.serviceCode;
        data["supplierName"] = this.supplierName;
        data["serviceTypeName"] = this.serviceTypeName;
        data["agencyName"] = this.agencyName;
        data["cycle"] = this.cycle;
        data["status"] = this.status;
        data["description"] = this.description;
        return data;
    }
}

export interface IServiceItemList {
    id: number | undefined
    serviceName: string | undefined;
    serviceCode: string | undefined;
    serviceTypeName: string | undefined;
    cycle: number | undefined;
    supplierName: string | undefined;
    agencyName: string | undefined;
    description: string | undefined;
    status: number | undefined;
}
export enum CycleEnum {
    Daily = 1,
    Weekly = 2,
    Monthly = 3
}
export const CycleEnumMapping: Record<CycleEnum, string> = {
    [CycleEnum.Daily]: "Daily",
    [CycleEnum.Weekly]: "Weekly",
    [CycleEnum.Monthly]: "Monthly",
};

export class SupplierServiceListItem implements ISupplierServiceListItem {
    supplierName: string;
    status: string;
    id: number;
    supplierCode: string;

    constructor(data?: ISupplierServiceListItem) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.supplierName = _data["supplierName"];
            this.status = _data["status"];
            this.id = _data["id"];
        }
    }

    static fromJS(data: any): SupplierServiceListItem {
        data = typeof data === 'object' ? data : {};
        let result = new SupplierServiceListItem();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["supplierName"] = this.supplierName;
        data["status"] = this.status;
        data["id"] = this.id;

        return data;
    }
}

export interface ISupplierServiceListItem {
    supplierName: string | undefined,
    status: string | undefined,
    id: number | undefined
}

export class ServiceDto implements IServiceDto {

    serviceName: string;
    serviceCode: string;
    serviceTypeId: number;
    description: string;
    cycle: number = 1;
    timeValue: string;
    receiverMail: string;
    isSendSuccessMail: boolean;
    isSendFailMail: boolean;
    bfSourceId: number;
    uploadUrl: string;
    uploadUrlAccount: string;
    uploadUrlPassword: string;
    supplierServices: SupplierServiceDto[] | undefined = [];
    agencyServices: AgencyServiceDto[] = [];
    id: number;

    daysDifference: number = 1;
    fileNameFormat: string;
    emailSendTemplateId: number;
    isSendMail: boolean;
    isUploadFile: boolean = true;
    sendReportChecked: boolean = false;
    constructor(data?: IServiceDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }

        this.timeValue = '1'
    }   
    
    init(_data?: any) {
        if (_data) {
            this.serviceName = _data["serviceName"];
            this.serviceCode = _data["serviceCode"];
            this.serviceTypeId = _data["serviceTypeId"];
            this.description = _data["description"];
            this.cycle = _data["cycle"];
            this.timeValue = _data["timeValue"];
            this.receiverMail = _data["receiverMail"];
            this.isSendSuccessMail = _data["isSendSuccessMail"];
            this.isSendFailMail = _data["isSendFailMail"];
            this.bfSourceId = _data["bfSourceId"];
            this.uploadUrl = _data["uploadUrl"];
            this.id = _data["id"];
            this.uploadUrlAccount = _data["uploadUrlAccount"];
            this.uploadUrlPassword = _data["uploadUrlPassword"];

            this.emailSendTemplateId = _data["emailSendTemplateId"];
            this.fileNameFormat = _data["fileNameFormat"];
            this.daysDifference = _data["daysDifference"];
            this.isSendMail = _data["isSendMail"];
            this.isUploadFile = _data["isUploadFile"];
            

            if (Array.isArray(_data["supplierServices"])) {
                this.supplierServices = [] as any;
                for (let item of _data["supplierServices"])
                    this.supplierServices!.push(SupplierServiceDto.fromJS(item));
            }

            if (Array.isArray(_data["agencyServices"])) {
                this.agencyServices = [] as any;
                for (let item of _data["agencyServices"])
                    this.agencyServices!.push(AgencyServiceDto.fromJS(item));
            }

            this.sendReportChecked =  this.isSendMail ||  this.isUploadFile
        }
    }

    static fromJS(data: any): ServiceDto {
        data = typeof data === 'object' ? data : {};
        let result = new ServiceDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["serviceName"] = this.serviceName;
        data["serviceCode"] = this.serviceCode;
        data["serviceTypeId"] = this.serviceTypeId;
        data["description"] = this.description;
        data["cycle"] = this.cycle;
        data["timeValue"] = this.timeValue;
        data["receiverMail"] = this.receiverMail;
        data["isSendSuccessMail"] = this.isSendSuccessMail;
        data["isSendFailMail"] = this.isSendFailMail;
        data["bfSourceId"] = this.bfSourceId;
        data["uploadUrl"] = this.uploadUrl;
        data["uploadUrlAccount"] = this.uploadUrlAccount;
        data["uploadUrlPassword"] = this.uploadUrlPassword;

        data["emailSendTemplateId"] = this.emailSendTemplateId;
        data["fileNameFormat"] = this.fileNameFormat;
        data["daysDifference"] = this.daysDifference;
        data["isSendMail"] = this.isSendMail;
        data["isUploadFile"] = this.isUploadFile;
        

        if (Array.isArray(this.supplierServices)) {
            data["supplierServices"] = [];
            for (let item of this.supplierServices)
                data["supplierServices"].push(item.toJSON());
        }

        if (Array.isArray(this.agencyServices)) {
            data["agencyServices"] = [];
            for (let item of this.agencyServices)
                data["agencyServices"].push(item.toJSON());
        }

        return data;
    }
}

export interface IServiceDto {
    serviceName: string | undefined,
    serviceCode: string | undefined,
    serviceTypeId: number | undefined,
    description: string | undefined,
    cycle: number | undefined,
    timeValue: string | undefined,
    receiverMail: string | undefined,
    isSendSuccessMail: boolean | undefined,
    isSendFailMail: boolean | undefined,
    bfSourceId: number | undefined,
    uploadUrl: string | undefined,
    uploadUrlAccount: string | undefined,
    uploadUrlPassword: string | undefined,
    supplierServices: SupplierServiceDto[] | undefined,
    agencyServices: AgencyServiceDto[] | undefined,
    id: number | undefined,

    daysDifference: number,
    fileNameFormat :string,
    emailSendTemplateId: number,
    isSendMail : boolean,
    isUploadFile : boolean
}

export class SupplierServiceDto implements ISupplierServiceDto {
    serviceId: number;
    supplierId: number;
    dataSourceLink: string;
    dataSourceAccount: string;
    dataSourcePassword: string;
    isDataSourceFromSupplier: boolean;
    cycle: number = 1;
    timeValue: string;
    emailReceiver: string;
    isEmailFromSupplier: boolean;
    isSendEmailMatch: boolean;
    isSendEmailFalse: boolean;
    id: number;

    date: any = new Date();
    day: any = "1";
    isUseSupplierName: boolean = false;
    isUseSupplierCode: boolean = true;
    status: boolean;
    template : SupplierServiceTemplateDto[] = [];

    fileNameReconcileFormat: string;
    daysDifference: number = 0;

    useDataFromFtp: boolean =true;
    useDataFromEmail: boolean = false;
    emailHost: string;
    emailPort: string;
    emailAccount: string;
    emailPassword: string;
    subjectEmailIdentified: string;
    fileNameFormatSend: string;
    emailSendTemplateId: number;

    constructor(data?: ISupplierServiceDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }

        this.date = new Date()
        this.isUseSupplierCode = true
        this.isUseSupplierName = false
    }
    isSendMail: boolean;
    sendReportChecked : boolean = false;
    init(_data?: any) {
        if (_data) {
            this.serviceId = _data["serviceId"];
            this.supplierId = _data["supplierId"];
            this.dataSourceLink = _data["dataSourceLink"];
            this.dataSourceAccount = _data["dataSourceAccount"];
            this.dataSourcePassword = _data["dataSourcePassword"];
            this.isDataSourceFromSupplier = _data["isDataSourceFromSupplier"];
            this.cycle = _data["cycle"];
            this.timeValue = _data["timeValue"];
            this.emailReceiver = _data["emailReceiver"];
            this.isEmailFromSupplier = _data["isEmailFromSupplier"];
            this.isSendEmailMatch = _data["isSendEmailMatch"];
            this.isSendEmailFalse = _data["isSendEmailFalse"];
            this.status = _data["status"];
            this.id = _data["id"];
            this.isUseSupplierCode = _data["isUseSupplierCode"];
            this.isUseSupplierName = _data["isUseSupplierName"];

            this.fileNameReconcileFormat = _data["fileNameReconcileFormat"];
            this.daysDifference = _data["daysDifference"];

            this.useDataFromFtp = _data["useDataFromFtp"];
            this.useDataFromEmail = _data["useDataFromEmail"];
            this.emailHost = _data["emailHost"];
            this.emailPort = _data["emailPort"];
            this.emailAccount = _data["emailAccount"];
            this.emailPassword = _data["emailPassword"];
            this.subjectEmailIdentified = _data["subjectEmailIdentified"];
            this.fileNameFormatSend = _data["fileNameFormatSend"];
            this.emailSendTemplateId = _data["emailSendTemplateId"];
            this.isSendMail = _data["isSendMail"];

            if (this.timeValue) {
                const splitArr = this.timeValue.split('/')
                const time = splitArr[0].split(':')
                this.date = new Date(0, 0, 0, Number(time[0]), Number(time[1]))
                this.day = splitArr[1]
            }

            if (Array.isArray(_data["template"])) {
                this.template = [] as any;
                for (let item of _data["template"])
                    this.template!.push(SupplierServiceTemplateDto.fromJS(item));
            }

            this.sendReportChecked =  this.isSendMail
        }
    }

    static fromJS(data: any): SupplierServiceDto {
        data = typeof data === 'object' ? data : {};
        let result = new SupplierServiceDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["serviceId"] = this.serviceId;
        data["supplierId"] = this.supplierId;
        data["dataSourceLink"] = this.dataSourceLink;
        data["dataSourceAccount"] = this.dataSourceAccount;
        data["dataSourcePassword"] = this.dataSourcePassword;
        data["isDataSourceFromSupplier"] = this.isDataSourceFromSupplier;
        data["cycle"] = this.cycle;
        data["timeValue"] = this.timeValue;
        data["emailReceiver"] = this.emailReceiver;
        data["isEmailFromSupplier"] = this.isEmailFromSupplier;
        data["isSendEmailMatch"] = this.isSendEmailMatch;
        data["isSendEmailFalse"] = this.isSendEmailFalse;
        data["status"] = this.status;
        data["isUseSupplierCode"] = this.isUseSupplierCode;
        data["isUseSupplierName"] = this.isUseSupplierName;

        data["fileNameReconcileFormat"] = this.fileNameReconcileFormat;
        data["daysDifference"] = this.daysDifference;

        data["useDataFromFtp"] = this.useDataFromFtp;
        data["useDataFromEmail"] =  this.useDataFromEmail;
        data["emailHost"] = this.emailHost;
        data["emailPort"] = this.emailPort;
        data["emailAccount"] = this.emailAccount;
        data["emailPassword"] = this.emailPassword;
        data["subjectEmailIdentified"] = this.subjectEmailIdentified;
        data["fileNameFormatSend"] = this.fileNameFormatSend;
        data["emailSendTemplateId"] = this.emailSendTemplateId;
        data["isSendMail"] = this.isSendMail;

        if (Array.isArray(this.template)) {
            data["template"] = [];
            for (let item of this.template)
                data["template"].push(item.toJSON());
        }

        return data;
    }
}

export interface ISupplierServiceDto {
    serviceId: number | undefined,
    supplierId: number | undefined,
    dataSourceLink: string | undefined,
    dataSourceAccount: string | undefined,
    dataSourcePassword: string | undefined,
    isDataSourceFromSupplier: boolean | undefined,
    cycle: number | undefined,
    timeValue: string | undefined,
    emailReceiver: string | undefined,
    isEmailFromSupplier: boolean | undefined,
    isSendEmailMatch: boolean | undefined,
    isSendEmailFalse: boolean | undefined,
    status: boolean | undefined,
    id: number | undefined,
    isUseSupplierName: boolean | undefined,
    isUseSupplierCode: boolean | undefined,

    template : SupplierServiceTemplateDto[] | undefined

    fileNameReconcileFormat: string;
    useDataFromFtp: boolean;
    useDataFromEmail: boolean;
    emailHost: string;
    emailPort: string;
    emailAccount: string;
    emailPassword: string;
    subjectEmailIdentified: string;
    daysDifference : number;
    fileNameFormatSend: string,
    emailSendTemplateId: number,
    isSendMail : boolean
}

export class AgencyServiceDto implements IAgencyServiceDto {
    serviceId: number;
    agencyId: number;
    agencyCode: string;
    status: boolean;
    email: string;
    isUseAgencyEmail: boolean;
    isSendSuccessMail: boolean;
    isSendFailMail: boolean;
    uploadReportFileLink: string;
    isUseUploadReportFileLink: boolean;
    account: string;
    password: string;
    isUploadSuccessFile: boolean;
    isUploadFailFile: boolean;
    cycle: number = 1;
    timeValue: string;
    id: number | undefined;

    date: any = new Date();
    day: any = "1";
    isUseAgencyName: boolean = false;
    isUseAgencyCode: boolean = true;
    template: AgencyServiceTemplateReportDto[] = [];

    fileNameFormatSend: string;
    emailSendTemplateId: number;
    isSendMailAfterReconcile: boolean;

    constructor(data?: IAgencyServiceDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }

        this.date = new Date()
    }
     
    init(_data?: any) {
        if (_data) {
            this.serviceId = _data["serviceId"];
            this.agencyId = _data["agencyId"];
            this.status = _data["status"];
            this.email = _data["email"];
            this.isUseAgencyEmail = _data["isUseAgencyEmail"];
            this.isSendSuccessMail = _data["isSendSuccessMail"];
            this.isSendFailMail = _data["isSendFailMail"];
            this.uploadReportFileLink = _data["uploadReportFileLink"];
            this.isUseUploadReportFileLink = _data["isUseUploadReportFileLink"];
            this.account = _data["account"];
            this.password = _data["password"];
            this.isUploadSuccessFile = _data["isUploadSuccessFile"];
            this.isUploadFailFile = _data["isUploadFailFile"];
            this.cycle = _data["cycle"];
            this.timeValue = _data["timeValue"];
            this.id = _data["id"];
            this.isUseAgencyCode = _data["isUseAgencyCode"];
            this.isUseAgencyName = _data["isUseAgencyName"];

            this.fileNameFormatSend = _data["fileNameFormatSend"];
            this.emailSendTemplateId = _data["emailSendTemplateId"];
            this.isSendMailAfterReconcile = _data["isSendMailAfterReconcile"];

            if (this.timeValue) {
                const splitArr = this.timeValue.split('/')
                const time = splitArr[0].split(':')
                this.date = new Date(0, 0, 0, Number(time[0]), Number(time[1]))
                this.day = splitArr[1]
            }

            if (Array.isArray(_data["template"])) {
                this.template = [] as any;
                for (let item of _data["template"])
                    this.template!.push(AgencyServiceTemplateReportDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): AgencyServiceDto {
        data = typeof data === 'object' ? data : {};
        let result = new AgencyServiceDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["serviceId"] = this.serviceId;
        data["agencyId"] = this.agencyId;
        data["status"] = this.status;
        data["email"] = this.email;
        data["isUseAgencyEmail"] = this.isUseAgencyEmail;
        data["isSendSuccessMail"] = this.isSendSuccessMail;
        data["cycle"] = this.cycle;
        data["timeValue"] = this.timeValue;
        data["isSendFailMail"] = this.isSendFailMail;
        data["uploadReportFileLink"] = this.uploadReportFileLink;
        data["account"] = this.account;
        data["password"] = this.password;
        data["isUploadSuccessFile"] = this.isUploadSuccessFile;
        data["isUseUploadReportFileLink"] = this.isUseUploadReportFileLink;
        data["isUploadFailFile"] = this.isUploadFailFile;
        data["id"] = this.id;
        data["isUseAgencyCode"] = this.isUseAgencyCode;
        data["isUseAgencyName"] = this.isUseAgencyName;

        data["fileNameFormatSend"] =  this.fileNameFormatSend ;
        data["emailSendTemplateId"] = this.emailSendTemplateId;
        data["isSendMailAfterReconcile"] = this.isSendMailAfterReconcile;

        if (Array.isArray(this.template)) {
            data["template"] = [];
            for (let item of this.template)
                data["template"].push(item.toJSON());
        }

        return data;
    }
}

export interface IAgencyServiceDto {
    serviceId: number | undefined,
    agencyId: number | undefined,
    agencyCode: string | undefined,
    status: boolean | undefined,
    email: string | undefined,
    isUseAgencyEmail: boolean | undefined,
    isSendSuccessMail: boolean | undefined,
    isSendFailMail: boolean | undefined,
    uploadReportFileLink: string | undefined,
    isUseUploadReportFileLink: boolean | undefined,
    account: string | undefined,
    password: string | undefined,
    isUploadSuccessFile: boolean | undefined,
    isUploadFailFile: boolean | undefined,
    cycle: number | undefined,
    timeValue: string | undefined
    id: number | undefined,
    isUseAgencyName: boolean | undefined,
    isUseAgencyCode: boolean | undefined,
    template : AgencyServiceTemplateReportDto[] | undefined,
    fileNameFormatSend : string,
    emailSendTemplateId : number,
    isSendMailAfterReconcile: boolean
}

export class AgencyServiceListItem implements IAgencyServiceListItem {
    id: number | undefined;
    agencyName: string;
    status: string;
    actionList: string;

    constructor(data?: IAgencyServiceListItem) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.id = _data["id"];
            this.agencyName = _data["agencyName"];
            this.actionList = _data["actionList"];
            this.status = _data["status"];
        }
    }

    static fromJS(data: any): AgencyServiceListItem {
        data = typeof data === 'object' ? data : {};
        let result = new AgencyServiceListItem();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["agencyName"] = this.agencyName;
        data["actionList"] = this.actionList;
        data["status"] = this.status;
        return data;
    }
}


export interface IAgencyServiceListItem {
    id: number | undefined;
    agencyName: string | undefined,
    status: string | undefined,
    actionList: string | undefined
}

export class ServiceDetailForUpdate implements IServiceDetailForUpdate {
    id: number;
    serviceName: string;
    serviceCode: string;
    serviceTypeId: number;
    description: string;
    cycle: number;
    timeValue: string;
    receiverMail: string;
    isSendSuccessMail: boolean;
    isSendFailMail: boolean;
    bfSourceId: number;
    uploadUrl: string;
    supplierServices: SupplierServiceDto[];
    agencyServices: AgencyServiceDto[];
    agencyServiceListItems: AgencyServiceListItem[];
    supplierServiceListItems: SupplierServiceListItem[];

    constructor(data?: IServiceDetailForUpdate) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.serviceName = _data["serviceName"];
            this.serviceCode = _data["serviceCode"];
            this.serviceTypeId = _data["serviceTypeId"];
            this.description = _data["description"];
            this.cycle = _data["cycle"];
            this.timeValue = _data["timeValue"];
            this.receiverMail = _data["receiverMail"];
            this.isSendSuccessMail = _data["isSendSuccessMail"];
            this.isSendFailMail = _data["isSendFailMail"];
            this.bfSourceId = _data["bfSourceId"];
            this.uploadUrl = _data["uploadUrl"];
            this.id = _data["id"];

            if (Array.isArray(_data["supplierServices"])) {
                this.supplierServices = [] as any;
                for (let item of _data["supplierServices"])
                    this.supplierServices!.push(SupplierServiceDto.fromJS(item));
            }

            if (Array.isArray(_data["agencyServices"])) {
                this.agencyServices = [] as any;
                for (let item of _data["agencyServices"])
                    this.agencyServices!.push(AgencyServiceDto.fromJS(item));
            }

            if (Array.isArray(_data["supplierServiceListItems"])) {
                this.supplierServiceListItems = [] as any;
                for (let item of _data["supplierServiceListItems"])
                    this.supplierServiceListItems!.push(SupplierServiceListItem.fromJS(item));
            }

            if (Array.isArray(_data["agencyServiceListItems"])) {
                this.agencyServiceListItems = [] as any;
                for (let item of _data["agencyServiceListItems"])
                    this.agencyServiceListItems!.push(AgencyServiceListItem.fromJS(item));
            }
        }
    }

    static fromJS(data: any): ServiceDetailForUpdate {
        data = typeof data === 'object' ? data : {};
        let result = new ServiceDetailForUpdate();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["serviceName"] = this.serviceName;
        data["serviceCode"] = this.serviceCode;
        data["serviceTypeId"] = this.serviceTypeId;
        data["description"] = this.description;
        data["cycle"] = this.cycle;
        data["timeValue"] = this.timeValue;
        data["receiverMail"] = this.receiverMail;
        data["isSendSuccessMail"] = this.isSendSuccessMail;
        data["isSendFailMail"] = this.isSendFailMail;
        data["bfSourceId"] = this.bfSourceId;
        data["uploadUrl"] = this.uploadUrl;
        data["id"] = this.id;

        if (Array.isArray(this.supplierServices)) {
            data["supplierServices"] = [];
            for (let item of this.supplierServices)
                data["supplierServices"].push(item.toJSON());
        }

        if (Array.isArray(this.agencyServices)) {
            data["agencyServices"] = [];
            for (let item of this.agencyServices)
                data["agencyServices"].push(item.toJSON());
        }

        if (Array.isArray(this.supplierServiceListItems)) {
            data["supplierServiceListItems"] = [];
            for (let item of this.supplierServiceListItems)
                data["supplierServiceListItems"].push(item.toJSON());
        }

        if (Array.isArray(this.agencyServiceListItems)) {
            data["agencyServiceListItems"] = [];
            for (let item of this.agencyServiceListItems)
                data["agencyServiceListItems"].push(item.toJSON());
        }

        return data;
    }
}

export interface IServiceDetailForUpdate {
    id: number | undefined,
    serviceName: string | undefined,
    serviceCode: string | undefined,
    serviceTypeId: number | undefined,
    description: string | undefined,
    cycle: number | undefined,
    timeValue: string | undefined,
    receiverMail: string | undefined,
    isSendSuccessMail: boolean | undefined,
    isSendFailMail: boolean | undefined,
    bfSourceId: number | undefined,
    uploadUrl: string | undefined,
    supplierServices: SupplierServiceDto[] | undefined,
    agencyServices: AgencyServiceDto[] | undefined,
    agencyServiceListItems: AgencyServiceListItem[] | undefined,
    supplierServiceListItems: SupplierServiceListItem[] | undefined
}

export interface IServiceDetailRespon {
    id: number | undefined
    serviceName: string | undefined;
    serviceCode: string | undefined;
    serviceTypeName: string | undefined;
    bfSourceName: string | undefined;
    cycle: number | undefined;
    description: string | undefined;
    timeValue:string | undefined;
    receiverMail:string | undefined;
    uploadUrl:string | undefined;
    isSendSuccessMail:boolean | undefined;
    isSendFailMail:boolean | undefined;
    agencyServiceListItems: AgencyServiceListItem[]| undefined;
    supplierServiceListItems: SupplierServiceListItem[]| undefined;
}

export class ServiceDetailRespon implements IServiceDetailRespon {
    id: number | undefined
    serviceName: string | undefined;
    serviceCode: string | undefined;
    serviceTypeName: string | undefined;
    bfSourceName: string | undefined;
    cycle: number | undefined;
    description: string | undefined;
    timeValue:string | undefined;
    receiverMail:string | undefined;
    uploadUrl:string | undefined;
    isSendSuccessMail:boolean | undefined;
    isSendFailMail:boolean | undefined;
    agencyServiceListItems: AgencyServiceListItem[]| undefined;
    supplierServiceListItems: SupplierServiceListItem[]| undefined;

    constructor(data?: IServiceDetailRespon) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.id = _data["id"];
            this.serviceName = _data["serviceName"];
            this.serviceCode = _data["serviceCode"];
            this.serviceTypeName = _data["serviceTypeName"];
            this.bfSourceName = _data["bfSourceName"];
            this.description = _data["description"];
            this.cycle = _data["cycle"];
            this.timeValue = _data["timeValue"];
            this.receiverMail = _data["receiverMail"];
            this.isSendSuccessMail = _data["isSendSuccessMail"];
            this.isSendFailMail = _data["isSendFailMail"];
            this.uploadUrl = _data["uploadUrl"];

            if (Array.isArray(_data["supplierServiceListItems"])) {
                this.supplierServiceListItems = [] as any;
                for (let item of _data["supplierServiceListItems"])
                    this.supplierServiceListItems!.push(SupplierServiceListItem.fromJS(item));
            }

            if (Array.isArray(_data["agencyServiceListItems"])) {
                this.agencyServiceListItems = [] as any;
                for (let item of _data["agencyServiceListItems"])
                    this.agencyServiceListItems!.push(AgencyServiceListItem.fromJS(item));
            }
        }
    }

    static fromJS(data: any): ServiceDetailRespon {
        data = typeof data === 'object' ? data : {};
        let result = new ServiceDetailRespon();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["serviceName"] = this.serviceName;
        data["serviceCode"] = this.serviceCode;
        data["serviceTypeName"] = this.serviceTypeName;
        data["description"] = this.description;
        data["cycle"] = this.cycle;
        data["timeValue"] = this.timeValue;
        data["receiverMail"] = this.receiverMail;
        data["isSendSuccessMail"] = this.isSendSuccessMail;
        data["isSendFailMail"] = this.isSendFailMail;
        data["bfSourceName"] = this.bfSourceName;
        data["uploadUrl"] = this.uploadUrl;
        data["id"] = this.id;

        if (Array.isArray(this.supplierServiceListItems)) {
            data["supplierServiceListItems"] = [];
            for (let item of this.supplierServiceListItems)
                data["supplierServiceListItems"].push(item.toJSON());
        }

        if (Array.isArray(this.agencyServiceListItems)) {
            data["agencyServiceListItems"] = [];
            for (let item of this.agencyServiceListItems)
                data["agencyServiceListItems"].push(item.toJSON());
        }

        return data;
    }
}
export interface IUpdateStatusServiceParam {
    serviceId: number | undefined
    status: number | undefined
}
export class UpdateStatusServiceParam implements IUpdateStatusServiceParam {
    serviceId: number | undefined
    status: number | undefined

    constructor(data?: IServiceDetailRespon) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.serviceId = _data["serviceId"];
            this.status = _data["status"];
        }
    }

    static fromJS(data: any): ServiceDetailRespon {
        data = typeof data === 'object' ? data : {};
        let result = new ServiceDetailRespon();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["serviceId"] = this.serviceId;
        data["status"] = this.status;
        return data;
    }
}

export class SupplierServiceTemplateDto implements ISupplierServiceTemplateDto
{
    fieldNameTemplateSupplier: string;
    fieldNameTemplateBatchFile: string;
    fieldDataBatchFileId: number;
    isRequired: boolean;
    isKey: boolean;

    constructor(data?: ISupplierServiceTemplateDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
   
    init(_data?: any) {
        if (_data) {
            this.fieldNameTemplateSupplier = _data["fieldNameTemplateSupplier"];
            this.fieldNameTemplateBatchFile = _data["fieldNameTemplateBatchFile"];
            this.fieldDataBatchFileId = _data["fieldDataBatchFileId"];
            this.isRequired = _data["isRequired"];
            this.isKey = _data["isKey"];
        }
    }

    static fromJS(data: any): SupplierServiceTemplateDto {
        data = typeof data === 'object' ? data : {};
        let result = new SupplierServiceTemplateDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["fieldNameTemplateSupplier"] = this.fieldNameTemplateSupplier;
        data["fieldNameTemplateBatchFile"] = this.fieldNameTemplateBatchFile;
        data["fieldDataBatchFileId"] = this.fieldDataBatchFileId;
        data["isRequired"] = this.isRequired;
        data["isKey"] = this.isKey;
        return data;
    }
}

export interface ISupplierServiceTemplateDto
{
    fieldNameTemplateSupplier : string | undefined,
    fieldNameTemplateBatchFile : string | undefined,
    fieldDataBatchFileId : number | undefined,
    isRequired : boolean | undefined,
    isKey :boolean | undefined
}

export class AgencyServiceTemplateReportDto implements IAgencyServiceTemplateReportDto
{
    fieldDataName: string;
    fieldDataBatchFileId: number;

    constructor(data?: ISupplierServiceTemplateDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
   
    init(_data?: any) {
        if (_data) {
            this.fieldDataName = _data["fieldDataName"];
            this.fieldDataBatchFileId = _data["fieldDataBatchFileId"];
        }
    }

    static fromJS(data: any): AgencyServiceTemplateReportDto {
        data = typeof data === 'object' ? data : {};
        let result = new AgencyServiceTemplateReportDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["fieldDataName"] = this.fieldDataName;
        data["fieldDataBatchFileId"] = this.fieldDataBatchFileId;
        return data;
    }
}

export interface IAgencyServiceTemplateReportDto
{
    fieldDataName : string | undefined,
    fieldDataBatchFileId : number | undefined,
}

export class EmailTemplate implements IEmailTemplate{
    id: number;
    emailTemplateName: string;

    constructor(data?: IEmailTemplate) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
   
    init(_data?: any) {
        if (_data) {
            this.id = _data["id"];
            this.emailTemplateName = _data["emailTemplateName"];
        }
    }

    static fromJS(data: any): EmailTemplate {
        data = typeof data === 'object' ? data : {};
        let result = new EmailTemplate();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["emailTemplateName"] = this.emailTemplateName;
        return data;
    }
}

export interface IEmailTemplate
{
    id: number | undefined,
    emailTemplateName: string | undefined
}
