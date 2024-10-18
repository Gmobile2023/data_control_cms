import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchFileDetailComponent } from './batch-file-detail.component';

describe('BatchFileDetailComponent', () => {
  let component: BatchFileDetailComponent;
  let fixture: ComponentFixture<BatchFileDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchFileDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchFileDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
