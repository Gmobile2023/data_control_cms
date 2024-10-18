import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListFileComponent } from './modal-list-file.component';

describe('ModalListFileComponent', () => {
  let component: ModalListFileComponent;
  let fixture: ComponentFixture<ModalListFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalListFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalListFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
