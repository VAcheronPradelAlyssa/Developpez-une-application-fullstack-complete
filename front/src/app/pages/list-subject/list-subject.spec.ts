import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CardComponent } from 'src/app/shared/card/card';

import { ListSubjectComponent } from './list-subject';

describe('ListSubjectComponent', () => {
  let component: ListSubjectComponent;
  let fixture: ComponentFixture<ListSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ListSubjectComponent,
        CardComponent
      ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
