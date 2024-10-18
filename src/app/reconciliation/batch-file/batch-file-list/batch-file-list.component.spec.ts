import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchFileListComponent } from './batch-file-list.component';

describe('BatchFileListComponent', () => {
  let component: BatchFileListComponent;
  let fixture: ComponentFixture<BatchFileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchFileListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
