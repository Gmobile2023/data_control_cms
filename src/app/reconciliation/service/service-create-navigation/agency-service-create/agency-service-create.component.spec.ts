import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyServiceCreateComponent } from './agency-service-create.component';

describe('AgencyServiceCreateComponent', () => {
  let component: AgencyServiceCreateComponent;
  let fixture: ComponentFixture<AgencyServiceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyServiceCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyServiceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
