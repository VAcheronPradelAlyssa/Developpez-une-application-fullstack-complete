import { Component, OnInit } from '@angular/core';
import { SubjectDTO } from '../../models/subject.dto';
import { SubjectService } from 'src/app/services/subject/subject';

@Component({
  selector: 'app-list-subject',
  templateUrl: './list-subject.html',
  styleUrls: ['./list-subject.scss'],
  standalone: false,
})
export class ListSubjectComponent implements OnInit {
  subjects: SubjectDTO[] = [];

  constructor(private subjectService: SubjectService) {}

  ngOnInit() {
    this.subjectService.getAllSubjects().subscribe({
      next: (data) => this.subjects = data,
      error: () => alert('Erreur lors du chargement des sujets')
    });
  }
}