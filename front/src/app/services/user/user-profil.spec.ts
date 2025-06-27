import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserService, UserProfile, Subscription } from './user-profil';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('doit récupérer le profil utilisateur', () => {
    const mockProfile: UserProfile = { id: 1, username: 'user', email: 'user@test.com' };
    service.getProfile().subscribe(profile => {
      expect(profile).toEqual(mockProfile);
    });
    const req = httpMock.expectOne('/api/user/profile');
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockProfile);
  });

  it('doit mettre à jour le profil utilisateur', () => {
    const updateData = { username: 'newuser' };
    const mockProfile: UserProfile = { id: 1, username: 'newuser', email: 'user@test.com' };
    service.updateProfile(updateData).subscribe(profile => {
      expect(profile).toEqual(mockProfile);
    });
    const req = httpMock.expectOne('/api/user/profile');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockProfile);
  });

  it('doit récupérer les abonnements', () => {
    const mockSubs: Subscription[] = [
      { id: 1, subjectId: 1, subjectName: 'Sujet', description: 'desc', subscribedAt: '2024-01-01' }
    ];
    service.getSubscriptions().subscribe(subs => {
      expect(subs).toEqual(mockSubs);
    });
    const req = httpMock.expectOne('/api/user/subscriptions');
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockSubs);
  });

  it('doit se désabonner d\'un sujet', () => {
    service.unsubscribe(42).subscribe(resp => {
      expect(resp).toBeNull(); // Un DELETE retourne null (pas undefined)
    });
    const req = httpMock.expectOne('/api/user/subscriptions/42');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(null);
  });
});
