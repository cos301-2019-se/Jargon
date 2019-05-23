import { TestBed } from '@angular/core/testing';

import { LoginApiRequesterService } from './login-api-requester.service';

describe('LoginApiRequesterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginApiRequesterService = TestBed.get(LoginApiRequesterService);
    expect(service).toBeTruthy();
  });
});
