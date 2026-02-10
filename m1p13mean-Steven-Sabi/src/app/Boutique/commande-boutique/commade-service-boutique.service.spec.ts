import { TestBed } from '@angular/core/testing';

import { CommadeServiceBoutiqueService } from './commade-service-boutique.service';

describe('CommadeServiceBoutiqueService', () => {
  let service: CommadeServiceBoutiqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommadeServiceBoutiqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
