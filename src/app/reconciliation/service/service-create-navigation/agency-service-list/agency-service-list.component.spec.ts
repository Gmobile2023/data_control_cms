import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyServiceListComponent } from './agency-service-list.component';

describe('AgencyServiceListComponent', () => {
  let component: AgencyServiceListComponent;
  let fixture: ComponentFixture<AgencyServiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyServiceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
