import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { ApiException, throwException, blobToText } from './service-proxies';

import { DateTime, Duration } from "luxon";
import { environment } from 'environments/environment';
import { AppConsts } from '@shared/AppConsts';
@Injectable()
export class ServiceTypeService {
    private http: HttpClient;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient) {
        this.http = http;
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    createServiceType(body: CreateServiceTypeParam | undefined): Observable<any> {
        let url_ = AppConsts.remoteServiceBaseUrl+"/api/services/app/ServiceType/CreateServiceType";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processCreateOrUpdateServiceType(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateOrUpdateServiceType(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<any>;
                }
            } else
                return _observableThrow(response_) as any as Observable<any>;
        }));
    }
    /**
     * @param body (optional) 
     * @return Success
     */
    updateServiceType(body: CreateServiceTypeParam | undefined, serviceTypeId : number | undefined): Observable<any> {
        let url_ = AppConsts.remoteServiceBaseUrl+"/api/services/app/ServiceType/UpdateServiceType?";
        if (serviceTypeId === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (serviceTypeId !== undefined)
            url_ += "serviceTypeId=" + encodeURIComponent("" + serviceTypeId) + "&";
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

        return this.http.request("put", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processCreateOrUpdateServiceType(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateOrUpdateServiceType(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<any>;
                }
            } else
                return _observableThrow(response_) as any as Observable<any>;
        }));
    }

    protected processCreateOrUpdateServiceType(response: HttpResponseBase): Observable<any> {
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
    getServiceType(body: GetServiceTypeParam | undefined): Observable<PagedResultServiceTypeDto> {
        let url_ = AppConsts.remoteServiceBaseUrl+"/api/services/app/ServiceType/Search";
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
            return this.processGetServiceType(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetServiceType(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<PagedResultServiceTypeDto>;
                }
            } else
                return _observableThrow(response_) as any as Observable<PagedResultServiceTypeDto>;
        }));
    }

    protected processGetServiceType(response: HttpResponseBase): Observable<PagedResultServiceTypeDto> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = PagedResultServiceTypeDto.fromJS(resultData200);
                return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf(null as any);
    }

    getDropdownServiceType(body: DropdownListServiceTypeParam | undefined): Observable<ServiceTypeItemList[]> {
        let url_ = AppConsts.remoteServiceBaseUrl+"/api/services/app/ServiceType/GetDataForDropDown";
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
            return this.processGetDropdownServiceType(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetDropdownServiceType(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<ServiceTypeItemList[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<ServiceTypeItemList[]>;
        }));
    }
    protected processGetDropdownServiceType(response: HttpResponseBase): Observable<ServiceTypeItemList[]> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                // result200 = DropdownResultServiceTypeDto.fromJS(resultData200.results);
                return _observableOf(resultData200.results);
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
     getServiceTypeForEdit(id: number | undefined): Observable<ServiceTypeDTO> {
        let url_ = AppConsts.remoteServiceBaseUrl+"/api/services/app/ServiceType/GetDetailById?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "id=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetServiceTypeForEdit(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetServiceTypeForEdit(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<ServiceTypeDTO>;
                }
            } else
                return _observableThrow(response_) as any as Observable<ServiceTypeDTO>;
        }));
    }

    protected processGetServiceTypeForEdit(response: HttpResponseBase): Observable<ServiceTypeDTO> {
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
    protected processGetUserForEdit(response: HttpResponseBase): Observable<ServiceTypeDTO> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = ServiceTypeDTO.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf(null as any);
    }
    deleteServiceType(id: number | undefined): Observable<void> {
        let url_ = AppConsts.remoteServiceBaseUrl+"/api/services/app/ServiceType/DeleteServiceType?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "serviceTypeId=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
            })
        };

        return this.http.request("delete", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processDeleteServiceType(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDeleteServiceType(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }
    protected processDeleteServiceType(response: HttpResponseBase): Observable<void> {
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
}

export class CreateServiceTypeParam implements ICreateServiceTypeParam {
  
    serviceTypeName: string;
    serviceTypeCode: string;
    description: string;

    constructor(data?: ICreateServiceTypeParam) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.serviceTypeCode = _data["companyName"];
            this.serviceTypeCode = _data["supplierName"];
            this.description = _data["email"];
        }
    }

    static fromJS(data: any): CreateServiceTypeParam {
        data = typeof data === 'object' ? data : {};
        let result = new CreateServiceTypeParam();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["serviceTypeName"] = this.serviceTypeName;
        data["serviceTypeCode"] = this.serviceTypeCode;
        data["description"] = this.description;
        return data;
    }
}

export interface ICreateServiceTypeParam {
    serviceTypeName: string | undefined;
    serviceTypeCode: string | undefined;
    description: string | undefined;
}

export class ServiceTypeDTO implements IServiceTypeDTO {
    id: number;
    serviceTypeName: string;
    serviceTypeCode: string;
    description: string;
    http: any;
    

    constructor(data?: ICreateServiceTypeParam) {
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
            this.serviceTypeName = _data["serviceTypeName"];
            this.serviceTypeCode = _data["serviceTypeCode"];
            this.description = _data["description"];
        }
    }

    static fromJS(data: any): ServiceTypeDTO {
        data = typeof data === 'object' ? data : {};
        let result = new ServiceTypeDTO();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["serviceTypeName"] = this.serviceTypeName;
        data["serviceTypeCode"] = this.serviceTypeCode;
        data["description"] = this.description;
        
        return data;
    }
}

export interface IServiceTypeDTO {
    id : number | undefined 
    serviceTypeName: string | undefined;
    serviceTypeCode: string | undefined;
    description: string | undefined;
}
export class GetServiceTypeParam implements IGetServiceTypeParam {

    ServiceTypeName: string;
    SkipCount: number;
    MaxResultCount: number;

    constructor(data?: IGetServiceTypeParam) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.ServiceTypeName = _data["ServiceTypeName"];
            this.SkipCount = _data["SkipCount"];
            this.MaxResultCount = _data["MaxResultCount"];
        }
    }

    static fromJS(data: any): GetServiceTypeParam {
        data = typeof data === 'object' ? data : {};
        let result = new GetServiceTypeParam();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["ServiceTypeName"] = this.ServiceTypeName;
        data["SkipCount"] = this.SkipCount;
        data["MaxResultCount"] = this.MaxResultCount;
        return data;
    }
}

export interface IGetServiceTypeParam {
    ServiceTypeName: string | undefined,
    SkipCount: number,
    MaxResultCount: number,
}
export class PagedResultServiceTypeDto implements IPagedResultServiceTypeDto {
    totalCount!: number;
    items!: ServiceTypeItemList[] | undefined;

    constructor(data?: IPagedResultServiceTypeDto) {
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
                    this.items!.push(ServiceTypeItemList.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultServiceTypeDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultServiceTypeDto();
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

export interface IPagedResultServiceTypeDto {
    totalCount: number;
    items: ServiceTypeItemList[] | undefined;
}
export class ServiceTypeItemList implements IServiceTypeItemList {

    id: number;
    serviceTypeName: string;
    serviceTypeCode: string;
    description: string;

    constructor(data?: IServiceTypeItemList) {
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
            this.serviceTypeCode = _data["serviceTypeCode"];
            this.serviceTypeName = _data["serviceTypeName"];
            this.description = _data["description"];
            
        }
    }

    static fromJS(data: any): ServiceTypeItemList {
        data = typeof data === 'object' ? data : {};
        let result = new ServiceTypeItemList();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["serviceTypeName"] = this.serviceTypeName;
        data["serviceTypeCode"] = this.serviceTypeCode;
        data["description"] = this.description;
        return data;
    }
}

export interface IServiceTypeItemList {
    id: number | undefined
    serviceTypeName: string | undefined;
    serviceTypeCode: string | undefined;
    description: string | undefined;
}


export interface IDropdownListServiceTypeParam {
    ServiceTypeName: string | undefined,
}

export class DropdownListServiceTypeParam implements IDropdownListServiceTypeParam {

    ServiceTypeName: string;
    constructor(data?: IDropdownListServiceTypeParam) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.ServiceTypeName = _data["ServiceTypeName"];
        }
    }

    static fromJS(data: any): GetServiceTypeParam {
        data = typeof data === 'object' ? data : {};
        let result = new GetServiceTypeParam();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["ServiceTypeName"] = this.ServiceTypeName;
        return data;
    }
}

export interface IDropdownResultServiceTypeDto {
    items: ServiceTypeItemList[] | undefined;
}
export class DropdownResultServiceTypeDto implements IDropdownResultServiceTypeDto {
    items!: ServiceTypeItemList[] | undefined;

    constructor(data?: IDropdownResultServiceTypeDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            if (Array.isArray(_data["items"])) {
                this.items = [] as any;
                for (let item of _data["items"])
                    this.items!.push(ServiceTypeItemList.fromJS(item));
            }
        }
    }

    static fromJS(data: any): DropdownResultServiceTypeDto {
        data = typeof data === 'object' ? data : {};
        let result = new DropdownResultServiceTypeDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        if (Array.isArray(this.items)) {
            data["items"] = [];
            for (let item of this.items)
                data["items"].push(item.toJSON());
        }
        return data;
    }
}