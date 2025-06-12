import { TestBed } from '@angular/core/testing';

import { UserProfil } from './user-profil';

describe('UserProfil', () => {
  let service: UserProfil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserProfil);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
