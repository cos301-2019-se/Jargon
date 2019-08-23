import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCompareComponent } from './project-compare.component';

describe('ProjectCompareComponent', () => {
  let component: ProjectCompareComponent;
  let fixture: ComponentFixture<ProjectCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
