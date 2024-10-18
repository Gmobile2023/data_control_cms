import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierServiceListComponent } from './supplier-service-list.component';

describe('SupplierServiceListComponent', () => {
  let component: SupplierServiceListComponent;
  let fixture: ComponentFixture<SupplierServiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierServiceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
