import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/posts/post';
import { Location } from '@angular/common';


@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.html',
  styleUrls: ['./post-detail.scss'],
  standalone: false,
})
export class PostDetailComponent implements OnInit {
  post: any;
  comments: any[] = [];
  newComment: string = '';
  loading = true;

  // Id de l'utilisateur connecté (à adapter selon ton auth)
  userId: number = 1;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private location: Location
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.postService.getPosts().subscribe(posts => {
      this.post = posts.find((p: any) => p.id === id);
      this.loading = false;
    });
    this.loadComments(id);
  }

  loadComments(id: number) {
    this.postService.getComments(id).subscribe(comments => {
      this.comments = comments;
    });
  }

  addComment() {
    if (!this.newComment.trim()) return;
    this.postService.addComment(this.post.id, {
      content: this.newComment
    }).subscribe(() => {
      this.newComment = '';
      this.loadComments(this.post.id);
    });
  }
  goBack() {
  this.location.back();
  }
}