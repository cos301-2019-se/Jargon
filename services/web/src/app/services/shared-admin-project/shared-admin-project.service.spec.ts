import { TestBed } from '@angular/core/testing';

import { SharedAdminProjectService } from './shared-admin-project.service';

describe('SharedAdminProjectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedAdminProjectService = TestBed.get(SharedAdminProjectService);
    expect(service).toBeTruthy();
  });
});
