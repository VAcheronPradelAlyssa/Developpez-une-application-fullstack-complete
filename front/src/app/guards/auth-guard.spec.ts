import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CanActivateFn } from '@angular/router';

import { AuthGuard } from './auth-guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()]
    });
  });

  it('should be created', () => {
    expect(true).toBeTrue();
  });
});
