import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeemailCreateComponent } from './typeemail-create.component';

describe('TypeemailCreateComponent', () => {
  let component: TypeemailCreateComponent;
  let fixture: ComponentFixture<TypeemailCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeemailCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeemailCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
