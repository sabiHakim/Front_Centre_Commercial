import { TestBed } from '@angular/core/testing';

import { CommandeclientServiceService } from './commandeclient-service.service';

describe('CommandeclientServiceService', () => {
  let service: CommandeclientServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandeclientServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
