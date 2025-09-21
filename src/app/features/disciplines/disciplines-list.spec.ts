import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplinesList } from './disciplines-list';

describe('DisciplinesList', () => {
  let component: DisciplinesList;
  let fixture: ComponentFixture<DisciplinesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisciplinesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisciplinesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
