import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplinesForm } from './disciplines-form';

describe('DisciplinesForm', () => {
  let component: DisciplinesForm;
  let fixture: ComponentFixture<DisciplinesForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisciplinesForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisciplinesForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
