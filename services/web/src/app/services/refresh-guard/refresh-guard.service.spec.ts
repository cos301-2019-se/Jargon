import { TestBed } from '@angular/core/testing';

import { RefreshGuardService } from './refresh-guard.service';

describe('RefreshGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RefreshGuardService = TestBed.get(RefreshGuardService);
    expect(service).toBeTruthy();
  });
});
