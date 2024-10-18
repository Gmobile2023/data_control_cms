import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmailUpdateComponent } from './manage-email-update.component';

describe('ManageEmailUpdateComponent', () => {
  let component: ManageEmailUpdateComponent;
  let fixture: ComponentFixture<ManageEmailUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEmailUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEmailUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
