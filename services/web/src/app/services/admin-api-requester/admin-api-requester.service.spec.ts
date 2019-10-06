import { TestBed } from '@angular/core/testing';

import { AdminApiRequesterService } from './admin-api-requester.service';

describe('AdminApiRequesterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminApiRequesterService = TestBed.get(AdminApiRequesterService);
    expect(service).toBeTruthy();
  });
});
