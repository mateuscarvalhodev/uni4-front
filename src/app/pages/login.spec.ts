import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginPage } from './login';
import { AuthService } from '../core/auth/auth.service';

class AuthServiceMock {
  login = jasmine.createSpy('login').and.resolveTo(true);
}

describe('LoginPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage, ReactiveFormsModule],
      providers: [provideRouter([]), { provide: AuthService, useClass: AuthServiceMock }],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LoginPage);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });

  it('should be invalid when empty', () => {
    const fixture = TestBed.createComponent(LoginPage);
    const comp = fixture.componentInstance;
    expect(comp.form.invalid).toBeTrue();
  });

  it('should call auth.login on submit when valid', async () => {
    const fixture = TestBed.createComponent(LoginPage);
    const comp = fixture.componentInstance;
    const auth = TestBed.inject(AuthService) as unknown as AuthServiceMock;

    comp.form.setValue({ email: 'user@uni4.dev', password: '1234' });
    await comp.submit();

    expect(auth.login).toHaveBeenCalledWith('user@uni4.dev', '1234');
  });
});
