import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFileReconcileSupplierComponent } from './modal-file-reconcile-supplier.component';

describe('ModalFileReconcileSupplierComponent', () => {
  let component: ModalFileReconcileSupplierComponent;
  let fixture: ComponentFixture<ModalFileReconcileSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFileReconcileSupplierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFileReconcileSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
