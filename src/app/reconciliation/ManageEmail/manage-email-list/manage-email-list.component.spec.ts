import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmailListComponent } from './manage-email-list.component';

describe('ManageEmailListComponent', () => {
  let component: ManageEmailListComponent;
  let fixture: ComponentFixture<ManageEmailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEmailListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEmailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
