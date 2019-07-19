import { TestBed } from '@angular/core/testing';

import { SharedProjectService } from './shared-project.service';

describe('SharedProjectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedProjectService = TestBed.get(SharedProjectService);
    expect(service).toBeTruthy();
  });
});
