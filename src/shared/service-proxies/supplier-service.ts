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
export class SupplierService {
    private http: HttpClient;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;
    constructor(@Inject(HttpClient) http: HttpClient) {
        this.http = http;
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    createSupplier(body: CreateOrUpdateSupplierParam | undefined): Observable<any> {
        //let url_ = this.baseUrl + "/api/services/app/Suplier/CreateSupplier";
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Supplier/CreateSupplier";
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
            return this.processCreateOrUpdateSupplier(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateOrUpdateSupplier(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<any>;
                }
            } else
                return _observableThrow(response_) as any as Observable<any>;
        }));
    }

    protected processCreateOrUpdateSupplier(response: HttpResponseBase): Observable<any> {
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
    getSupplierForEdit(id: number | undefined): Observable<SupplierDto> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Supplier/GetDetailById?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "SupplierId=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processGetSupplierForEdit(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetSupplierForEdit(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<SupplierDto>;
                }
            } else
                return _observableThrow(response_) as any as Observable<SupplierDto>;
        }));
    }

    protected processGetSupplierForEdit(response: HttpResponseBase): Observable<SupplierDto> {
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
    getSuppliers(body: GetListSupplierParam | undefined): Observable<PagedResultDtoOfSupplierListDto> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Supplier/Search";
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
            return this.processGetSuppliers(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetSuppliers(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<PagedResultDtoOfSupplierListDto>;
                }
            } else
                return _observableThrow(response_) as any as Observable<PagedResultDtoOfSupplierListDto>;
        }));
    }

    protected processGetSuppliers(response: HttpResponseBase): Observable<PagedResultDtoOfSupplierListDto> {
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

     /**
     * @param body (optional) 
     * @return Success
     */
     updateSupplier(body: CreateOrUpdateSupplierParam | undefined, supplierId: number | undefined): Observable<any> {
        //let url_ = this.baseUrl + "/api/services/app/Suplier/CreateSupplier";
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Supplier/UpdateSupplier?";
        if (supplierId === null)
            throw new Error("The parameter 'id' cannot be null.");
            else if (supplierId !== undefined) {
                url_ += "SupplierId=" + encodeURIComponent("" + supplierId) + "&";
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
            return this.processCreateOrUpdateSupplier(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateOrUpdateSupplier(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<any>;
                }
            } else
                return _observableThrow(response_) as any as Observable<any>;
        }));
    }

    deleteSupplier(id: number | undefined): Observable<void> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Supplier/DeleteSupplier?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "SupplierId=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
            })
        };

        return this.http.request("delete", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processDeleteSupplier(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDeleteSupplier(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processDeleteSupplier(response: HttpResponseBase): Observable<void> {
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

    getSupplierGetAll(supplierName: string | undefined): Observable<SupplierItemList[]> {
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
                    return _observableThrow(e) as any as Observable<SupplierItemList[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<SupplierItemList[]>;
        }));
    }

    protected processgetSupplierGetAll(response: HttpResponseBase): Observable<SupplierItemList[]> {
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

export class CreateOrUpdateSupplierParam implements ICreateOrUpdateSupplierParam {
    supplierId: number;
    supplierCode: string;
    supplierName: string;
    companyName: string;
    email: string;
    sFTPLink: string;
    description: string;
    sFTPLinkAccount: string;
    sFTPLinkPassword: string;

    constructor(data?: ICreateOrUpdateSupplierParam) {
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
            this.supplierCode = _data["supplierCode"];
            this.companyName = _data["companyName"];
            this.email= _data['email'];
            this.supplierName = _data["supplierName"];
            this.supplierCode = _data["supplierCode"];
            this.sFTPLink = _data["sFTPLink"];
            this.description = _data["description"];
            this.sFTPLinkAccount = _data["sFTPLinkAccount"];
            this.sFTPLinkPassword = _data["sFTPLinkPassword"];
        }
    }

    static fromJS(data: any): CreateOrUpdateSupplierParam {
        data = typeof data === 'object' ? data : {};
        let result = new CreateOrUpdateSupplierParam();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["supplierId"] = this.supplierId;
        data["suppllerCode"] = this.supplierCode;
        data["companyName"] = this.companyName;
        data["supplierName"] = this.supplierName;
        data["email"] = this.email;
        data["sFTPLink"] = this.sFTPLink;
        data["description"] = this.description;
        data["sFTPLinkAccount"] = this.sFTPLinkAccount;
        data["sFTPLinkPassword"] = this.sFTPLinkPassword;
        data["supplierCode"] = this.supplierCode;
        return data;
    }
}

export interface ICreateOrUpdateSupplierParam {
    supplierName: string | undefined;
    supplierCode: string | undefined;
    companyName: string | undefined;
    email: string | undefined;
    sFTPLink: string | undefined;
    description: string | undefined;
    sFTPLinkAccount: string | undefined;
    sFTPLinkPassword: string | undefined;
}

export class SupplierDto implements ISupplierDto {
    supplierId: number;
    supplierCode: string;
    supplierName: string;
    companyName: string;
    email: string;
    sFTPLink: string;
    description: string;
    sFTPLinkAccount: string;
    sFTPLinkPassword: string;

    constructor(data?: ICreateOrUpdateSupplierParam) {
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
            this.supplierCode = _data["supplierCode"];
            this.companyName = _data["companyName"];
            this.supplierName = _data["supplierName"];
            this.email = _data["email"];
            this.sFTPLink = _data["sftpLink"];
            this.description = _data["description"];
         
            this.sFTPLinkAccount = _data["sftpLinkAccount"];
            this.sFTPLinkPassword = _data["sftpLinkPassword"];
        }
    }

    static fromJS(data: any): SupplierDto {
        data = typeof data === 'object' ? data : {};
        let result = new SupplierDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["supplierCode"]  = this.supplierCode;
        data["companyName"] = this.companyName;
        data["supplierName"] = this.supplierName;
        data["email"] = this.email;
        data["sFTPLink"] = this.sFTPLink;
        data["description"] = this.description;
        data["supplierId"] = this.supplierId;
        data["sFTPLinkAccount"] = this.sFTPLinkAccount;
        data["sFTPLinkPassword"] = this.sFTPLinkPassword;
        return data;
    }
}

export interface ISupplierDto {
    supplierId: number | undefined
    supplierCode: string | undefined;
    supplierName: string | undefined;
    companyName: string | undefined;
    email: string | undefined;
    sFTPLink: string | undefined;
    description: string | undefined;
    sFTPLinkAccount: string | undefined;
    sFTPLinkPassword: string | undefined;
}

export class PagedResultDtoOfSupplierListDto implements IPagedResultDtoOfSupplierListDto {
    totalCount!: number;
    items!: SupplierItemList[] | undefined;

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
                    this.items!.push(SupplierItemList.fromJS(item));
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
    items: SupplierItemList[] | undefined;
}

export class SupplierItemList implements ISupplierItemList {

    supplierId: number;
    supplierCode: string;
    supplierName: string;
    companyName: string;
    email: string;
    sftpLink: string;
    description: string;
    sftpLinkAccount: string;
    sftpLinkPassword: string;

    constructor(data?: ISupplierItemList) {
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
            this.supplierCode = _data["supplierCode"];
            this.companyName = _data["companyName"];
            this.supplierName = _data["supplierName"];
            this.email = _data["email"];
            this.sftpLink = _data["sftpLink"];
            this.description = _data["description"];
            this.sftpLinkAccount = _data["sftpLinkAccount"];
            this.sftpLinkPassword = _data["sftpLinkPassword"];
        }
    }

    static fromJS(data: any): SupplierItemList {
        data = typeof data === 'object' ? data : {};
        let result = new SupplierItemList();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["companyName"] = this.companyName;
        data["supplierCode"] = this.supplierCode;
        data["supplierName"] = this.supplierName;
        data["email"] = this.email;
        data["sFTPLink"] = this.sftpLink;
        data["description"] = this.description;
        data["supplierId"] = this.supplierId;
        data["sFTPLinkAccount"] = this.sftpLinkAccount;
        data["sFTPLinkPassword"] = this.sftpLinkPassword;
        return data;
    }
}

export interface ISupplierItemList {
    supplierId: number | undefined;
    supplierCode: string | undefined;
    supplierName: string | undefined;
    companyName: string | undefined;
    email: string | undefined;
    sftpLink: string | undefined;
    description: string | undefined;
    sftpLinkAccount: string | undefined;
    sftpLinkPassword: string | undefined;
}

export class GetListSupplierParam implements IGetListSupplierParam {

    SupplierName: string;
    SkipCount: number;
    MaxResultCount: number;
    supplierCode: string;

    constructor(data?: IGetListSupplierParam) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
  

    init(_data?: any) {
        if (_data) {
            this.SupplierName = _data["SupplierName"];
            this.SkipCount = _data["SkipCount"];
            this.MaxResultCount = _data["MaxResultCount"];
        }
    }

    static fromJS(data: any): GetListSupplierParam {
        data = typeof data === 'object' ? data : {};
        let result = new GetListSupplierParam();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["SupplierName"] = this.SupplierName;
        data["SkipCount"] = this.SkipCount;
        data["MaxResultCount"] = this.MaxResultCount;
        return data;
    }
}

export interface IGetListSupplierParam {
    SupplierName: string | undefined,
    SkipCount: number,
    MaxResultCount: number,
}

