import { TestBed } from '@angular/core/testing';

import { Disciplines } from './disciplines';

describe('Disciplines', () => {
  let service: Disciplines;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Disciplines);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
