import { TestBed } from '@angular/core/testing';

import { Semesters } from './semesters';

describe('Semesters', () => {
  let service: Semesters;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Semesters);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
