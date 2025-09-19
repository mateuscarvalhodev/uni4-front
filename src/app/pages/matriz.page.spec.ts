import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizPage } from './matriz.page';

describe('MatrizPage', () => {
  let component: MatrizPage;
  let fixture: ComponentFixture<MatrizPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrizPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrizPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
