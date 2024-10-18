import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportReconciliationComponent } from './report-reconciliation.component';

describe('ReportReconciliationComponent', () => {
  let component: ReportReconciliationComponent;
  let fixture: ComponentFixture<ReportReconciliationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportReconciliationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportReconciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
