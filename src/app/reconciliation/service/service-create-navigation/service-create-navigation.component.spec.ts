import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCreateNavigationComponent } from './service-create-navigation.component';

describe('ServiceCreateNavigationComponent', () => {
  let component: ServiceCreateNavigationComponent;
  let fixture: ComponentFixture<ServiceCreateNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceCreateNavigationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceCreateNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
