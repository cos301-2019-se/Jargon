import { TestBed } from '@angular/core/testing';

import { SharedAdminService } from './shared-admin.service';

describe('SharedAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedAdminService = TestBed.get(SharedAdminService);
    expect(service).toBeTruthy();
  });
});
