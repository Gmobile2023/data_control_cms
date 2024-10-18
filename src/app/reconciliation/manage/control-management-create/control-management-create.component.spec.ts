import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlManagementCreateComponent } from './control-management-create.component';

describe('ControlManagementCreateComponent', () => {
  let component: ControlManagementCreateComponent;
  let fixture: ComponentFixture<ControlManagementCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlManagementCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlManagementCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
