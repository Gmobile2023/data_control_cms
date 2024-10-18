import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlManagementListComponent } from './control-management-list.component';

describe('ControlManagementListComponent', () => {
  let component: ControlManagementListComponent;
  let fixture: ComponentFixture<ControlManagementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlManagementListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlManagementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
