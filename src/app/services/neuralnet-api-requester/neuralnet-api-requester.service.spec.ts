import { TestBed } from '@angular/core/testing';

import { NeuralnetApiRequesterService } from './neuralnet-api-requester.service';

describe('NeuralnetApiRequesterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NeuralnetApiRequesterService = TestBed.get(NeuralnetApiRequesterService);
    expect(service).toBeTruthy();
  });
});
