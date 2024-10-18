
import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { ApiException, throwException, blobToText } from './service-proxies';

import { DateTime, Duration } from "luxon";
import { environment } from 'environments/environment';
import { AppConsts } from '@shared/AppConsts';
import * as internal from 'stream';


export const API_BASE_URL = new InjectionToken<string>('https://localhost:44301');

@Injectable()
export class ManageService {

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
        // this.packOfData.timeValue = '1'
    }

    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;
    public packOfData: PackOfDataDto = new PackOfDataDto();
    public dataService: DataService = new DataService();
    public saving: boolean = false;
    public isSendReport: boolean;
    public CreateDataService(): Observable<any> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/RevenueControl/CreateOrUpdate";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(this.dataService);

        let options_: any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processCreateDataService(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateDataService(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<any>;
                }
            } else
                return _observableThrow(response_) as any as Observable<any>;
        }));
    }

    protected processCreateDataService(response: HttpResponseBase): Observable<any> {
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

    getReveneuControls(body: RevenueControlListSearch | undefined): Observable<PagedResultRevenueControlDto> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/RevenueControl/Search";
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
            return this.processGetReveneuControls(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetReveneuControls(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<PagedResultRevenueControlDto>;
                }
            } else
                return _observableThrow(response_) as any as Observable<PagedResultRevenueControlDto>;
        }));
    }

    protected processGetReveneuControls(response: HttpResponseBase): Observable<PagedResultRevenueControlDto> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = PagedResultRevenueControlDto.fromJS(resultData200);
                return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf(null as any);
    }

    // getRevenueControlDetail(id: number | undefined): Observable<DataService> {
    //     let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/RevenueControl/GetDetail?";
    //     if (id === null)
    //         throw new Error("The parameter 'id' cannot be null.");
    //     else if (id !== undefined)
    //         url_ += "Id=" + encodeURIComponent("" + id) + "&";
    //     url_ = url_.replace(/[?&]$/, "");

    //     let options_: any = {
    //         observe: "response",
    //         responseType: "blob",
    //         headers: new HttpHeaders({
    //             "Accept": "text/plain"
    //         })
    //     };

    //     return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
    //         return this.processgetRevenueControlDetail(response_);
    //     })).pipe(_observableCatch((response_: any) => {
    //         if (response_ instanceof HttpResponseBase) {
    //             try {
    //                 return this.processgetRevenueControlDetail(response_ as any);
    //             } catch (e) {
    //                 return _observableThrow(e) as any as Observable<DataService>;
    //             }
    //         } else
    //             return _observableThrow(response_) as any as Observable<DataService>;
    //     }));
    // }

    getRevenueControlDetail(): Observable<DataService> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/RevenueControl/GetDetail";

        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processgetRevenueControlDetail(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processgetRevenueControlDetail(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<DataService>;
                }
            } else
                return _observableThrow(response_) as any as Observable<DataService>;
        }));
    }

    protected processgetRevenueControlDetail(response: HttpResponseBase): Observable<DataService> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                if(resultData200?.responseStatus?.errorCode == "00") {
                    console.log()
                    const objDetail = resultData200?.results
                    this.dataService = DataService.fromJS(objDetail)
                    this.isSendReport = this.dataService.isUpload || this.dataService.isSendMail
                }
                return _observableOf(resultData200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }

        return _observableOf(null as any);
    }

    deleteRevenueControl(id: number | undefined): Observable<void> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/RevenueControl/Delete?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "Id=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
            })
        };

        return this.http.request("delete", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processDeleteRevenueControl(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDeleteRevenueControl(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processDeleteRevenueControl(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
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

    updateStatusRevenue(body: UpdateStatusRevenueControl | undefined): Observable<any> {
        //let url_ = this.baseUrl + "/api/services/app/Suplier/CreateSupplier";
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/RevenueControl/UpdateStatus";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_: any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processUpdateStatusRevenue(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processUpdateStatusRevenue(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<any>;
                }
            } else
                return _observableThrow(response_) as any as Observable<any>;
        }));
    }

    protected processUpdateStatusRevenue(response: HttpResponseBase): Observable<any> {
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

    downloadTemplatePOD(): Observable<Blob> {
        //let url_ = this.baseUrl + "/api/services/app/Suplier/CreateSupplier";
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/RevenueControl/DownloadTemplatePOD";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDownloadTemplaet(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDownloadTemplaet(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<Blob>;
                }
            } else
                return _observableThrow(response_) as any as Observable<Blob>;
        }));
    }

    downloadTemplateInternalNumber(): Observable<Blob> {
        //let url_ = this.baseUrl + "/api/services/app/Suplier/CreateSupplier";
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/RevenueControl/DownloadTemplateInternalNumber";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDownloadTemplaet(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDownloadTemplaet(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<Blob>;
                }
            } else
                return _observableThrow(response_) as any as Observable<Blob>;
        }));
    }

    protected processDownloadTemplaet(response: HttpResponseBase): Observable<Blob> {
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
}

//phần tổng hợp
export class DataService {
    id?: number;
    name: string;
    code: string;
    cycleReconcile: number = 1;
    hours?: Date = new Date();
    dayReconcile?: number;
    packDataSource: number;
    internalNetworkNumberSource: number;
    packOfDataDtos: PackOfDataDto[] = [];
    internalNetworkNumberDtos: InternalNetworkNumberDto[] = [];

    // Nguồn lấy dữ liệu BF1
    fileNameGetDataBF1: string;
    dayAdditionalBF1: number;
    sourceDataLinkBF1: string;
    sourceDataAccountBF1: string;
    sourceDataPasswordBF1: string;
    useDataFromFtpBF1: boolean = true;
    useDataFromEmailBF1: boolean;
    emailHostBF1: string;
    emailPortBF1: string;
    emailAccountBF1: string;
    emailPasswordBF1: string;
    subjectEmailIdentifiedBF1: string;
    //templateBF1: TemplateBf1Dto[] = [];

    // Nguồn lấy dữ liệu BF2
    fileNameGetDataBF2: string;
    dayAdditionalBF2: number;
    sourceDataLinkBF2: string;
    sourceDataAccountBF2: string;
    sourceDataPasswordBF2: string;
    useDataFromFtpBF2: boolean = true;
    useDataFromEmailBF2: boolean;
    emailHostBF2: string;
    emailPortBF2: string;
    emailAccountBF2: string;
    emailPasswordBF2: string;
    subjectEmailIdentifiedBF2: string;
    //templateBF2: TemplateBf2Dto[] = [];

    // Cấu hình báo cáo sau đối soát
    isSendMail: boolean;
    toEmail: string;
    emailTemplateId: number;
    isUpload: boolean;
    linkUpload: string;
    linkUploadAccount: string;
    linkUploadPassword: string;
    date = new Date()

    isStatisticalPackOfData : boolean;
    fileNameReportPOD: string;
    isRevenueControl: boolean;
    fileNameRevenueControl: string;
    active: boolean;
    //reportRevenueControlDtos: ReportRevenueControlDto[] = [];
    ftpLinkInternal: string;
    ftpAccountInternal: string;
    ftpPasswordInternal: string;

    constructor(data?: DataService) {
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
            this.fileNameGetDataBF1 = _data["fileNameGetDataBF1"];
            this.dayAdditionalBF1 = _data["dayAdditionalBF1"];
            this.sourceDataLinkBF1 = _data["sourceDataLinkBF1"];
            this.sourceDataAccountBF1 = _data["sourceDataAccountBF1"];
            this.sourceDataPasswordBF1 = _data["sourceDataPasswordBF1"];
            this.useDataFromEmailBF1 = _data["useDataFromEmailBF1"];
            this.useDataFromFtpBF1 = _data["useDataFromFtpBF1"];
            this.emailHostBF1 = _data["emailHostBF1"];
            this.emailPortBF1 = _data["emailPortBF1"];
            this.emailAccountBF1 = _data["emailAccountBF1"];
            this.emailPasswordBF1 = _data["emailPasswordBF1"];
            this.subjectEmailIdentifiedBF1 = _data["subjectEmailIdentifiedBF1"];
            this.name = _data["name"];
            this.code = _data["code"];
            this.cycleReconcile = _data["cycleReconcile"];
            if(_data["hours"])
            {
                var hours = _data["hours"].split(':')[0]
                var minute = _data["hours"].split(':')[1]
                this.hours = new Date(1,1,1,hours,minute);
            }
            else  this.hours = new Date();
           
            this.dayReconcile = _data["dayReconcile"];
            this.packDataSource = _data["packDataSource"];
            this.fileNameGetDataBF2 = _data["fileNameGetDataBF2"];
            this.dayAdditionalBF2 = _data["dayAdditionalBF2"];
            this.sourceDataLinkBF2 = _data["sourceDataLinkBF2"];
            this.sourceDataAccountBF2 = _data["sourceDataAccountBF2"];
            this.sourceDataPasswordBF2 = _data["sourceDataPasswordBF2"];
            this.useDataFromEmailBF2 = _data["useDataFromEmailBF2"];
            this.useDataFromFtpBF2 = _data["useDataFromFtpBF2"];
            this.emailHostBF2 = _data["emailHostBF2"];
            this.emailPortBF2 = _data["emailPortBF2"];
            this.emailAccountBF2 = _data["emailAccountBF2"];
            this.emailPasswordBF2 = _data["emailPasswordBF2"];
            this.subjectEmailIdentifiedBF2 = _data["subjectEmailIdentifiedBF2"];
            this.isSendMail = _data["isSendMail"];
            this.toEmail = _data["toEmail"];
            this.isUpload = _data["isUpload"];
            this.emailTemplateId = _data["emailTemplateId"];
            this.linkUpload = _data["linkUpload"];
            this.linkUploadPassword = _data["linkUploadPassword"];
            this.linkUploadAccount = _data["linkUploadAccount"];
            this.emailHostBF2 = _data["emailHostBF2"];

            this.isStatisticalPackOfData = _data["isStatisticalPackOfData"];
            this.fileNameReportPOD = _data["fileNameReportPOD"];
            this.isRevenueControl = _data["isRevenueControl"];
            this.fileNameRevenueControl = _data["fileNameRevenueControl"];
            this.active = _data["active"];
            this.ftpLinkInternal = _data["ftpLinkInternal"];
            this.ftpAccountInternal = _data["ftpAccountInternal"];
            this.ftpPasswordInternal = _data["ftpPasswordInternal"];

            if (Array.isArray(_data["packOfDataDtos"])) {
                this.packOfDataDtos = [] as any;
                for (let item of _data["packOfDataDtos"])
                    this.packOfDataDtos!.push(PackOfDataDto.fromJS(item));
            }

            if (Array.isArray(_data["internalNetworkNumberDtos"])) {
                this.internalNetworkNumberDtos = [] as any;
                for (let item of _data["internalNetworkNumberDtos"])
                    this.internalNetworkNumberDtos!.push(InternalNetworkNumberDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): DataService {
        data = typeof data === 'object' ? data : {};
        let result = new DataService();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["fileNameGetDataBF1"] = this.fileNameGetDataBF1;
        data["dayAdditionalBF1"] = this.dayAdditionalBF1;
        data["sourceDataLinkBF1"] = this.sourceDataLinkBF1;
        data["sourceDataAccountBF1"] = this.sourceDataAccountBF1;
        data["sourceDataPasswordBF1"] = this.sourceDataPasswordBF1;
        data["useDataFromEmailBF1"] = this.useDataFromEmailBF1;
        data["useDataFromFtpBF1"] = this.useDataFromFtpBF1;
        data["emailHostBF1"] = this.emailHostBF1;
        data["emailPortBF1"] = this.emailPortBF1;
        data["emailAccountBF1"] = this.emailAccountBF1;
        data["emailPasswordBF1"] = this.emailPasswordBF1;
        data["subjectEmailIdentifiedBF1"] = this.subjectEmailIdentifiedBF1;
        // data["reportRevenueControlDtos"] = this.reportRevenueControlDtos;

        data["name"] = this.name;
        data["code"] = this.code;
        data["cycleReconcile"] = this.cycleReconcile;
        data["hours"] = this.hours.getHours() + ":" + this.hours.getMinutes();
        data["dayReconcile"] = this.dayReconcile;
        data["packDataSource"] = this.packDataSource;

        data["fileNameGetDataBF2"] = this.fileNameGetDataBF2;
        data["dayAdditionalBF2"] = this.dayAdditionalBF2;
        data["sourceDataLinkBF2"] = this.sourceDataLinkBF2;
        data["sourceDataAccountBF2"] = this.sourceDataAccountBF2;
        data["sourceDataPasswordBF2"] = this.sourceDataPasswordBF2;
        data["useDataFromFtpBF2"] = this.useDataFromFtpBF2;

        data["useDataFromEmailBF2"] = this.useDataFromEmailBF2;
        data["emailHostBF2"] = this.emailHostBF2;
        data["emailPortBF2"] = this.emailPortBF2;
        data["emailAccountBF2"] = this.emailAccountBF2;
        data["emailPasswordBF2"] = this.emailPasswordBF2;
        data["subjectEmailIdentifiedBF2"] = this.subjectEmailIdentifiedBF2;

        data["isSendMail"] = this.isSendMail;
        data["toEmail"] = this.toEmail;
        data["emailTemplateId"] = this.emailTemplateId;
        data["isUpload"] = this.isUpload;
        data["linkUpload"] = this.linkUpload;
        data["linkUploadAccount"] = this.linkUploadAccount;
        data["linkUploadPassword"] = this.linkUploadPassword;
        
        data["isStatisticalPackOfData"] = this.isStatisticalPackOfData;
        data["fileNameReportPOD"] = this.fileNameReportPOD;
        data["isRevenueControl"] = this.isRevenueControl;
        data["fileNameRevenueControl"] = this.fileNameRevenueControl;
        data["active"] = this.active;
        data["ftpAccountInternal"] = this.ftpAccountInternal;
        data["ftpLinkInternal"] = this.ftpLinkInternal;
        data["ftpPasswordInternal"] = this.ftpPasswordInternal;

        if (Array.isArray(this.packOfDataDtos)) {
            data["packOfDataDtos"] = [];
            for (let item of this.packOfDataDtos)
                data["packOfDataDtos"].push(item.toJSON());
        }

        if (Array.isArray(this.internalNetworkNumberDtos)) {
            data["internalNetworkNumberDtos"] = [];
            for (let item of this.internalNetworkNumberDtos)
                data["internalNetworkNumberDtos"].push(item.toJSON());
        }

        return data;
    }
}

export class TemplateBf1Dto implements ITemplateBf1Dto {
    id: number;
    revenueControlId: number
    fieldData: string;
    fieldReconcile: boolean;
    isSubscriberNumber: boolean;
    isDateTransaction: boolean;

    constructor(data?: ITemplateBf1Dto) {
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
            this.revenueControlId = _data["revenueControlId"];
            this.fieldData = _data["fieldData"];
            this.fieldReconcile = _data["fieldReconcile"];
            this.isSubscriberNumber = _data["isSubscriberNumber"];
            this.isDateTransaction = _data["isDateTransaction"];
        }
    }

    static fromJS(data: any): TemplateBf1Dto {
        data = typeof data === 'object' ? data : {};
        let result = new TemplateBf1Dto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["revenueControlId"] = this.revenueControlId;
        data["fieldReconcile"] = this.fieldReconcile;
        data["isSubscriberNumber"] = this.isSubscriberNumber;
        data["isDateTransaction"] = this.isDateTransaction;
        return data;
    }
}

export class ITemplateBf1Dto {
    id: number | undefined;
    revenueControlId: number | undefined;
    fieldData: string | undefined;
    fieldReconcile: boolean | undefined;
    isSubscriberNumber: boolean | undefined;
    isDateTransaction: boolean | undefined;
}

export class TemplateBf2Dto implements ITemplateBf2Dto {
    id: number;
    revenueControlId: number
    fieldData: string;
    fieldReconcile: boolean;
    isSubscriberNumber: boolean;
    isDateTransaction: boolean;

    constructor(data?: ITemplateBf1Dto) {
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
            this.revenueControlId = _data["revenueControlId"];
            this.fieldData = _data["fieldData"];
            this.fieldReconcile = _data["fieldReconcile"];
            this.isSubscriberNumber = _data["isSubscriberNumber"];
            this.isDateTransaction = _data["isDateTransaction"];
        }
    }

    static fromJS(data: any): TemplateBf2Dto {
        data = typeof data === 'object' ? data : {};
        let result = new TemplateBf2Dto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["revenueControlId"] = this.revenueControlId;
        data["fieldReconcile"] = this.fieldReconcile;
        data["isSubscriberNumber"] = this.isSubscriberNumber;
        data["isDateTransaction"] = this.isDateTransaction;
        return data;
    }
}

export class ITemplateBf2Dto {
    id: number | undefined;
    revenueControlId: number | undefined;
    fieldData: string | undefined;
    fieldReconcile: boolean | undefined;
    isSubscriberNumber: boolean | undefined;
    isDateTransaction: boolean | undefined;
}

export class TemplateReportRevenueControlDto implements ITemplateReportRevenueControlDto {
    id: number;
    mainColumn: string
    dataType: number;
    function: number;
    fieldDataCorresponding: string;
    functionCompare: number;
    fieldDataCompare: string;
    extraColumn: string;

    constructor(data?: ITemplateBf1Dto) {
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
            this.mainColumn = _data["mainColumn"];
            this.dataType = _data["dataType"];
            this.function = _data["function"];
            this.fieldDataCorresponding = _data["fieldDataCorresponding"];
            this.functionCompare = _data["functionCompare"];
            this.fieldDataCompare = _data["fieldDataCompare"];
            this.extraColumn = _data["extraColumn"];
        }
    }

    static fromJS(data: any): TemplateReportRevenueControlDto {
        data = typeof data === 'object' ? data : {};
        let result = new TemplateReportRevenueControlDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["mainColumn"] = this.mainColumn;
        data["dataType"] = this.dataType;
        data["function"] = this.function;
        data["fieldDataCorresponding"] = this.fieldDataCorresponding;
        data["functionCompare"] = this.functionCompare;
        data["fieldDataCompare"] = this.fieldDataCompare;
        data["extraColumn"] = this.extraColumn;
        return data;
    }
}

export class ITemplateReportRevenueControlDto {
    id: number | undefined;
    mainColumn: string | undefined;
    dataType: number | undefined;
    function: number | undefined;
    fieldDataCorresponding: string | undefined;
    functionCompare: number | undefined;
    fieldDataCompare: string | undefined;
    extraColumn: string | undefined;
}

export class PackOfDataDto implements IPackOfDataDto {
    id: number;
    name: string;
    code: string;
    price: number;
    cyclePackage: number;
    cycleValue: number;
    flowData: number;
    flowCallInternal: number;
    flowCallOutside: number;
    flowSmsInternal: number;
    flowSmsOutside: number;
    vas: number;
    other: string;
    priceSmsInternal: number;
    priceSmsOutside: number;
    priceCallInternal: number;
    priceCallOutside: number;
    priceData: number;
    template: string;
    datas: string
    active: boolean;
    isBasic: boolean;

    constructor(data?: IPackOfDataDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.template = _data["template"];
            this.id = _data["id"];
            this.datas = _data["datas"];
            this.name = _data["name"];
            this.code = _data["code"];
            this.price = _data["price"];
            this.cyclePackage = _data["cyclePackage"];
            this.cycleValue = _data["cycleValue"];
            this.flowData = _data["flowData"];
            this.flowCallInternal = _data["flowCallInternal"];
            this.flowCallOutside = _data["flowCallOutside"];
            this.flowSmsInternal = _data["flowSmsInternal"];
            this.flowSmsOutside = _data["flowSmsOutside"];
            this.vas = _data["vas"];
            this.other = _data["other"];
            this.priceSmsInternal = _data["priceSmsInternal"];
            this.priceSmsOutside = _data["priceSmsOutside"];
            this.priceCallInternal = _data["priceCallInternal"];
            this.priceCallOutside = _data["priceCallOutside"];
            this.priceData = _data["priceData"];
            this.isBasic = _data["isBasic"];
            this.active = _data["active"];
        }
    }

    static fromJS(data: any): PackOfDataDto {
        data = typeof data === 'object' ? data : {};
        let result = new PackOfDataDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["template"] = this.template;
        data["datas"] = this.datas;
        data["name"] = this.name;
        data["code"] = this.code;
        data["id"] = this.id;
        data["price"] = this.price;
        data["cyclePackage"] = this.cyclePackage;

        data["cycleValue"] = this.cycleValue;
        data["flowData"] = this.flowData;
        data["flowCallInternal"] = this.flowCallInternal;
        data["flowCallOutside"] = this.flowCallOutside;
        data["flowSmsInternal"] = this.flowSmsInternal;
        data["flowSmsOutside"] = this.flowSmsOutside;

        data["vas"] = this.vas;
        data["priceSmsInternal"] = this.priceSmsInternal;
        data["other"] = this.other;
        data["priceSmsOutside"] = this.priceSmsOutside;
        data["priceCallInternal"] = this.priceCallInternal;
        data["priceCallOutside"] = this.priceCallOutside;
        data["priceData"] = this.priceData;
        data["isBasic"] = this.isBasic;
        data["active"] = this.active;
        return data;
    }
}

export class IPackOfDataDto {
    template: string | undefined;
    datas: string | undefined;
    name: string | undefined;
    code: string | undefined;
    price: number | undefined;
    cyclePackage: number | undefined;
    cycleValue: number | undefined;
    flowData: number | undefined;
    flowCallInternal: number | undefined;
    flowCallOutside: number | undefined;
    flowSmsInternal: number | undefined;
    flowSmsOutside: number | undefined;
    vas: number | undefined;
    other: string | undefined;
    priceSmsInternal: number | undefined;
    priceSmsOutside: number | undefined;
    priceCallInternal: number | undefined;
    priceCallOutside: number | undefined;
    priceData: number | undefined;
    active: boolean | undefined;
    isBasic : boolean | undefined;
}

export class InternalNetworkNumberDto implements IInternalNetworkNumberDto {
    numberPrefix: string;
    providerName: string;
    providerCode: string;
    active: boolean;
    template: string;
    datas: string

    constructor(data?: IInternalNetworkNumberDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.template = _data["template"];
            this.datas = _data["datas"];
            this.numberPrefix = _data["numberPrefix"];
            this.providerCode = _data["providerCode"];
            this.providerName = _data["providerName"];
            this.active = _data["active"];
        }
    }

    static fromJS(data: any): InternalNetworkNumberDto {
        data = typeof data === 'object' ? data : {};
        let result = new InternalNetworkNumberDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["template"] = this.template;
        data["datas"] = this.datas;
        data["numberPrefix"] = this.numberPrefix;
        data["providerCode"] = this.providerCode;
        data["providerName"] = this.providerName;
        data["active"] = this.active;
        return data;
    }
}

export class IInternalNetworkNumberDto {
    numberPrefix: string | undefined;
    providerName: string | undefined;
    providerCode: string | undefined;
    active: boolean | undefined;
    template: string | undefined;
    datas: string | undefined;
}

export class ReportRevenueControlDto implements IReportRevenueControlDto {
    reportName: string;
    fileNameExport: string;
    revenueControlId: number;
    dataFieldReferenceBF1: string;
    dataFieldReferenceBF2: string;
    templateReportRevenueControlDtos: TemplateReportRevenueControlDto[];

    constructor(data?: IReportRevenueControlDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.reportName = _data["reportName"];
            this.fileNameExport = _data["fileNameExport"];
            this.revenueControlId = _data["revenueControlId"];
            this.dataFieldReferenceBF1 = _data["dataFieldReferenceBF1"];
            this.dataFieldReferenceBF2 = _data["dataFieldReferenceBF2"];
            if (Array.isArray(_data["supplierServiceListItems"])) {
                this.templateReportRevenueControlDtos = [] as any;
                for (let item of _data["templateReportRevenueControlDtos"])
                    this.templateReportRevenueControlDtos!.push(TemplateReportRevenueControlDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): ReportRevenueControlDto {
        data = typeof data === 'object' ? data : {};
        let result = new ReportRevenueControlDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["reportName"] = this.reportName;
        data["fileNameExport"] = this.fileNameExport;
        data["revenueControlId"] = this.revenueControlId;
        data["dataFieldReferenceBF1"] = this.dataFieldReferenceBF1;
        data["dataFieldReferenceBF2"] = this.dataFieldReferenceBF2;

        if (Array.isArray(this.templateReportRevenueControlDtos)) {
            data["supplierServiceListItems"] = [];
            for (let item of this.templateReportRevenueControlDtos)
                data["supplierServiceListItems"].push(item.toJSON());
        }


        return data;
    }
}

export interface IReportRevenueControlDto {
    reportName: string | undefined;
    fileNameExport: string | undefined;
    revenueControlId: number | undefined;
    dataFieldReferenceBF1: string | undefined;
    dataFieldReferenceBF2: string | undefined;
    templateReportRevenueControlDtos: TemplateReportRevenueControlDto[] | undefined;
}

export class RevenueControlListItem implements IRevenueControlListItem {
   
    id: number;
    name: string;
    code: string;
    active: boolean;

    constructor(data?: IRevenueControlListItem) {
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
            this.name = _data["name"];
            this.code = _data["code"];
            this.active = _data["active"];
        }
    }

    static fromJS(data: any): RevenueControlListItem {
        data = typeof data === 'object' ? data : {};
        let result = new RevenueControlListItem();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["code"] = this.code;
        data["active"] = this.active;
       
        return data;
    }
}

export interface IRevenueControlListItem
{
    id: number,
    name: string,
    code : string,
    active : boolean
}

export class PagedResultRevenueControlDto implements IPagedResultRevenueControlDto {
    totalCount!: number;
    items!: RevenueControlListItem[] | undefined;

    constructor(data?: IPagedResultRevenueControlDto) {
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
                    this.items!.push(RevenueControlListItem.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultRevenueControlDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultRevenueControlDto();
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

export interface IPagedResultRevenueControlDto {
    totalCount: number;
    items: RevenueControlListItem[] | undefined;
}

export class RevenueControlListSearch implements IRevenueControlListSearch {

    Filter: string;
    SkipCount: number;
    MaxResultCount: number;

    constructor(data?: IRevenueControlListSearch) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.Filter = _data["Filter"]
            this.SkipCount = _data["SkipCount"];
            this.MaxResultCount = _data["MaxResultCount"];
        }
    }

    static fromJS(data: any): RevenueControlListSearch {
        data = typeof data === 'object' ? data : {};
        let result = new RevenueControlListSearch();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["Filter"] = this.Filter;
        data["SkipCount"] = this.SkipCount;
        data["MaxResultCount"] = this.MaxResultCount;
        return data;
    }
}

export interface IRevenueControlListSearch {
    Filter: string;
    SkipCount: number;
    MaxResultCount: number;
}

export class UpdateStatusRevenueControl implements IUpdateStatusRevenueControl {

    id: number;
    active: boolean;

    constructor(data?: IUpdateStatusRevenueControl) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.id = _data["id"]
            this.active = _data["active"];
        }
    }

    static fromJS(data: any): UpdateStatusRevenueControl {
        data = typeof data === 'object' ? data : {};
        let result = new UpdateStatusRevenueControl();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["active"] = this.active;
        return data;
    }
}

export interface IUpdateStatusRevenueControl
{
    id: number,
    active: boolean
}










