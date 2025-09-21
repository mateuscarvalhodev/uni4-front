import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemestersList } from './semesters-list';

describe('SemestersList', () => {
  let component: SemestersList;
  let fixture: ComponentFixture<SemestersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemestersList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SemestersList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
