// import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
// import { Observable } from 'rxjs';

// export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

// @Injectable({
//     providedIn: 'root'
// })
// export class EmailTemplateService {
//     private baseUrl: string;
//     protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

//     constructor(private http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
//         this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "https://localhost:44301";
//     }

//     getEmailTemplates(input: GetEmailTemplatesInput): Observable<EmailTemplate[]> {
//         const headers = new HttpHeaders().set('Content-Type', 'application/json');
//         return this.http.get<EmailTemplate[]>(`${this.baseUrl}/api/emailTemplates`, {
//             headers: headers,
//             params: <any>input
//         });
//     }
//     createEmailTemplate(template: EmailTemplate): Observable<EmailTemplate> {
//         const headers = new HttpHeaders().set('Content-Type', 'application/json');
//         return this.http.post<EmailTemplate>(`${this.baseUrl}/api/emailTemplates`, template, { headers: headers });
//     }
    

//     // ... Các phương thức dịch vụ khác nếu cần
// }
// // typeEmail.ts
// export interface IPagedResultDtoOfTypeEmailTemplate {
//     totalCount: number;
//     items: EmailTemplate[] | undefined;
// }

// export class PagedResultDtoOfTypeEmailTemplate implements IPagedResultDtoOfTypeEmailTemplate {
//     totalCount!: number;
//     items!: EmailTemplate[] | undefined;
// }

// export class EmailTemplate {
//     id: number;
//     name: string;
//     content: string;
//     // ... Các thuộc tính khác nếu cần
// }

// export class GetEmailTemplatesInput {
//     name?: string;
//     skipCount?: number;
//     maxResultCount?: number;
//     // ... Các thuộc tính khác nếu cần
// }
// export class PagedResultDtoOfAgencyListDto implements IPagedResultDtoOfAgencyListDto {
//     totalCount!: number;
//     items!: AgencyItemList[] | undefined;
