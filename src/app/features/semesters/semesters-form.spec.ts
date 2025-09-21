import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemestersForm } from './semesters-form';

describe('SemestersForm', () => {
  let component: SemestersForm;
  let fixture: ComponentFixture<SemestersForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemestersForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SemestersForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
