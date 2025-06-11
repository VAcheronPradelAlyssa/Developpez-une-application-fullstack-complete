import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostCreateDTO } from 'src/app/models/post-create.dto';

@Injectable({ providedIn: 'root' })
export class PostService {
  private apiUrl = '/api/posts';

  constructor(private http: HttpClient) {}

  createPost(post: PostCreateDTO): Observable<any> {
    return this.http.post(this.apiUrl, post);
  }
}