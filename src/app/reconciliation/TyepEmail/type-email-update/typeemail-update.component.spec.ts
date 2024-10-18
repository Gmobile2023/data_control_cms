import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeemailUpdateComponent } from './typeemail-update.component';

describe('TypeemailUpdateComponent', () => {
  let component: TypeemailUpdateComponent;
  let fixture: ComponentFixture<TypeemailUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeemailUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeemailUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
