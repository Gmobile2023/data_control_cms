import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchingLogsComponent } from './matching-logs.component';

describe('MatchingLogsComponent', () => {
  let component: MatchingLogsComponent;
  let fixture: ComponentFixture<MatchingLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchingLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchingLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
