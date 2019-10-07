import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageProjectInitialComponent } from './admin-manage-project-initial.component';

describe('AdminManageProjectInitialComponent', () => {
  let component: AdminManageProjectInitialComponent;
  let fixture: ComponentFixture<AdminManageProjectInitialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminManageProjectInitialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageProjectInitialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
