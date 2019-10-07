import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageProjectInfoComponent } from './admin-manage-project-info.component';

describe('AdminManageProjectInfoComponent', () => {
  let component: AdminManageProjectInfoComponent;
  let fixture: ComponentFixture<AdminManageProjectInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminManageProjectInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageProjectInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
