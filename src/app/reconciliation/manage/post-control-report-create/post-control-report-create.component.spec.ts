import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostControlReportCreateComponent } from './post-control-report-create.component';

describe('PostControlReportCreateComponent', () => {
  let component: PostControlReportCreateComponent;
  let fixture: ComponentFixture<PostControlReportCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostControlReportCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostControlReportCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
