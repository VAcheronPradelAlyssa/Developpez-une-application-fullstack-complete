import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubjectService } from 'src/app/services/subject/subject';

@Component({
  selector: 'app-create-subject',
  templateUrl: './create-subject.html',
  styleUrl: './create-subject.scss',
  standalone: false,
})
export class CreateSubjectComponent {
  subjectForm: FormGroup;

  constructor(private fb: FormBuilder, private subjectService: SubjectService) {
    this.subjectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.subjectForm.valid) {
      this.subjectService.createSubject(this.subjectForm.value).subscribe({
        next: () => alert('Sujet créé !'),
        error: (err) => alert('Erreur lors de la création')
      });
    }
  }
}