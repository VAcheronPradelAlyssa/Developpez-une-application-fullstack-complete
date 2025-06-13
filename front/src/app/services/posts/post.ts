import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostCreateDTO } from 'src/app/models/post-create.dto';

export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: { username: string };
  subject: { name: string };
}

@Injectable({ providedIn: 'root' })
export class PostService {
  private apiUrl = 'http://localhost:8080/api/posts';

  constructor(private http: HttpClient) {}

  createPost(post: PostCreateDTO): Observable<any> {
    return this.http.post(this.apiUrl, post);
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  getComments(postId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${postId}/comments`);
  }

  addComment(postId: number, comment: { content: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${postId}/comments`, comment);
  }
}