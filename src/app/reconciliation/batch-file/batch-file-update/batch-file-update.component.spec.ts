import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchFileUpdateComponent } from './batch-file-update.component';

describe('BatchFileUpdateComponent', () => {
  let component: BatchFileUpdateComponent;
  let fixture: ComponentFixture<BatchFileUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchFileUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchFileUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
