import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierServiceCreateComponent } from './supplier-service-create.component';

describe('SupplierServiceCreateComponent', () => {
  let component: SupplierServiceCreateComponent;
  let fixture: ComponentFixture<SupplierServiceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierServiceCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierServiceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
