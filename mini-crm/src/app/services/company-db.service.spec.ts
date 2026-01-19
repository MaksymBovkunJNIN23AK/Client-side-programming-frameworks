import { TestBed } from '@angular/core/testing';

import { CompanyDbService } from './company-db.service';

describe('CompanyDbService', () => {
  let service: CompanyDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
