import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubjectDTO } from '../../models/subject.dto';
import { PostService } from 'src/app/services/posts/post';
import { SubjectService } from 'src/app/services/subject/subject';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.html',
  styleUrls: ['./create-post.scss'],
  standalone: false,
})
export class CreatePostComponent implements OnInit {
  postForm: FormGroup;
  subjects: SubjectDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private subjectService: SubjectService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      subjectId: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.subjectService.getAllSubjects().subscribe({
      next: (data) => this.subjects = data,
      error: () => alert('Erreur lors du chargement des sujets')
    });
  }

  onSubmit() {
    if (this.postForm.valid) {
      const authorId = 1; // À adapter selon ta logique d'utilisateur connecté
      const postRequest = { ...this.postForm.value, authorId };
      this.postService.createPost(postRequest).subscribe({
        next: () => {
          alert('Article créé !');
          this.router.navigate(['/post']); // Redirection après succès
        },
        error: () => alert('Erreur lors de la création de l\'article')
      });
    }
  }
}