import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('doit appeler login', () => {
    const payload = { emailOrUsername: 'user', password: 'pass' };
    const mockResp = { token: 'abc' };
    service.login(payload).subscribe(resp => {
      expect(resp).toEqual(mockResp);
    });
    const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockResp);
  });

  it('doit appeler register', () => {
    const payload = { username: 'user', email: 'user@test.com', password: 'pass' };
    const mockResp = { message: 'ok' };
    service.register(payload).subscribe(resp => {
      expect(resp).toEqual(mockResp);
    });
    const req = httpMock.expectOne('http://localhost:8080/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockResp);
  });
});
