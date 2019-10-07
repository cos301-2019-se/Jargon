import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNeuralNetworkComponent } from './admin-neural-network.component';

describe('AdminNeuralNetworkComponent', () => {
  let component: AdminNeuralNetworkComponent;
  let fixture: ComponentFixture<AdminNeuralNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNeuralNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNeuralNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
