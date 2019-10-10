import { TestBed } from '@angular/core/testing';

import { AnalyseApiRequesterService } from './analyse-api-requester.service';

describe('AnalyseApiRequesterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnalyseApiRequesterService = TestBed.get(AnalyseApiRequesterService);
    expect(service).toBeTruthy();
  });
});
