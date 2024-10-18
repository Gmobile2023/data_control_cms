import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { ApiException, throwException, blobToText } from './service-proxies';
import { environment } from 'environments/environment';

import { DateTime, Duration } from "luxon";
import { AppConsts } from '@shared/AppConsts';
import { GuidGeneratorService } from '@shared/utils/guid-generator.service';

@Injectable()
export class ReportRevenueService {
    private http: HttpClient;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;
    constructor(@Inject(HttpClient) http: HttpClient) {
        this.http = http;
    }

    getList(body: ReportRevenueDoneReconcileSearch | undefined): Observable<PagedResultReportRevenue> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/ReportRevenueDoneReconcil/Search";
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
            return this.processGetList(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetList(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<PagedResultReportRevenue>;
                }
            } else
                return _observableThrow(response_) as any as Observable<PagedResultReportRevenue>;
        }));
    }

    protected processGetList(response: HttpResponseBase): Observable<PagedResultReportRevenue> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = PagedResultReportRevenue.fromJS(resultData200);
                return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf(null as any);
    }
   
}

export class PagedResultReportRevenue implements IPagedResultReportRevenue {
    totalCount!: number;
    items!: ReportRevenueDoneReconcileDto[] | undefined;

    constructor(data?: IPagedResultReportRevenue) {
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
                    this.items!.push(ReportRevenueDoneReconcileDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultReportRevenue {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultReportRevenue();
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

export interface IPagedResultReportRevenue {
    totalCount: number;
    items: ReportRevenueDoneReconcileDto[] | undefined;
}

export class ReportRevenueDoneReconcileDto implements IReportRevenueDoneReconcileDto {

    creationTime: Date;
    id: number;
    reconcileCode: string;
    serviceCode: string;
    serviceName: string;
    status: string;
    linkReportStatisticalPackOfData: string;
    linkReportRevenueControl: string;
    linkReportDTTD: string;
    timeFrom: Date;
    timeTo: Date;
    serviceId: number;

    constructor(data?: IReportRevenueDoneReconcileDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
    message: string;
    
    init(_data?: any) {
        if (_data) {
            this.id = _data["id"];
            this.creationTime = _data["creationTime"];
            this.reconcileCode = _data["reconcileCode"];
            this.serviceCode = _data["serviceCode"];
            this.serviceName = _data["serviceName"];
            this.status = _data["status"];
            this.linkReportStatisticalPackOfData = _data["linkReportStatisticalPackOfData"];
            this.linkReportRevenueControl = _data["linkReportRevenueControl"];
            this.linkReportDTTD = _data["linkReportDTTD"];
            this.timeFrom = _data["timeFrom"];
            this.timeTo = _data["timeTo"];
            this.message = _data["message"];
            this.serviceId = _data["serviceId"];
        }
    }

    static fromJS(data: any): ReportRevenueDoneReconcileDto {
        data = typeof data === 'object' ? data : {};
        let result = new ReportRevenueDoneReconcileDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["creationTime"] = this.creationTime;
        data["reconcileCode"] = this.reconcileCode;
        data["serviceCode"] = this.serviceCode;
        data["serviceName"] = this.serviceName;
        data["status"] = this.status;
        data["linkReportStatisticalPackOfData"] = this.linkReportStatisticalPackOfData;
        data["linkReportRevenueControl"] = this.linkReportRevenueControl;
        data["linkReportDTTD"] = this.linkReportDTTD;
        data["timeFrom"] = this.timeFrom;
        data["timeTo"] = this.timeTo;
        data["serviceId"] = this.serviceId;
        return data;
    }
}

export interface IReportRevenueDoneReconcileDto {
    creationTime: Date | undefined;
    id: number | undefined;
    reconcileCode: string | undefined;
    serviceCode: string | undefined;
    serviceName: string | undefined;
    status: string | undefined;
    linkReportStatisticalPackOfData: string | undefined;
    linkReportRevenueControl: string | undefined;
    linkReportDTTD: string | undefined;
    timeFrom: Date | undefined;
    timeTo: Date | undefined;
    message: string;
    serviceId : number
}

export class ReportRevenueDoneReconcileSearch implements IReportRevenueDoneReconcileSearch {

    Filter: string;
    TimeFrom: Date;
    TimeTo: Date;
    SkipCount: number;
    MaxResultCount: number;

    constructor(data?: IReportRevenueDoneReconcileSearch) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
  
    init(_data?: any) {
        if (_data) {
            this.Filter = _data["Filter"];
            this.SkipCount = _data["SkipCount"];
            this.MaxResultCount = _data["MaxResultCount"];
            this.TimeFrom = _data["TimeFrom"];
            this.TimeTo = _data["TimeTo"];
        }
    }

    static fromJS(data: any): ReportRevenueDoneReconcileSearch {
        data = typeof data === 'object' ? data : {};
        let result = new ReportRevenueDoneReconcileSearch();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["Filter"] = this.Filter;
        data["SkipCount"] = this.SkipCount;
        data["MaxResultCount"] = this.MaxResultCount;
        data["TimeFrom"] = this.TimeFrom;
        data["TimeTo"] = this.TimeTo;
        return data;
    }
}

export interface IReportRevenueDoneReconcileSearch {
    Filter: string | undefined,
    SkipCount: number,
    MaxResultCount: number,
    TimeFrom: Date,
    TimeTo: Date,
}

