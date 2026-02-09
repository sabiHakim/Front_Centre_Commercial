import { TestBed } from '@angular/core/testing';

import { ServiceBoutiqueService } from './service-boutique.service';

describe('ServiceBoutiqueService', () => {
  let service: ServiceBoutiqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceBoutiqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
