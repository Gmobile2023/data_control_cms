import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportRevenuecontrlComponent } from './report-revenuecontrl.component';

describe('ReportRevenuecontrlComponent', () => {
  let component: ReportRevenuecontrlComponent;
  let fixture: ComponentFixture<ReportRevenuecontrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportRevenuecontrlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportRevenuecontrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
