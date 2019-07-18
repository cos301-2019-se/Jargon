import { TestBed } from '@angular/core/testing';

import { FlaggerApiRequesterService } from './flagger-api-requester.service';

describe('FlaggerApiRequesterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlaggerApiRequesterService = TestBed.get(FlaggerApiRequesterService);
    expect(service).toBeTruthy();
  });
});
