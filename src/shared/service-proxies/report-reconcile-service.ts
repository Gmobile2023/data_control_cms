import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { ApiException, throwException, blobToText } from './service-proxies';
import { environment } from 'environments/environment';

import { DateTime, Duration } from "luxon";
import { AppConsts } from '@shared/AppConsts';

@Injectable()
export class ReportReconcileService {
    private http: HttpClient;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;
    constructor(@Inject(HttpClient) http: HttpClient) {
        this.http = http;
    }

    /**
 * @param body (optional) 
 * @return Success
 */
    getReportReconcil(body: ListSearchParam | undefined): Observable<PagedResultDtoOfSupplierListDto> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/ReportReconcileSupplier/Search";
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
            return this.processGetReportReconcile(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetReportReconcile(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<PagedResultDtoOfSupplierListDto>;
                }
            } else
                return _observableThrow(response_) as any as Observable<PagedResultDtoOfSupplierListDto>;
        }));
    }

    protected processGetReportReconcile(response: HttpResponseBase): Observable<PagedResultDtoOfSupplierListDto> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = PagedResultDtoOfSupplierListDto.fromJS(resultData200);
                return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf(null as any);
    }

    getSupplierGetAll(supplierName: string | undefined): Observable<ReportReconcileSupplierListItem[]> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Supplier/GetListAll?";
        if (supplierName)
            url_ += "SupplierName=" + encodeURIComponent("" + supplierName) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processgetSupplierGetAll(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processgetSupplierGetAll(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<ReportReconcileSupplierListItem[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<ReportReconcileSupplierListItem[]>;
        }));
    }

    protected processgetSupplierGetAll(response: HttpResponseBase): Observable<ReportReconcileSupplierListItem[]> {
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

    getReportReconcileDetail(id: number | undefined): Observable<ReportReconcileSupplierDetailDto[]> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/ReportReconcileSupplier/GetDetail?";
        if (id)
            url_ += "ReportId=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processgetReportReconcileDetail(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processgetReportReconcileDetail(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<ReportReconcileSupplierDetailDto[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<ReportReconcileSupplierDetailDto[]>;
        }));
    }

    protected processgetReportReconcileDetail(response: HttpResponseBase): Observable<ReportReconcileSupplierDetailDto[]> {
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

    matchingData(param :MatchingDataDto): Observable<void>
    {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/ReportReconcileSupplier/MatchingData";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(param);

        let options_: any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processMatchingData(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processMatchingData(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processMatchingData(response: HttpResponseBase): Observable<void> {
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

    getLogsByReportId(id: number | undefined): Observable<MatchingLogsDto[]> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/ReportReconcileSupplier/GetLogsByReportId?";
        if (id)
            url_ += "reportId=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processGetLogsByReportId(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetLogsByReportId(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<MatchingLogsDto[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<MatchingLogsDto[]>;
        }));
    }

    protected processGetLogsByReportId(response: HttpResponseBase): Observable<MatchingLogsDto[]> {
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

    resendReport(id: number | undefined): Observable<MatchingLogsDto[]> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/ReportReconcileSupplier/ResendReport?";
        if (id)
            url_ += "ReportSupplierId=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processGetLogsByReportId(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetLogsByReportId(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<MatchingLogsDto[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<MatchingLogsDto[]>;
        }));
    }

    protected processResendReport(response: HttpResponseBase): Observable<MatchingLogsDto[]> {
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

    getListFileReportSupplier(): Observable<FileReportSupplierUpload[]> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/ReportReconcileSupplier/GetListFileReportSupplier";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processGetListFileReportSupplier(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetListFileReportSupplier(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<FileReportSupplierUpload[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<FileReportSupplierUpload[]>;
        }));
    }

    protected processGetListFileReportSupplier(response: HttpResponseBase): Observable<FileReportSupplierUpload[]> {
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

    getListFileInternal(): Observable<string[]> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/ReportReconcileSupplier/GetListFileInternal";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processGetListFileInternal(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetListFileInternal(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<string[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<string[]>;
        }));
    }

    protected processGetListFileInternal(response: HttpResponseBase): Observable<string[]> {
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

    getListFileReportAgency(): Observable<string[]> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/ReportReconcileSupplier/GetListFileReportAgency";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processGetListFileReportAgency(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetListFileReportAgency(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<string[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<string[]>;
        }));
    }

    protected processGetListFileReportAgency(response: HttpResponseBase): Observable<string[]> {
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

    tickingData(param :TickingDataDto): Observable<void>
    {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/ReportReconcileSupplier/TickingData";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(param);

        let options_: any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processMatchingData(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processTickingData(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processTickingData(response: HttpResponseBase): Observable<void> {
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

    reReconcile(id: number | undefined): Observable<void> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/ReportReconcileSupplier/ReReconcile?";
        if (id)
            url_ += "ReportReconcileSupplierId=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processgetReReconcile(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processgetReReconcile(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processgetReReconcile(response: HttpResponseBase): Observable<void> {
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

export class PagedResultDtoOfSupplierListDto implements IPagedResultDtoOfSupplierListDto {
    totalCount!: number;
    items!: ReportReconcileSupplierListItem[] | undefined;

    constructor(data?: IPagedResultDtoOfSupplierListDto) {
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
                    this.items!.push(ReportReconcileSupplierListItem.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfSupplierListDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultDtoOfSupplierListDto();
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

export interface IPagedResultDtoOfSupplierListDto {
    totalCount: number;
    items: ReportReconcileSupplierListItem[] | undefined;
}

export class ReportReconcileSupplierListItem implements IReportReconcileSupplierListItem {

    id: number;
    reconcilCode: string;
    creationTime: DateTime;
    serviceName: string;
    serviceTypeName: string;
    supplierName: string;
    totalRecord: number;
    totalRecordFail: number;
    result: string;
    message: string;
    isReReconcile: boolean;

    constructor(data?: IReportReconcileSupplierListItem) {
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
            this.reconcilCode = _data["reconcilCode"];
            this.creationTime = _data["creationTime"];
            this.serviceName = _data["serviceName"];
            this.serviceTypeName = _data["serviceTypeName"];
            this.supplierName = _data["supplierName"];
            this.totalRecord = _data["totalRecord"];
            this.totalRecordFail = _data["totalRecordFail"];
            this.result = _data["result"];
            this.message = _data["message"];
            this.isReReconcile = _data["isReReconcile"];
        }
    }

    static fromJS(data: any): ReportReconcileSupplierListItem {
        data = typeof data === 'object' ? data : {};
        let result = new ReportReconcileSupplierListItem();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["reconcilCode"] = this.reconcilCode;
        data["creationTime"] = this.creationTime;
        data["serviceName"] = this.serviceName;
        data["serviceTypeName"] = this.serviceTypeName;
        data["supplierName"] = this.supplierName;
        data["totalRecord"] = this.totalRecord;
        data["totalRecordFail"] = this.totalRecordFail;
        data["result"] = this.result;
        data["message"] = this.message;
        data["isReReconcile"] = this.isReReconcile;
        return data;
    }
}

export interface IReportReconcileSupplierListItem {
    id: number | undefined
    reconcilCode: string | undefined;
    creationTime: DateTime | undefined;
    serviceName: string | undefined;
    serviceTypeName: string | undefined;
    supplierName: string | undefined;
    totalRecord: number | undefined;
    totalRecordFail: number | undefined;
    result: string | undefined;
    message : string | undefined;
    isReReconcile: boolean | undefined;
}

export class ListSearchParam implements IListSearchParam {

    ReconcileCode: string;
    ServiceName: string;
    CreationTimeFrom: DateTime;
    CreationTimeTo: DateTime;
    SupplierId: number;
    Status: string;
    SkipCount: number;
    MaxResultCount: number;

    constructor(data?: IListSearchParam) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }


    init(_data?: any) {
        if (_data) {
            this.ReconcileCode = _data["ReconcileCode"];
            this.ServiceName = _data["ServiceName"];
            this.CreationTimeFrom = _data["CreationTimeFrom"];
            this.CreationTimeTo = _data["CreationTimeTo"];
            this.SupplierId = _data["SupplierId"];
            this.Status = _data["Status"];
            this.SkipCount = _data["SkipCount"];
            this.MaxResultCount = _data["MaxResultCount"];
        }
    }

    static fromJS(data: any): ListSearchParam {
        data = typeof data === 'object' ? data : {};
        let result = new ListSearchParam();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["ReconcileCode"] = this.ReconcileCode;
        data["ServiceName"] = this.ServiceName;
        data["CreationTimeFrom"] = this.CreationTimeFrom;
        data["CreationTimeTo"] = this.CreationTimeTo;
        data["SupplierId"] = this.SupplierId;
        data["Status"] = this.Status;
        data["SkipCount"] = this.SkipCount;
        data["MaxResultCount"] = this.MaxResultCount;
        return data;
    }
}

export interface IListSearchParam {
    ReconcileCode: string | undefined,
    ServiceName: string | undefined,
    CreationTimeFrom: DateTime | undefined,
    CreationTimeTo: DateTime | undefined,
    SupplierId: number | undefined,
    Status: string | undefined,
    SkipCount: number,
    MaxResultCount: number,
}

export class ReportReconcileSupplierDetailDto implements IReportReconcileSupplierDetailDto {

    template: any[];
    supplierName: string;
    creationTimeReport: Date;
    reconcileCode: string;
    serviceName: string;
    result: string;
    listData: ReportReconcileDetailRow[] = [];
    reportId: number;

    constructor(data?: any) {
        if (data) {
            this.template = data.template || [];
            this.supplierName = data.supplierName || '';
            this.creationTimeReport = data.creationTimeReport || new Date();
            this.reconcileCode = data.reconcileCode || '';
            this.serviceName = data.serviceName || '';
            this.result = data.result || '';
            this.listData = data.listData || [];
            this.reportId = data.reportId || 0;
        }
    }

    static fromJS(data: any): ReportReconcileSupplierDetailDto {
        const dto = new ReportReconcileSupplierDetailDto();
        dto.template = data.template || [];
        dto.supplierName = data.supplierName || '';
        dto.creationTimeReport = data.creationTimeReport || new Date();
        dto.reconcileCode = data.reconcileCode || '';
        dto.serviceName = data.serviceName || '';
        dto.result = data.result || '';
        dto.listData = data.listData || [];
        dto.reportId = data.reportId || 0;
        return dto;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data.template = this.template;
        data.supplierName = this.supplierName;
        data.creationTimeReport = this.creationTimeReport;
        data.reconcileCode = this.reconcileCode;
        data.serviceName = this.serviceName;
        data.result = this.result;
        data.listData = this.listData;
        data.reportId = this.reportId;
        return data;
    }
}

export interface IReportReconcileSupplierDetailDto {
    template: any[];
    supplierName: string;
    creationTimeReport: Date;
    reconcileCode: string;
    serviceName: string;
    result: string;
    listData: ReportReconcileDetailRow[];
    reportId: number;
}

export class ReportReconcileDetailRow implements IReportReconcileDetailRow {
    id: number;
    recordInternal: { [key: string]: any; }[];
    recordSupplier: { [key: string]: any; }[];
    columnFail: { [key: string]: any; }[];

    constructor(data?: any) {
        if (data) {
            this.id = data.id || [];
            this.recordInternal = data.recordInternal || [];
            this.recordSupplier = data.recordSupplier || [];
            this.columnFail = data.columnFail || [];
        }
    }

    static fromJS(data: any): ReportReconcileDetailRow {
        const dto = new ReportReconcileDetailRow();
        dto.id = data.id;
        dto.recordInternal = data.recordInternal || [];
        dto.recordSupplier = data.recordSupplier || [];
        dto.columnFail = data.columnFail || [];
        return dto;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data.id = this.id;
        data.recordInternal = this.recordInternal;
        data.recordSupplier = this.recordSupplier;
        data.columnFail = this.columnFail;
        return data;
    }
}

export interface IReportReconcileDetailRow {
    id: number;
    recordInternal: { [key: string]: any }[];
    recordSupplier: { [key: string]: any }[];
    columnFail: { [key: string]: any }[];
}

export class MatchingDataDto implements IMatchingDataDto
{
    idInternal: number;
    idSupplier: number;
    matchingType: number;
    noteMathData: string
    
    constructor(data?: IListSearchParam) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.idInternal = _data["idInternal"];
            this.idSupplier = _data["idSupplier"];
            this.matchingType = _data["matchingType"];
            this.noteMathData = _data["noteMathData"];
        }
    }

    static fromJS(data: any): MatchingDataDto {
        data = typeof data === 'object' ? data : {};
        let result = new MatchingDataDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["idInternal"] = this.idInternal;
        data["idSupplier"] = this.idSupplier;
        data["matchingType"] = this.matchingType;
        data["noteMathData"] = this.noteMathData;
        return data;
    }
}

export interface IMatchingDataDto
{
    idInternal: number,
    idSupplier: number,
    matchingType : number,
    noteMathData: string
}

export class MatchingLogsDto implements IMatchingLogsDto
{
    id: number;
    reportReconcileSupplierId: number;
    recordInternal: string;
    recordSupplier: string;
    matchingStatus: number;
    creationTime: DateTime;
    
    constructor(data?: IListSearchParam) {
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
            this.reportReconcileSupplierId = _data["reportReconcileSupplierId"];
            this.recordInternal = _data["recordInternal"];
            this.recordSupplier = _data["recordSupplier"];
            this.matchingStatus = _data["matchingStatus"];
            this.creationTime = _data["creationTime"];
        }
    }

    static fromJS(data: any): MatchingLogsDto {
        data = typeof data === 'object' ? data : {};
        let result = new MatchingLogsDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["reportReconcileSupplierId"] = this.reportReconcileSupplierId;
        data["recordInternal"] = this.recordInternal;
        data["recordSupplier"] = this.recordSupplier;
        data["matchingStatus"] = this.matchingStatus;
        data["creationTime"] = this.creationTime;
        return data;
    }
}

export interface IMatchingLogsDto
{
    id: number,
    reportReconcileSupplierId : number,
    recordInternal: string,
    recordSupplier: string,
    matchingStatus: number,
    creationTime: DateTime
}

export class TickingDataDto implements ITickingDataDto
{
    listId: number[] = [];
    noteMathData: string
    constructor(data?: any) {
        if (data) {
            this.listId = data.listId || [];
        }
    }

    static fromJS(data: any): TickingDataDto {
        const dto = new TickingDataDto();
        dto.listId = data.listId || [];
        dto.noteMathData = data["noteMathData"]
        return dto;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data.listId = this.listId;
        data.noteMathData = this.noteMathData
        return data;
    }
}

export interface ITickingDataDto
{
    listId : number[]
    noteMathData: string
}

export class FileReportItem implements IFileReportItem
{
    fileName: string;
    createTime: Date;
    serviceId: number;

    constructor(data?: IFileReportItem) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {     
            this.fileName = _data["fileName"];
            this.createTime = _data["createTime"];
            this.serviceId = _data["serviceId"];
        }
    }

    static fromJS(data: any): FileReportItem {
        data = typeof data === 'object' ? data : {};
        let result = new FileReportItem();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["fileName"] = this.fileName;
        data["createTime"] = this.createTime;
        
        return data;
    }
}

export interface IFileReportItem
{
    fileName: string | undefined,
    createTime : Date | undefined,
    serviceId: number
}

export class FileReportSyntheticUpload implements IFileReportSyntheticUpload{
    serviceId: number;
    serviceName: string;
    listFile: FileReportItem[];
    constructor(data?: IFileReportSupplierUpload) {
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
            this.serviceName = _data["serviceName"];
            if (Array.isArray(_data["listFile"])) {
                this.listFile = [] as any;
                for (let item of _data["listFile"])
                    this.listFile!.push(FileReportItem.fromJS(item));
            }
        }
    }

    static fromJS(data: any): FileReportSyntheticUpload {
        data = typeof data === 'object' ? data : {};
        let result = new FileReportSyntheticUpload();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["serviceId"] = this.serviceId;
        data["serviceName"] = this.serviceName;
        if (Array.isArray(this.listFile)) {
            data["listFile"] = [];
            for (let item of this.listFile)
                data["listFile"].push(item.toJSON());
        }
        return data;
    }

}

export class FileReportSupplierUpload implements IFileReportSupplierUpload {
    supplierId: number;
    supplierName: string;
    listFile: FileReportItem[];

    constructor(data?: IFileReportSupplierUpload) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
    
    init(_data?: any) {
        if (_data) {
            this.supplierId = _data["supplierId"];
            this.supplierName = _data["supplierName"];
            if (Array.isArray(_data["listFile"])) {
                this.listFile = [] as any;
                for (let item of _data["listFile"])
                    this.listFile!.push(FileReportItem.fromJS(item));
            }
        }
    }

    static fromJS(data: any): FileReportSupplierUpload {
        data = typeof data === 'object' ? data : {};
        let result = new FileReportSupplierUpload();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["supplierId"] = this.supplierId;
        data["supplierName"] = this.supplierName;
        if (Array.isArray(this.listFile)) {
            data["listFile"] = [];
            for (let item of this.listFile)
                data["listFile"].push(item.toJSON());
        }
        return data;
    }
}

export interface IFileReportSupplierUpload {
    supplierId: number;
    supplierName: string;
    listFile: FileReportItem[] | undefined;
}

export class FileReportAgencyUpload implements IFileReportAgencyUpload {
    agencyId: number;
    agencyName: string;
    listFile: FileReportItem[];

    constructor(data?: IFileReportAgencyUpload) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
    
    init(_data?: any) {
        if (_data) {
            this.agencyId = _data["agencyId"];
            this.agencyName = _data["agencyName"];
            if (Array.isArray(_data["listFile"])) {
                this.listFile = [] as any;
                for (let item of _data["listFile"])
                    this.listFile!.push(FileReportItem.fromJS(item));
            }
        }
    }

    static fromJS(data: any): FileReportAgencyUpload {
        data = typeof data === 'object' ? data : {};
        let result = new FileReportAgencyUpload();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["agencyId"] = this.agencyId;
        data["agencyName"] = this.agencyName;
        if (Array.isArray(this.listFile)) {
            data["listFile"] = [];
            for (let item of this.listFile)
                data["listFile"].push(item.toJSON());
        }
        return data;
    }
}

export interface IFileReportAgencyUpload {
    agencyId: number;
    agencyName: string;
    listFile: FileReportItem[] | undefined;
}

export interface IFileReportSyntheticUpload{
    serviceName: string;
    serviceId: number;
    listFile: FileReportItem[] | undefined;
}

