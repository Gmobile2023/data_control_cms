import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmailDetailComponent } from './manage-email-detail.component';

describe('ManageEmailDetailComponent', () => {
  let component: ManageEmailDetailComponent;
  let fixture: ComponentFixture<ManageEmailDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEmailDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEmailDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
