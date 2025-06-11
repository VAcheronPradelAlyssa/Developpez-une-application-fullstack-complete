import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubjectDTO } from 'src/app/models/subject.dto';

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private apiUrl = '/api/subjects';

  constructor(private http: HttpClient) {}

  getAllSubjects(): Observable<SubjectDTO[]> {
    return this.http.get<SubjectDTO[]>(this.apiUrl);
  }

  createSubject(subject: SubjectDTO): Observable<SubjectDTO> {
    return this.http.post<SubjectDTO>(this.apiUrl, subject);
  }

  getSubjectById(id: number): Observable<SubjectDTO> {
    return this.http.get<SubjectDTO>(`${this.apiUrl}/${id}`);
  }
}