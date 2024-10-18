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
export class TypeEmailService {
    private http: HttpClient;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;
    constructor(@Inject(HttpClient) http: HttpClient) {
        this.http = http;
    }
    getDropdownList(body: DropdownListEmailTypeParam): Observable<TypeEmailItemList[]> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/EmailTemplateType/GetDropdownList";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDropdownItem(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDropdownItem(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<TypeEmailDto>;
                }
            } else
                return _observableThrow(response_) as any as Observable<TypeEmailDto>;
        }));
    }

    
    protected processDropdownItem(response: HttpResponseBase): Observable<any> {
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

    createTypeEmail(body: TypeEmailDto | undefined): Observable<any> {
        //let url_ = this.baseUrl + "/api/services/app/Suplier/CreateSupplier";
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/EmailTemplateType/CreateEmailTemplateType";
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
            return this.processCreateOrUpdateTypeEmail(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateOrUpdateTypeEmail(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<any>;
                }
            } else
                return _observableThrow(response_) as any as Observable<any>;
        }));
    }

    protected processCreateOrUpdateTypeEmail(response: HttpResponseBase): Observable<any> {
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
     * @param body (optional) 
     * @return Success
     */


    /**
    * @param id (optional) 
    * @return Success
    */
    getTypeEmailForEdit(id: number | undefined): Observable<TypeEmailDto> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/EmailTemplateType/GetDetailById?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "EmailTemplateTypeId=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processGetTypeEmailForEdit(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetTypeEmailForEdit(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<TypeEmailDto>;
                }
            } else
                return _observableThrow(response_) as any as Observable<TypeEmailDto>;
        }));
    }

    protected processGetTypeEmailForEdit(response: HttpResponseBase): Observable<TypeEmailDto> {
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
    getTypeEmail(body: GetListTypeEmailParam | undefined): Observable<PagedResultDtoOfTypeEmailListDto> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/EmailTemplateType/Search";
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
            return this.processGetTypeEmail(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetTypeEmail(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<PagedResultDtoOfTypeEmailListDto>;
                }
            } else
                return _observableThrow(response_) as any as Observable<PagedResultDtoOfTypeEmailListDto>;
        }));
    }

    protected processGetTypeEmail(response: HttpResponseBase): Observable<PagedResultDtoOfTypeEmailListDto> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = PagedResultDtoOfTypeEmailListDto.fromJS(resultData200);
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
     updateTypeEmail(body: CreateOrUpdateTypeEmailParam | undefined, id: number | undefined): Observable<any> {
        //let url_ = this.baseUrl + "/api/services/app/Suplier/CreateSupplier";
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/EmailTemplateType/UpdateEmailTemplateType?";
        if (id === null || id === undefined)
            throw new Error("The parameter 'id' cannot be null.");
            else if (id !== undefined) {
                url_ += "EmailTemplateTypeId=" + encodeURIComponent("" + id) + "&";
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
            return this.processCreateOrUpdateTypeEmail(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateOrUpdateTypeEmail(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<any>;
                }
            } else
                return _observableThrow(response_) as any as Observable<any>;
        }));
    }

    deleteTypeEmail(id: number | undefined): Observable<void> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/EmailTemplateType/DeleteEmailTemplateType?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "EmailTemplateId=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
            })
        };

        return this.http.request("delete", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processDeleteTypeEmail(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDeleteTypeEmail(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processDeleteTypeEmail(response: HttpResponseBase): Observable<void> {
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

    protected processgetTypeEmailGetAll(response: HttpResponseBase): Observable<TypeEmailItemList[]> {
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

export class CreateOrUpdateTypeEmailParam implements ICreateOrUpdateTypeEmailParam {
    id:number;
    emailTemplateTypeCode :string | undefined;
    emailTemplateTypeName : string| undefined;
    description: string | undefined;
    

    constructor(data?: ICreateOrUpdateTypeEmailParam) {
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
            this.emailTemplateTypeCode = _data["emailTemplateTypeCode"];
            this.emailTemplateTypeName = _data["emailTemplateTypeName"];
            this.description = _data["description"];
        }
    }

    static fromJS(data: any): CreateOrUpdateTypeEmailParam {
        data = typeof data === 'object' ? data : {};
        let result = new CreateOrUpdateTypeEmailParam();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["emailTemplateTypeCode"] = this.emailTemplateTypeCode;
        data["emailTemplateTypeName"] = this.emailTemplateTypeName;
        data["description"] = this.description;
        return data;
    }
}

export interface ICreateOrUpdateTypeEmailParam {
    emailTemplateTypeCode :string | undefined;
    emailTemplateTypeName : string| undefined;
    description: string | undefined
}

export class PagedResultDtoOfTypeEmailListDto implements IPagedResultDtoOfTypeEmailListDto {
    totalCount!: number;
    items!: TypeEmailItemList[] | undefined;

    constructor(data?: IPagedResultDtoOfTypeEmailListDto) {
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
                    this.items!.push(TypeEmailItemList.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfTypeEmailListDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultDtoOfTypeEmailListDto();
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

export interface IPagedResultDtoOfTypeEmailListDto {
    totalCount: number;
    items: TypeEmailItemList[] | undefined;
}

export class TypeEmailItemList implements ITypeEmailItemList {
    id: number;
    
    emailTemplateTypeCode :string | undefined;
    emailTemplateTypeName : string| undefined;
    description: string | undefined

    constructor(data?: ITypeEmailItemList) {
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
            this.emailTemplateTypeCode = _data["emailTemplateTypeCode"];
            this.emailTemplateTypeName = _data["emailTemplateTypeName"];
            this.description = _data["description"];
            
        }
    }

    static fromJS(data: any): TypeEmailItemList {
        data = typeof data === 'object' ? data : {};
        let result = new TypeEmailItemList();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["emailTemplateTypeCode"] = this.emailTemplateTypeCode;
        data["emailTemplateTypeName"] = this.emailTemplateTypeName;
        data["description"] = this.description;
        
        return data;
    }
}

export interface ITypeEmailItemList {
    id:number;
    emailTemplateTypeCode :string | undefined,
    emailTemplateTypeName : string| undefined,
    description: string | undefined
}

export class GetListTypeEmailParam implements IGetListTypeEmail {
    id: number;
    emailTemplateTypeName: string;
    SkipCount: number;
    MaxResultCount: number;
    emailTemplateTypeCode: string;

    constructor(data?: IGetListTypeEmail) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
  

    init(_data?: any) {
        if (_data) {
            this.emailTemplateTypeName = _data["emailTemplateTypeName"];
            this.SkipCount = _data["SkipCount"];
            this.MaxResultCount = _data["MaxResultCount"];
        }
    }

    static fromJS(data: any): GetListTypeEmailParam {
        data = typeof data === 'object' ? data : {};
        let result = new GetListTypeEmailParam();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["emailTemplateTypeName"] = this.emailTemplateTypeName;
        data["SkipCount"] = this.SkipCount;
        data["MaxResultCount"] = this.MaxResultCount;
        return data;
    }
}

export interface IGetListTypeEmail {
    emailTemplateTypeName: string;
    SkipCount: number,
    MaxResultCount: number,
}

export class TypeEmailDto implements ITypeEmailDto
{   
    id:number;
    emailTemplateTypeCode: string;
    emailTemplateTypeName: string;
    description: string;

    constructor(data?: ITypeEmailDto) {
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
            this.emailTemplateTypeCode = _data["emailTemplateTypeCode"];
            this.emailTemplateTypeName = _data["emailTemplateTypeName"];
            this.description = _data["description"];
        }
    }

    static fromJS(data: any): TypeEmailDto {
        data = typeof data === 'object' ? data : {};
        let result = new TypeEmailDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["emailTemplateTypeCode"] = this.emailTemplateTypeCode;
        data["emailTemplateTypeName"] = this.emailTemplateTypeName;
        data["description"] = this.description;
        return data;
    }
    
}

export interface ITypeEmailDto
{
    id:number,
    emailTemplateTypeCode :string | undefined,
    emailTemplateTypeName : string| undefined,
    description: string | undefined
}

export interface IDropdownListEmailTypeParam {
    emailTemplateTypeName: string | undefined,
}

export class DropdownListEmailTypeParam implements IDropdownListEmailTypeParam {
    
    emailTemplateTypeName: string;
    constructor(data?: IDropdownListEmailTypeParam) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.emailTemplateTypeName = _data["emailTemplateTypeName"];
        }
    }

    static fromJS(data: any): GetListTypeEmailParam {
        data = typeof data === 'object' ? data : {};
        let result = new GetListTypeEmailParam();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["emailTemplateTypeName"] = this.emailTemplateTypeName;
        return data;
    }
}

export interface IDropdownResultEmailTypeDto {
    items: TypeEmailItemList[] | undefined;
}

export class DropdownResultEmailTypeDto implements IDropdownResultEmailTypeDto {
    items!: TypeEmailItemList[] | undefined;

    constructor(data?: IDropdownResultEmailTypeDto) {
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
                    this.items!.push(TypeEmailItemList.fromJS(item));
            }
        }
    }

    static fromJS(data: any): DropdownResultEmailTypeDto {
        data = typeof data === 'object' ? data : {};
        let result = new DropdownResultEmailTypeDto();
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