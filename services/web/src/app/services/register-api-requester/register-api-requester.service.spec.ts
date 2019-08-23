import { TestBed } from '@angular/core/testing';

import { RegisterApiRequesterService } from './register-api-requester.service';

describe('RegisterApiRequesterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegisterApiRequesterService = TestBed.get(RegisterApiRequesterService);
    expect(service).toBeTruthy();
  });
});
