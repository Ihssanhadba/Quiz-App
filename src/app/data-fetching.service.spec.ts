import { TestBed } from '@angular/core/testing';

import { DataFetchingService } from './data-fetching.service';

describe('DataFetchingService', () => {
  let service: DataFetchingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataFetchingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
