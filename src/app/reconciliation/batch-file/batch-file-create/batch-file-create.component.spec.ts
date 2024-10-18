import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchFileCreateComponent } from './batch-file-create.component';

describe('BatchFileCreateComponent', () => {
  let component: BatchFileCreateComponent;
  let fixture: ComponentFixture<BatchFileCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchFileCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchFileCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
