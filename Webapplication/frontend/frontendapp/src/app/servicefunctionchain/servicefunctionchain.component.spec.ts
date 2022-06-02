import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicefunctionchainComponent } from './servicefunctionchain.component';

describe('ServicefunctionchainComponent', () => {
  let component: ServicefunctionchainComponent;
  let fixture: ComponentFixture<ServicefunctionchainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicefunctionchainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicefunctionchainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
