import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumBuilder } from './curriculum-builder';

describe('CurriculumBuilder', () => {
  let component: CurriculumBuilder;
  let fixture: ComponentFixture<CurriculumBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurriculumBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumBuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
