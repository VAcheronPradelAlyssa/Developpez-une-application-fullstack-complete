import { Component, OnInit } from '@angular/core';
import { Post, PostService } from 'src/app/services/post';

@Component({
  selector: 'app-posts',
  templateUrl: './post.html',
  styleUrls: ['./post.scss'],
  standalone: false,
})
export class PostComponent implements OnInit {
  posts: Post[] = [];
  loading = true;
  error = '';

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des articles';
        this.loading = false;
      }
    });
  }
}