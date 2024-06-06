import { TestBed } from '@angular/core/testing';

import { InteractorService } from './interactor.service';

describe('InteractorService', () => {
  let service: InteractorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteractorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
