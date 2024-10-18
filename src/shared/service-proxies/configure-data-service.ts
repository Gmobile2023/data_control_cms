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
export class configureDataService {

}