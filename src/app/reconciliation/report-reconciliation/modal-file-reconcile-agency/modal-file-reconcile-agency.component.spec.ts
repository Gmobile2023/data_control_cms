import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFileReconcileAgencyComponent } from './modal-file-reconcile-agency.component';

describe('ModalFileReconcileAgencyComponent', () => {
  let component: ModalFileReconcileAgencyComponent;
  let fixture: ComponentFixture<ModalFileReconcileAgencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFileReconcileAgencyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFileReconcileAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
