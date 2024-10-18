import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { ApiException, throwException, blobToText } from './service-proxies';
import { environment } from 'environments/environment';

import { DateTime, Duration } from "luxon";
import { AppConsts } from '@shared/AppConsts';
import { GuidGeneratorService } from '@shared/utils/guid-generator.service';
import { TypeEmailService } from './type-email-service';

@Injectable()
export class ManageEmailService {
    private http: HttpClient;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;
    
    constructor(@Inject(HttpClient) http: HttpClient) {
        this.http = http;
    }

    createManageEmail(body: ManageEmailDto | undefined): Observable<any> {
        //let url_ = this.baseUrl + "/api/services/app/Suplier/CreateSupplier";
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/EmailTemplate/CreateEmailTemplate";
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
            return this.processCreateOrUpdateManageEmail(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateOrUpdateManageEmail(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<any>;
                }
            } else
                return _observableThrow(response_) as any as Observable<any>;
        }));
    }

    protected processCreateOrUpdateManageEmail(response: HttpResponseBase): Observable<any> {
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

    getManageEmailForEdit(id: number | undefined): Observable<ManageEmailDto> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/EmailTemplate/GetById?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "EmailTemplateId=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processGetManageEmailForEdit(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetManageEmailForEdit(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<ManageEmailDto>;
                }
            } else
                return _observableThrow(response_) as any as Observable<ManageEmailDto>;
        }));
    }

    protected processGetManageEmailForEdit(response: HttpResponseBase): Observable<ManageEmailDto> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                try {
                    let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                    return _observableOf(resultData200);
                  } catch (error) {
                    console.error("Error parsing JSON data:", error);
                    return _observableOf(null as any); // Hoặc xử lý lỗi theo cách khác ở đây.
                  }
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
    getManageEmail(body: GetListManageEmailParam | undefined): Observable<PagedResultDtoOfManageEmailListDto> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/EmailTemplate/Search";
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
            return this.processGetManageEmail(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetManageEmail(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<PagedResultDtoOfManageEmailListDto>;
                }
            } else
                return _observableThrow(response_) as any as Observable<PagedResultDtoOfManageEmailListDto>;
        }));
    }

    protected processGetManageEmail(response: HttpResponseBase): Observable<PagedResultDtoOfManageEmailListDto> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = PagedResultDtoOfManageEmailListDto.fromJS(resultData200);
                return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf(null as any);
    }

    updateManageEmail(body: CreateOrUpdateManageEmailParam | undefined, id: number | undefined): Observable<any> {
        //let url_ = this.baseUrl + "/api/services/app/Suplier/CreateSupplier";
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/EmailTemplate/UpdateEmailTemplate?";
        // if (id === null || id === undefined)
        //     throw new Error("The parameter 'id' cannot be null.");
        //     else if (id !== undefined) {
        //         url_ += "EmailTemplateId=" + encodeURIComponent("" + id) + "&";
        //       }

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
            return this.processCreateOrUpdateManageEmail(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateOrUpdateManageEmail(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<any>;
                }
            } else
                return _observableThrow(response_) as any as Observable<any>;
        }));
    }

    deleteManageEmail(id: number | undefined): Observable<void> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/EmailTemplate/DeleteEmailTemplate?";
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
            return this.processDeleteManageEmail(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDeleteManageEmail(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processDeleteManageEmail(response: HttpResponseBase): Observable<void> {
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

    protected processgetManageEmailGetAll(response: HttpResponseBase): Observable<ManageEmailItemList[]> {
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

    updateStatusEmailTemplate(body: UpdateStatusEmailTemplate | undefined): Observable<any> {
        //let url_ = this.baseUrl + "/api/services/app/Suplier/CreateSupplier";
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/EmailTemplate/UpdateStatusEmailTemplate";
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
            return this.processUpdateStatusEmailTemplate(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processUpdateStatusEmailTemplate(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<any>;
                }
            } else
                return _observableThrow(response_) as any as Observable<any>;
        }));
    }

    protected processUpdateStatusEmailTemplate(response: HttpResponseBase): Observable<any> {
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

export class CreateOrUpdateManageEmailParam implements ICreateOrUpdateManageEmailParam {
    id:number;
    emailTemplateTypeId:number;
    emailTemplateCode :string | undefined;
    emailTemplateName : string| undefined;
    description: string | undefined;
    titleEmail:string|undefined
    

    constructor(data?: ICreateOrUpdateManageEmailParam) {
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
            this.emailTemplateTypeId = _data["emailTemplateTypeId"];
            this.emailTemplateCode = _data["emailTemplateCode"];
            this.emailTemplateName = _data["emailTemplateName"];
            this.description = _data["description"];
            this.titleEmail = _data["titleEmail"];
        }
    }

    static fromJS(data: any): CreateOrUpdateManageEmailParam {
        data = typeof data === 'object' ? data : {};
        let result = new CreateOrUpdateManageEmailParam();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["emailTemplateTypeId"] = this.emailTemplateTypeId;
        data["emailTemplateCode"] = this.emailTemplateCode;
        data["emailTemplateName"] = this.emailTemplateName;
        data["description"] = this.description;
        data["titleEmail"] = this.titleEmail;
        return data;
    }
}

export interface ICreateOrUpdateManageEmailParam {
    id:number;
    emailTemplateTypeId:number;
    emailTemplateCode :string | undefined;
    emailTemplateName : string| undefined;
    description: string | undefined;
    titleEmail:string|undefined
}

export class PagedResultDtoOfManageEmailListDto implements IPagedResultDtoOfManageEmailListDto {
    totalCount!: number;
    items!: ManageEmailItemList[] | undefined;

    constructor(data?: IPagedResultDtoOfManageEmailListDto) {
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
                    this.items!.push(ManageEmailItemList.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfManageEmailListDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultDtoOfManageEmailListDto();
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

export interface IPagedResultDtoOfManageEmailListDto {
    totalCount: number;
    items: ManageEmailItemList[] | undefined;
}

export class ManageEmailItemList implements IManageEmailItemList {
    id:number;
    emailTemplateTypeId: number;
    emailTemplateCode :string | undefined;
    emailTemplateName : string| undefined;
    description: string | undefined;
    emailTemplateTypeName: string;
    titleEmail: string |undefined;
    active: boolean;

    constructor(data?: IManageEmailItemList) {
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
            this.emailTemplateTypeId = _data["emailTemplateTypeId"];
            this.emailTemplateCode = _data["emailTemplateCode"];
            this.emailTemplateName = _data["emailTemplateName"];
            this.emailTemplateTypeName = _data["emailTemplateTypeName"];
            this.description = _data["description"];
            this.titleEmail = _data["titleEmail"]
            this.active = _data["active"]
        }
    }

    static fromJS(data: any): ManageEmailItemList {
        data = typeof data === 'object' ? data : {};
        let result = new ManageEmailItemList();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["emailTemplateTypeId"] = this.emailTemplateTypeId;
        data["emailTemplateCode"] = this.emailTemplateCode;
        data["emailTemplateName"] = this.emailTemplateName;
        data["description"] = this.description;
        data["titleEmail"] = this.titleEmail;
        data["active"] = this.active;
        
        return data;
    }
}

export interface IManageEmailItemList {
    id:number;
    emailTemplateTypeId:number;
    emailTemplateCode :string | undefined,
    emailTemplateName : string| undefined,
    description: string | undefined,
    emailTemplateTypeName: string |undefined,
    titleEmail: string | undefined;
    active: boolean | undefined
}

export class GetListManageEmailParam implements IGetListManageEmail {
    id:number;
    emailTemplateTypeId: number;
    emailTemplateName: string;
    SkipCount: number;
    MaxResultCount: number;
    emailTemplateCode: string;
    emailTemplateTypeName: string;
    titleEmail: string;

    constructor(data?: IGetListManageEmail) {
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
            this.emailTemplateName = _data["emailTemplateName"];
            this.SkipCount = _data["SkipCount"];
            this.MaxResultCount = _data["MaxResultCount"];
        }
    }

    static fromJS(data: any): GetListManageEmailParam {
        data = typeof data === 'object' ? data : {};
        let result = new GetListManageEmailParam();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["emailTemplateName"] = this.emailTemplateName;
        data["emailTemplateTypeName"] = this.emailTemplateTypeName;
        data["SkipCount"] = this.SkipCount;
        data["MaxResultCount"] = this.MaxResultCount;
        return data;
    }
}

export interface IGetListManageEmail {
    emailTemplateName: string;
    SkipCount: number,
    MaxResultCount: number,
}

export class ManageEmailDto implements IManageEmailDto
{   
    id:number;
    emailTemplateTypeId:number;
    emailTemplateCode: string;
    emailTemplateName: string;
    description: string;
    titleEmail:string;

    constructor(data?: IManageEmailDto) {
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
            this.emailTemplateTypeId = _data["emailTemplateTypeId"];
            this.emailTemplateCode = _data["emailTemplateCode"];
            this.emailTemplateName = _data["emailTemplateName"];
            this.description = _data["description"];
            this.titleEmail = _data["titleEmail"];
        }
    }

    static fromJS(data: any): ManageEmailDto {
        data = typeof data === 'object' ? data : {};
        let result = new ManageEmailDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["emailTemplateTypeId"] = this.emailTemplateTypeId;
        data["emailTemplateCode"] = this.emailTemplateCode;
        data["emailTemplateName"] = this.emailTemplateName;
        data["description"] = this.description;
        data["titleEmail"] = this.titleEmail;
        return data;
    }
    
}

export interface IManageEmailDto
{   
    id:number,
    emailTemplateTypeId:number,
    emailTemplateName :string | undefined,
    emailTemplateCode : string| undefined,
    description: string | undefined,
    titleEmail:string | undefined
}

export class TypeEmailDto implements ITypeEmailDto{
    id:number;
    emailTemplateTypeCode :string | undefined;
    emailTemplateTypeName : string| undefined;
    description: string | undefined

    constructor(data?: ITypeEmailDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
    init(_data?: any){
        if (_data){
            this.id =_data["id"];
            this.emailTemplateTypeName =_data["emailTemplateTypeName"];
            this.emailTemplateTypeCode =_data["emailTemplateTypeCode"];
            this.description =_data["description"];
        }
    }
    static fromJS(data: any): TypeEmailDto {
        data = typeof data === 'object' ? data : {};
        let result = new TypeEmailDto();
        result.init(data);
        return result;
    }
    toJSON(data?: any){
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["emailTemplateTypeCode"] = this.emailTemplateTypeCode;
        data["emailTemplateTypeName"] = this.emailTemplateTypeName;
        data["description"] = this.description;
    }
}

export interface ITypeEmailDto{
    id:number,
    emailTemplateTypeCode :string | undefined,
    emailTemplateTypeName : string| undefined,
    description: string | undefined
}

export class TypeEmailListItem implements ITypeEmailListItem {
    emailTemplateTypeName: string;
    
    id: number;
    emailTemplateTypeCode: string;

    constructor(data?: ITypeEmailListItem) {
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
            
            this.id = _data["id"];
        }
    }

    static fromJS(data: any): TypeEmailListItem {
        data = typeof data === 'object' ? data : {};
        let result = new TypeEmailListItem();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["emailTemplateTypeName"] = this.emailTemplateTypeName;
        
        data["id"] = this.id;

        return data;
    }
}

export interface ITypeEmailListItem {
    emailTemplateTypeName: string | undefined,
    
    id: number | undefined
}

export class UpdateStatusEmailTemplate implements IUpdateStatusEmailTemplate{
    emailTemplateId: number;
    active: boolean;

    constructor(data?: IUpdateStatusEmailTemplate) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
    
    init(_data?: any){
        if (_data){
            this.emailTemplateId =_data["emailTemplateId"];
            this.active =_data["active"];
        }
    }
    static fromJS(data: any): UpdateStatusEmailTemplate {
        data = typeof data === 'object' ? data : {};
        let result = new UpdateStatusEmailTemplate();
        result.init(data);
        return result;
    }
    toJSON(data?: any){
        data = typeof data === 'object' ? data : {};
        data["emailTemplateId"] = this.emailTemplateId;
        data["active"] = this.active;

        return data;
    }
}

export interface IUpdateStatusEmailTemplate
{
    emailTemplateId : number,
    active: boolean
}




