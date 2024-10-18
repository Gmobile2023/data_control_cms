import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { ApiException, throwException, blobToText } from './service-proxies';

import { DateTime, Duration } from "luxon";
import { AppConsts } from '@shared/AppConsts';
import { GuidGeneratorService } from '@shared/utils/guid-generator.service';

@Injectable()
export class FileService {
    private http: HttpClient;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;
    constructor(@Inject(HttpClient) http: HttpClient) {
        this.http = http;
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    downloadFileFtp(body: DownloandFileFtpParam | undefined): Observable<Blob> {
        //let url_ = this.baseUrl + "/api/services/app/Suplier/CreateSupplier";
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Service/DownloadFileReportRevenueControl";
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
            return this.processDownloadFileFtp(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDownloadFileFtp(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<Blob>;
                }
            } else
                return _observableThrow(response_) as any as Observable<Blob>;
        }));
    }

    protected processDownloadFileFtp(response: HttpResponseBase): Observable<Blob> {
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

export class DownloandFileFtpParam implements IDownloandFileFtpParam {

    serviceId: number;
    pathFile: string;
    typeService: number;

    constructor(data?: IDownloandFileFtpParam) {
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
            this.pathFile = _data["pathFile"];
            this.typeService = _data["typeService"];
        }
    }

    static fromJS(data: any): DownloandFileFtpParam {
        data = typeof data === 'object' ? data : {};
        let result = new DownloandFileFtpParam();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["serviceId"] = this.serviceId;
        data["pathFile"] = this.pathFile;
        data["typeService"] = this.typeService;
        return data;
    }
}

export interface IDownloandFileFtpParam {
    serviceId: number,
    pathFile: string,
    typeService: number,
}

