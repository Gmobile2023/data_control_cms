import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmailCreateComponent } from './manage-email-create.component';

describe('ManageEmailCreateComponent', () => {
  let component: ManageEmailCreateComponent;
  let fixture: ComponentFixture<ManageEmailCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEmailCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEmailCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
