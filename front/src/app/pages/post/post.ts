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
  error: string | null = null;

  sortBy: string = 'date'; // valeur par défaut

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
        this.sortPosts();
      },
      error: () => {
        this.error = 'Erreur lors du chargement des articles';
        this.loading = false;
      }
    });
  }

  sortPosts() {
    if (this.sortBy === 'date') {
      this.posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (this.sortBy === 'author') {
      this.posts.sort((a, b) => a.author.username.localeCompare(b.author.username));
    } else if (this.sortBy === 'subject') {
      this.posts.sort((a, b) => a.subject.name.localeCompare(b.subject.name));
    }
  }

  onSortChange() {
    this.sortPosts();
  }
}