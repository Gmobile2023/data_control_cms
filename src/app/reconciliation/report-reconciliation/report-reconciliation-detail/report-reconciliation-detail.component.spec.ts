import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportReconciliationDetailComponent } from './report-reconciliation-detail.component';

describe('ReportReconciliationDetailComponent', () => {
  let component: ReportReconciliationDetailComponent;
  let fixture: ComponentFixture<ReportReconciliationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportReconciliationDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportReconciliationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
