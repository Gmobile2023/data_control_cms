import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlReportCreateComponent } from './control-report-create.component';

describe('ControlReportCreateComponent', () => {
  let component: ControlReportCreateComponent;
  let fixture: ComponentFixture<ControlReportCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlReportCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlReportCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
