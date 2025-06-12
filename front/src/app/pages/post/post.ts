import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post.dto';
import { PostService } from 'src/app/services/posts/post';

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

  sortBy: string = 'desc'; // valeur par défaut : du plus récent au plus ancien

  constructor(
    private postService: PostService,
    private router: Router // <-- Ajoute ceci
  ) {}

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


toggleSort() {
  this.sortBy = this.sortBy === 'desc' ? 'asc' : 'desc';
  this.sortPosts();
}

sortPosts() {
  if (this.sortBy === 'desc') {
    this.posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else {
    this.posts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
}

  onSortChange() {
    this.sortPosts();
  }

  goToPost(id: number) {
    this.router.navigate(['/post', id]);
  }
}