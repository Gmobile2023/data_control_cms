import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { ApiException, throwException, blobToText } from './service-proxies';
import { environment } from 'environments/environment';

import { DateTime, Duration } from "luxon";
import { AppConsts } from '@shared/AppConsts';

export const API_BASE_URL = new InjectionToken<string>('https://localhost:44301');

@Injectable()
export class AgencyService {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    createAgency(body: CreateOrUpdateAgencyParam | undefined): Observable<any> {
        //let url_ = this.baseUrl + "/api/services/app/Suplier/CreateSupplier";
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Agency/CreateAgency";
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
            return this.processCreateOrUpdateAgency(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateOrUpdateAgency(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<any>;
                }
            } else
                return _observableThrow(response_) as any as Observable<any>;
        }));
    }

    protected processCreateOrUpdateAgency(response: HttpResponseBase): Observable<any> {
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

    /**
    * @param id (optional) 
    * @return Success
    */
    getAgencyForEdit(id: number | undefined): Observable<AgencyDto> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Agency/GetDetailById?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "AgencyId=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processGetAgencyForEdit(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAgencyForEdit(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<AgencyDto>;
                }
            } else
                return _observableThrow(response_) as any as Observable<AgencyDto>;
        }));
    }

    protected processGetAgencyForEdit(response: HttpResponseBase): Observable<AgencyDto> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);

                // if(resultData200.responseStatus && resultData200.responseStatus.errorCode == "01")
                //     return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                //         return throwException(resultData200.responseStatus.message, 0, "", null);
                //     }));    

                // result200 = SupplierDto.fromJS(resultData200.results);
                // return _observableOf(result200);
                return _observableOf(resultData200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }

        return _observableOf(null as any);
    }

    /**
 * @param body (optional) 
 * @return Success
 */
    getAgencies(body: GetListAgencyParam | undefined): Observable<PagedResultDtoOfAgencyListDto> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Agency/Search";
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
            return this.processGetAgencies(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAgencies(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<PagedResultDtoOfAgencyListDto>;
                }
            } else
                return _observableThrow(response_) as any as Observable<PagedResultDtoOfAgencyListDto>;
        }));
    }

    protected processGetAgencies(response: HttpResponseBase): Observable<PagedResultDtoOfAgencyListDto> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = PagedResultDtoOfAgencyListDto.fromJS(resultData200);
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
    * @param body (optional) 
    * @return Success
    */
    updateAgency(body: CreateOrUpdateAgencyParam | undefined, agencyId: number | undefined): Observable<void> {
        //let url_ = this.baseUrl + "/api/services/app/Suplier/CreateSupplier";
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Agency/UpdateAgency?";
        if (agencyId === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (agencyId !== undefined) {
            url_ += "AgencyId=" + encodeURIComponent(agencyId) + "&";
        }

        const content_ = JSON.stringify(body);

        let options_: any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
            })
        };

        return this.http.request("put", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processCreateOrUpdateAgency(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateOrUpdateAgency(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    deleteAgency(id: number | undefined): Observable<void> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Agency/DeleteAgency?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "AgencyId=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
            })
        };

        return this.http.request("delete", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDeleteAgency(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDeleteAgency(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processDeleteAgency(response: HttpResponseBase): Observable<void> {
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

    getAgencyGetAll(agencyName: string | undefined): Observable<AgencyItemList[]> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Agency/GetAll?";
        if (agencyName)
            url_ += "AgencyName=" + encodeURIComponent("" + agencyName) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processgetAgencyGetAll(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processgetAgencyGetAll(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<AgencyItemList[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<AgencyItemList[]>;
        }));
    }

    protected processgetAgencyGetAll(response: HttpResponseBase): Observable<AgencyItemList[]> {
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

export class CreateOrUpdateAgencyParam implements ICreateOrUpdateAgencyParam {

    agencyName: string;
    agencyCode: string;
    companyName: string;
    email: string;
    sFTPLink: string;
    description: string;
    sFTPLinkAccount: string;
    sFTPLinkPassword: string;

    constructor(data?: ICreateOrUpdateAgencyParam) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.companyName = _data["companyName"];
            this.agencyCode = _data["agencyCode"];
            this.agencyName = _data["agencyName"];
            this.email = _data["email"];
            this.sFTPLink = _data["sFTPLink"];
            this.description = _data["description"];
            this.sFTPLinkAccount = _data["sFTPLinkAccount"];
            this.sFTPLinkPassword = _data["sFTPLinkPassword"];
        }
    }

    static fromJS(data: any): CreateOrUpdateAgencyParam {
        data = typeof data === 'object' ? data : {};
        let result = new CreateOrUpdateAgencyParam();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["companyName"] = this.companyName;
        data["agencyName"] = this.agencyName;
        data["email"] = this.email;
        data["sFTPLink"] = this.sFTPLink;
        data["description"] = this.description;
        data["sFTPLinkAccount"] = this.sFTPLinkAccount;
        data["sFTPLinkPassword"] = this.sFTPLinkPassword;
        data["agencyCode"] = this.agencyCode;
        return data;
    }
}

export interface ICreateOrUpdateAgencyParam {
    agencyName: string | undefined;
    companyName: string | undefined;
    agencyCode: string | undefined;
    email: string | undefined;
    sFTPLink: string | undefined;
    description: string | undefined;
    sFTPLinkAccount: string | undefined;
    sFTPLinkPassword: string | undefined;
}

export class AgencyDto implements IAgencyDto {
    agencyId: number;
    agencyCode: string;
    agencyName: string;
    companyName: string;
    email: string;
    sFTPLink: string;
    description: string;
    sFTPLinkAccount: string;
    sFTPLinkPassword: string;

    constructor(data?: IAgencyDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.companyName = _data["companyName"];
            this.agencyName = _data["agencyName"];
            this.agencyCode = _data["agencyCode"];
            this.email = _data["email"];
            this.sFTPLink = _data["sftpLink"];
            this.description = _data["description"];
            this.agencyId = _data["agencyId"];
            this.sFTPLinkAccount = _data["sftpLinkAccount"];
            this.sFTPLinkPassword = _data["sftpLinkPassword"];
        }
    }

    static fromJS(data: any): AgencyDto {
        data = typeof data === 'object' ? data : {};
        let result = new AgencyDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["companyName"] = this.companyName;
        data["agencyName"] = this.agencyName;
        data["agencyCode"] = this.agencyCode;
        data["email"] = this.email;
        data["sFTPLink"] = this.sFTPLink;
        data["description"] = this.description;
        data["agencyId"] = this.agencyId;
        data["sFTPLinkAccount"] = this.sFTPLinkAccount;
        data["sFTPLinkPassword"] = this.sFTPLinkPassword;
        return data;
    }
}

export interface IAgencyDto {
    agencyId: number | undefined
    agencyName: string | undefined;
    agencyCode: string | undefined;
    companyName: string | undefined;
    email: string | undefined;
    sFTPLink: string | undefined;
    description: string | undefined;
    sFTPLinkAccount: string | undefined;
    sFTPLinkPassword: string | undefined;
}

export class PagedResultDtoOfAgencyListDto implements IPagedResultDtoOfAgencyListDto {
    totalCount!: number;
    items!: AgencyItemList[] | undefined;

    constructor(data?: IPagedResultDtoOfAgencyListDto) {
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
                    this.items!.push(AgencyItemList.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfAgencyListDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultDtoOfAgencyListDto();
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

export interface IPagedResultDtoOfAgencyListDto {
    totalCount: number;
    items: AgencyItemList[] | undefined;
}

export class AgencyItemList implements IAgencyItemList {

    agencyId: number;
    agencyName: string;
    agencyCode: string;
    companyName: string;
    email: string;
    sftpLink: string;
    description: string;
    sftpLinkAccount: string;
    sftpLinkPassword: string;

    constructor(data?: IAgencyItemList) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.companyName = _data["companyName"];
            this.agencyName = _data["agencyName"];
            this.agencyCode = _data["agencyCode"];
            this.email = _data["email"];
            this.sftpLink = _data["sftpLink"];
            this.description = _data["description"];
            this.agencyId = _data["agencyId"];
            this.sftpLinkAccount = _data["sftpLinkAccount"];
            this.sftpLinkPassword = _data["sftpLinkPassword"];
        }
    }

    static fromJS(data: any): AgencyItemList {
        data = typeof data === 'object' ? data : {};
        let result = new AgencyItemList();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["companyName"] = this.companyName;
        data["agencyName"] = this.agencyName;
        data["agencyCode"] = this.agencyCode;
        data["email"] = this.email;
        data["sftpLink"] = this.sftpLink;
        data["description"] = this.description;
        data["agencyId"] = this.agencyId;
        data["sftpLinkAccount"] = this.sftpLinkAccount;
        data["sftpLinkPassword"] = this.sftpLinkPassword;
        return data;
    }
}

export interface IAgencyItemList {
    agencyId: number | undefined
    agencyName: string | undefined;
    agencyCode: string | undefined;
    companyName: string | undefined;
    email: string | undefined;
    sftpLink: string | undefined;
    description: string | undefined;
    sftpLinkAccount: string | undefined;
    sftpLinkPassword: string | undefined;
}

export class GetListAgencyParam implements IGetListAgencyParam {

    AgencyName: string;
    agencyCode: string;
    SkipCount: number;
    MaxResultCount: number;

    constructor(data?: IGetListAgencyParam) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }


    init(_data?: any) {
        if (_data) {
            this.AgencyName = _data["AgencyName"];
            this.SkipCount = _data["SkipCount"];
            this.MaxResultCount = _data["MaxResultCount"];
        }
    }

    static fromJS(data: any): GetListAgencyParam {
        data = typeof data === 'object' ? data : {};
        let result = new GetListAgencyParam();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["AgencyName"] = this.AgencyName;
        data["SkipCount"] = this.SkipCount;
        data["MaxResultCount"] = this.MaxResultCount;
        return data;
    }
}

export interface IGetListAgencyParam {
    AgencyName: string | undefined,
    SkipCount: number,
    MaxResultCount: number,
}

