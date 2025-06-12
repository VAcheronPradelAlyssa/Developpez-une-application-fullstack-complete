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
  filteredSubjects: SubjectDTO[] = [];
  showSubjectOptions = false;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private subjectService: SubjectService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      subjectName: ['', Validators.required], // utilisé pour l’autocomplete
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.subjectService.getAllSubjects().subscribe({
      next: (data) => {
        this.subjects = data;
        this.filteredSubjects = data;
      },
      error: () => alert('Erreur lors du chargement des sujets')
    });
  }

  onSubjectInput() {
    const value = this.postForm.value.subjectName?.toLowerCase() || '';
    this.filteredSubjects = this.subjects.filter(s => s.name.toLowerCase().includes(value));
    this.showSubjectOptions = true;
  }

  selectSubject(subject: SubjectDTO) {
    this.postForm.patchValue({subjectName: subject.name});
    this.showSubjectOptions = false;
  }

  hideSubjectOptions() {
    setTimeout(() => this.showSubjectOptions = false, 180);
  }

  onSubmit() {
    if (this.postForm.valid) {
      const subject = this.subjects.find(s => s.name === this.postForm.value.subjectName);
      if (!subject) return alert('Veuillez sélectionner un thème valide.');

      const payload = {
        title: this.postForm.value.title,
        content: this.postForm.value.content,
        subjectId: subject.id
      };
      this.postService.createPost(payload).subscribe({
        next: () => {
          alert('Article créé !');
          this.router.navigate(['/post']);
        },
        error: () => alert('Erreur lors de la création de l\'article')
      });
    }
  }
}