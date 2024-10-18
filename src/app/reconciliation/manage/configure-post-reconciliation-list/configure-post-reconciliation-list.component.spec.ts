import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurePostReconciliationListComponent } from './configure-post-reconciliation-list.component';

describe('ConfigurePostReconciliationListComponent', () => {
  let component: ConfigurePostReconciliationListComponent;
  let fixture: ComponentFixture<ConfigurePostReconciliationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurePostReconciliationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurePostReconciliationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
