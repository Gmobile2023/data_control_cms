
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { ApiException, throwException, blobToText } from './service-proxies';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { AppConsts } from '@shared/AppConsts';

export const API_BASE_URL = new InjectionToken<string>('https://localhost:44301');

@Injectable({
    providedIn: 'root'
})
export class BftemplateService {

    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
    }

    public CreateBatchFile(body: CreateOrUpdateBatchFile | undefined): Observable<any> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/BatchFile/CreateBatchFile";
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
            return this.processCreateBatchFile(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateBatchFile(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<any>;
                }
            } else
                return _observableThrow(response_) as any as Observable<any>;
        }));
    }

    protected processCreateBatchFile(response: HttpResponseBase): Observable<any> {
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

    getBatchFiles(body: BatchFileSearchListDto | undefined): Observable<PagedResultDtoOfBatchFileListDto> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/BatchFile/Search";
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
            return this.processGetBatchFiles(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetBatchFiles(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<PagedResultDtoOfBatchFileListDto>;
                }
            } else
                return _observableThrow(response_) as any as Observable<PagedResultDtoOfBatchFileListDto>;
        }));
    }

    protected processGetBatchFiles(response: HttpResponseBase): Observable<PagedResultDtoOfBatchFileListDto> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = PagedResultDtoOfBatchFileListDto.fromJS(resultData200);
                return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap((_responseText: string) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf(null as any);
    }

    getBatchFileDetail(id: number | undefined): Observable<BatchFileDetail> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/BatchFile/GetDetail?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "BatchFileId=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processgetBatchFileDetail(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processgetBatchFileDetail(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<BatchFileDetail>;
                }
            } else
                return _observableThrow(response_) as any as Observable<BatchFileDetail>;
        }));
    }

    protected processgetBatchFileDetail(response: HttpResponseBase): Observable<BatchFileDetail> {
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

    public updateBatchFile(id: number | undefined, body: CreateOrUpdateBatchFile | undefined): Observable<any> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/BatchFile/UpdateBatchFile?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "BatchFileId=" + encodeURIComponent("" + id) + "&";

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
            return this.processCreateBatchFile(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateBatchFile(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<any>;
                }
            } else
                return _observableThrow(response_) as any as Observable<any>;
        }));
    }

    getBatchFileGetAll(batchFileName: string | undefined): Observable<BatchFileItemList[]> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/BatchFile/GetAll?";
        if (batchFileName)
            url_ += "batchFileName=" + encodeURIComponent("" + batchFileName) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processgetBatchFileGetAll(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processgetBatchFileGetAll(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<BatchFileItemList[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<BatchFileItemList[]>;
        }));
    }

    protected processgetBatchFileGetAll(response: HttpResponseBase): Observable<BatchFileItemList[]> {
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

    deleteBatchFile(id: number | undefined): Observable<any> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/BatchFile/Delete?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "BatchFileId=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
            })
        };

        return this.http.request("delete", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processDeleteBatchFile(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDeleteBatchFile(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<any>;
                }
            } else
                return _observableThrow(response_) as any as Observable<any>;
        }));
    }

    protected processDeleteBatchFile(response: HttpResponseBase): Observable<any> {
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

    getBatchFileFieldData(id: number | undefined): Observable<BatchFileFieldDataDto[]> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/BatchFile/GetFieldDataBatchFile?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "BatchFileId=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processgetBatchFileFieldData(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processgetBatchFileFieldData(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<any>;
                }
            } else
                return _observableThrow(response_) as any as Observable<any>;
        }));
    }

    protected processgetBatchFileFieldData(response: HttpResponseBase): Observable<BatchFileFieldDataDto[]> {
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

export class CreateOrUpdateBatchFile implements ICreateOrUpdateBatchFile {
    SourceDataName: string | undefined;
    SourceDataLink: string | undefined;
    SourceDataAccount: string | undefined;
    SourceDataPassword: string | undefined;
    FileName: string | undefined;
    FileCode: string | undefined;
    Description: string | undefined;
    BatchFileFieldDataDtos: BatchFileFieldDataDto[] | undefined;
    emailHost: string | undefined;
    emailPort: string | undefined;  
    emailAccount: string | undefined;  
    emailPassword: string | undefined;  
    subjectEmailIdentified: string | undefined;
    useDataFromEmail:boolean | undefined;
    useDataFromFtp:boolean | undefined = true;

    constructor(data?: ICreateOrUpdateBatchFile) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.SourceDataName = _data["sourceDataName"];
            this.SourceDataLink = _data["sourceDataLink"];
            this.SourceDataAccount = _data["sourceDataAccount"];
            this.SourceDataPassword = _data["sourceDataPassword"];
            this.FileName = _data["fileName"];
            this.emailHost = _data["emailHost"];
            this.FileCode = _data["fileCode"];
            this.emailHost = _data["emailHost"];
            this.emailPort = _data["emailPort"];
            this.emailAccount = _data["emailAccount"];
            this.emailPassword = _data["emailPassword"];
            this.useDataFromEmail = _data["useDataFromEmail"];
            this.useDataFromFtp = _data["useDataFromFtp"];
            this.subjectEmailIdentified = _data["subjectEmailIdentified"];
            this.Description = _data["description"];
            if (Array.isArray(_data["batchFileFieldDataDtos"])) {
                this.BatchFileFieldDataDtos = [] as any;
                for (let item of _data["batchFileFieldDataDtos"])
                    this.BatchFileFieldDataDtos!.push(BatchFileFieldDataDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): CreateOrUpdateBatchFile {
        data = typeof data === 'object' ? data : {};
        let result = new CreateOrUpdateBatchFile();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["sourceDataName"] = this.SourceDataName;
        data["sourceDataLink"] = this.SourceDataLink;
        data["sourceDataAccount"] = this.SourceDataAccount;
        data["sourceDataPassword"] = this.SourceDataPassword;
        data["fileName"] = this.FileName;
        data["fileCode"] = this.FileCode;
        data["emailHost"] = this.emailHost;
        data["emailPort"] = this.emailPort;
        data["emailAccount"] = this.emailAccount;
        data["emailPassword"] = this.emailPassword;
        data["subjectEmailIdentified"] = this.subjectEmailIdentified;
        data["useDataFromEmail"] = this.useDataFromEmail;
        data["useDataFromFtp"] = this.useDataFromFtp;
        data["description"] = this.Description;
        if (Array.isArray(this.BatchFileFieldDataDtos)) {
            data["batchFileFieldDataDtos"] = [];
            for (let item of this.BatchFileFieldDataDtos)
                data["batchFileFieldDataDtos"].push(item.toJSON());
        }
        return data;
    }

}

export interface ICreateOrUpdateBatchFile {
    SourceDataName: string | undefined,
    SourceDataLink: string | undefined,
    SourceDataAccount: string | undefined,
    SourceDataPassword: string | undefined,
    FileName: string | undefined,
    FileCode: string | undefined,
    Description: string | undefined,
    emailHost: string | undefined,
    emailPort: string | undefined,  
    emailAccount: string | undefined,  
    emailPassword: string | undefined,  
    subjectEmailIdentified: string | undefined,  
    useDataFromEmail:boolean | undefined, 
    useDataFromFtp:boolean | undefined, 

    BatchFileFieldDataDtos: BatchFileFieldDataDto[] | undefined,
}

export class BatchFileFieldDataDto implements IBatchFileFieldDataDto {
    BatchFileId: number;
    FieldDataName: string;
    DataType: BatchFileFieldDataType;
    IsKey: boolean;
    IsRequired: boolean;
    ColumnIdentified: number;
    IsReconcile: boolean;
    HasBeenChecked: boolean;
    Id: number;
    initialIsRequired: boolean;
    initialIsReconcile: boolean;
    useDataFromEmail:boolean;
    useDataFromFtp:boolean;


    constructor(data?: IBatchFileFieldDataDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
   
   
    init(_data?: any) {
        if (_data) {
            this.BatchFileId = _data["batchFileId"];
            this.FieldDataName = _data["fieldDataName"];
            this.DataType = _data["dataType"];
            this.IsKey = _data["isKey"];
            this.IsRequired = _data["isRequired"];
            this.ColumnIdentified = _data["columnIdentified"];
            this.IsReconcile = _data["isReconcile"];
            this.Id = _data["id"];
            this.useDataFromEmail = _data["useDataFromEmail"];
            this.useDataFromFtp = _data["useDataFromFtp"];

        }
    }

    static fromJS(data: any): BatchFileFieldDataDto {
        data = typeof data === 'object' ? data : {};
        let result = new BatchFileFieldDataDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["batchFileId"] = this.BatchFileId;
        data["fieldDataName"] = this.FieldDataName;
        data["dataType"] = this.DataType;
        data["isKey"] = this.IsKey;
        data["isRequired"] = this.IsRequired;
        data["columnIdentified"] = this.ColumnIdentified;
        data["IsReconcile"] = this.IsReconcile;
        data["id"] = this.Id;
        data["useDataFromEmail"] = this.useDataFromEmail;
        data["useDataFromFtp"] = this.useDataFromFtp;
        return data;
    }
}

export interface IBatchFileFieldDataDto {
    Id : number | undefined,
    BatchFileId: number | null,
    FieldDataName: string | undefined,
    DataType: BatchFileFieldDataType | undefined,
    IsKey: boolean | undefined,
    IsRequired : boolean | undefined,
    ColumnIdentified : number | undefined,
    IsReconcile : boolean | undefined
}

export enum BatchFileFieldDataType {
    Text,
    Number,
    DateTime
}

export const BatchFileFieldDataTypeMapping: Record<BatchFileFieldDataType, string> = {
    [BatchFileFieldDataType.Text]: "Text",
    [BatchFileFieldDataType.Number]: "Number",
    [BatchFileFieldDataType.DateTime]: "DateTime",
};

export class BatchFileItemList implements IBatchFileItemList {
    BatchFileId: number;
    SourceDataName: string;
    SourceDataLink: string;
    FileName: string;
    FileCode: string;
    Description: string;

    constructor(data?: IBatchFileItemList) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.BatchFileId = _data["batchFileId"];
            this.SourceDataName = _data["sourceDataName"];
            this.SourceDataLink = _data["sourceDataLink"];
            this.FileName = _data["fileName"];
            this.FileCode = _data["fileCode"];
            this.Description = _data["description"];
        }
    }

    static fromJS(data: any): BatchFileItemList {
        data = typeof data === 'object' ? data : {};
        let result = new BatchFileItemList();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["batchFileId"] = this.BatchFileId;
        data["sourceDataName"] = this.SourceDataName;
        data["sourceDataLink"] = this.SourceDataLink;
        data["fileName"] = this.FileName;
        data["fileCode"] = this.FileCode;
        data["description"] = this.Description;
        return data;
    }

}

export interface IBatchFileItemList {
    BatchFileId: number | undefined,
    SourceDataName: string | undefined,
    SourceDataLink: string | undefined,
    FileName: string | undefined,
    FileCode: string | undefined,
    Description: string | undefined
}

export class BatchFileSearchListDto implements IBatchFileSearchListDto {

    SkipCount: number;
    MaxResultCount: number;
    BatchFileName : string;
    constructor(data?: IBatchFileSearchListDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.SkipCount = _data["SkipCount"];
            this.MaxResultCount = _data["MaxResultCount"];
        }
    }

    static fromJS(data: any): BatchFileSearchListDto {
        data = typeof data === 'object' ? data : {};
        let result = new BatchFileSearchListDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["SkipCount"] = this.SkipCount;
        data["MaxResultCount"] = this.MaxResultCount;
        data["BatchFileName"] = this.BatchFileName;
        return data;
    }
}

export interface IBatchFileSearchListDto {
    SkipCount: number,
    MaxResultCount: number,
    BatchFileName : string
}

export class PagedResultDtoOfBatchFileListDto implements IPagedResultDtoOfBatchFileListDto {
    totalCount!: number;
    items!: BatchFileItemList[] | undefined;

    constructor(data?: IPagedResultDtoOfBatchFileListDto) {
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
                    this.items!.push(BatchFileItemList.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfBatchFileListDto {
        data = typeof data === 'object' ? data : {};
        let result = new PagedResultDtoOfBatchFileListDto();
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

export interface IPagedResultDtoOfBatchFileListDto {
    totalCount: number;
    items: BatchFileItemList[] | undefined;
}

export class BatchFileDetail implements IBatchFileDetail {
    SourceDataName: string | undefined;
    SourceDataLink: string | undefined;
    SourceDataAccount: string | undefined;
    SourceDataPassword: string | undefined;
    FileName: string | undefined;
    FileCode: string | undefined;
    Description: string | undefined;
    emailHost: string | undefined;
    emailPort: string | undefined;
    emailAccount: string | undefined;
    emailPassword: string | undefined;
    subjectEmailIdentified: string | undefined;
    useDataFromFtp : boolean | undefined;
    useDataFromEmail  : boolean | undefined;


    BatchFileFieldDataDtos: BatchFileFieldDataDto[] | undefined;

    constructor(data?: IBatchFileDetail) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.SourceDataName = _data["sourceDataName"];
            this.SourceDataLink = _data["sourceDataLink"];
            this.SourceDataAccount = _data["sourceDataAccount"];
            this.SourceDataPassword = _data["sourceDataPassword"];
            this.FileName = _data["fileName"];
            this.FileCode = _data["fileCode"];
            this.emailHost = _data["emailHost"];
            this.emailPort = _data["emailPort"];
            this.emailAccount = _data["emailAccount"];
            this.emailPassword = _data["emailPassword"];
            this.subjectEmailIdentified = _data["subjectEmailIdentified"];
            this.useDataFromFtp = _data["useDataFromFtp"];
            this.useDataFromEmail = _data["useDataFromEmail"];

            this.Description = _data["description"];
            if (Array.isArray(_data["batchFileFieldDataDtos"])) {
                this.BatchFileFieldDataDtos = [] as any;
                for (let item of _data["batchFileFieldDataDtos"])
                    this.BatchFileFieldDataDtos!.push(BatchFileFieldDataDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): BatchFileDetail {
        data = typeof data === 'object' ? data : {};
        let result = new BatchFileDetail();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["sourceDataName"] = this.SourceDataName;
        data["sourceDataLink"] = this.SourceDataLink;
        data["sourceDataAccount"] = this.SourceDataAccount;
        data["sourceDataPassword"] = this.SourceDataPassword;
        data["fileName"] = this.FileName;
        data["fileCode"] = this.FileCode;
        data["description"] = this.Description;
        data["emailHost"] = this.emailHost;
        data["emailPort"] = this.emailPort;
        data["emailAccount"] = this.emailAccount;
        data["emailPassword"] = this.emailPassword;
        data["subjectEmailIdentified"] = this.subjectEmailIdentified;
        data["useDataFromFtp"] = this.useDataFromFtp;
        data["useDataFromEmail"] = this.useDataFromEmail;


        if (Array.isArray(this.BatchFileFieldDataDtos)) {
            data["batchFileFieldDataDtos"] = [];
            for (let item of this.BatchFileFieldDataDtos)
                data["batchFileFieldDataDtos"].push(item.toJSON());
        }
        return data;
    }

}

export interface IBatchFileDetail {
    SourceDataName: string | undefined,
    SourceDataLink: string | undefined,
    SourceDataAccount: string | undefined,
    SourceDataPassword: string | undefined,
    FileName: string | undefined,
    FileCode: string | undefined,
    emailHost: string | undefined,
    emailPort: string | undefined,
    emailAccount: string | undefined,
    emailPassword: string | undefined,
    subjectEmailIdentified: string | undefined,
    useDataFromFtp: boolean | undefined,
    useDataFromEmail: boolean | undefined,
    Description: string | undefined,

    BatchFileFieldDataDtos: BatchFileFieldDataDto[] | undefined,
}
