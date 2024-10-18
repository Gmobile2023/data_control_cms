import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureDataCreateComponent } from './configure-data-create.component';

describe('ConfigureDataCreateComponent', () => {
  let component: ConfigureDataCreateComponent;
  let fixture: ComponentFixture<ConfigureDataCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureDataCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigureDataCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
