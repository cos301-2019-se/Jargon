import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageProjectsComponent } from './admin-manage-projects.component';

describe('AdminManageProjectsComponent', () => {
  let component: AdminManageProjectsComponent;
  let fixture: ComponentFixture<AdminManageProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminManageProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
