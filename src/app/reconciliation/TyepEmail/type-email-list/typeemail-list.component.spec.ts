import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeemailListComponent } from './typeemail-list.component';

describe('TypeemailListComponent', () => {
  let component: TypeemailListComponent;
  let fixture: ComponentFixture<TypeemailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeemailListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeemailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
