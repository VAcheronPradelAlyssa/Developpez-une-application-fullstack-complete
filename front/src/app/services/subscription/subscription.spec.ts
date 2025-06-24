import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SubscriptionService } from './subscription';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SubscriptionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('doit abonner à un sujet', () => {
    service.subscribe(42).subscribe(resp => {
      expect(resp).toBeNull();
    });
    const req = httpMock.expectOne('/api/subscriptions/42');
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(null);
  });

  it('doit désabonner d\'un sujet', () => {
    service.unsubscribe(42).subscribe(resp => {
      expect(resp).toBeNull();
    });
    const req = httpMock.expectOne('/api/subscriptions/42');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(null);
  });

  it('doit récupérer les abonnements utilisateur', () => {
    const mockIds = [1, 2];
    service.getUserSubscriptions().subscribe(ids => {
      expect(ids).toEqual(mockIds);
    });
    const req = httpMock.expectOne('/api/subscriptions');
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockIds);
  });
});
