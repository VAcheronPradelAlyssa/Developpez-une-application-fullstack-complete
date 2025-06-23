import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SubjectService } from './subject';
import { SubjectDTO } from 'src/app/models/subject.dto';

describe('SubjectService', () => {
  let service: SubjectService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SubjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('doit récupérer tous les sujets', () => {
    const mockSubjects: SubjectDTO[] = [{ id: 1, name: 'Sujet', description: 'desc' }];
    service.getAllSubjects().subscribe(subjects => {
      expect(subjects).toEqual(mockSubjects);
    });
    const req = httpMock.expectOne('/api/subjects');
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockSubjects);
  });

  it('doit créer un sujet', () => {
    const newSubject: SubjectDTO = { id: 0, name: 'Sujet', description: 'desc' };
    const created: SubjectDTO = { id: 1, name: 'Sujet', description: 'desc' };
    service.createSubject(newSubject).subscribe(subject => {
      expect(subject).toEqual(created);
    });
    const req = httpMock.expectOne('/api/subjects');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newSubject);
    expect(req.request.withCredentials).toBeTrue();
    req.flush(created);
  });

  it('doit récupérer un sujet par id', () => {
    const subject: SubjectDTO = { id: 1, name: 'Sujet', description: 'desc' };
    service.getSubjectById(1).subscribe(result => {
      expect(result).toEqual(subject);
    });
    const req = httpMock.expectOne('/api/subjects/1');
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(subject);
  });
});
