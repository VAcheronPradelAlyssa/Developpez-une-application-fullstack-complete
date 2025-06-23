import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ListSubjectComponent } from './list-subject';
import { CardComponent } from 'src/app/shared/card/card';
import { SubjectService } from 'src/app/services/subject/subject';
import { SubscriptionService } from 'src/app/services/subscription/subscription';

describe('ListSubjectComponent', () => {
  let component: ListSubjectComponent;
  let fixture: ComponentFixture<ListSubjectComponent>;
  let subjectServiceSpy: jasmine.SpyObj<SubjectService>;
  let subscriptionServiceSpy: jasmine.SpyObj<SubscriptionService>;

  const mockSubjects = [
    { id: 1, name: 'Sujet 1', description: 'Desc 1' },
    { id: 2, name: 'Sujet 2', description: 'Desc 2' }
  ];
  const mockSubs = [
    { subject: { id: 1 } },
    { subject: { id: 2 } }
  ];

  beforeEach(async () => {
    subjectServiceSpy = jasmine.createSpyObj('SubjectService', ['getAllSubjects']);
    subscriptionServiceSpy = jasmine.createSpyObj('SubscriptionService', ['getUserSubscriptions', 'subscribe', 'unsubscribe']);

    await TestBed.configureTestingModule({
      declarations: [ListSubjectComponent, CardComponent],
      providers: [
        { provide: SubjectService, useValue: subjectServiceSpy },
        { provide: SubscriptionService, useValue: subscriptionServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListSubjectComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('charge les sujets et les abonnements au démarrage', fakeAsync(() => {
    subjectServiceSpy.getAllSubjects.and.returnValue(of(mockSubjects));
    // Corrige ici : retourne un tableau d'ids (number[]) et non un tableau d'objets
    subscriptionServiceSpy.getUserSubscriptions.and.returnValue(of([1, 2]));
    fixture.detectChanges();
    tick();
    expect(component.subjects).toEqual(mockSubjects);
    expect(component.loading).toBeFalse();
    expect(component.subscribedIds).toEqual([1, 2]);
  }));

  it('affiche une erreur si le chargement des sujets échoue', fakeAsync(() => {
    subjectServiceSpy.getAllSubjects.and.returnValue(throwError(() => new Error('fail')));
    subscriptionServiceSpy.getUserSubscriptions.and.returnValue(of([]));
    fixture.detectChanges();
    tick();
    expect(component.error).toContain('Erreur lors du chargement');
    expect(component.loading).toBeFalse();
  }));

  it('charge les abonnements même si la récupération échoue', fakeAsync(() => {
    subjectServiceSpy.getAllSubjects.and.returnValue(of(mockSubjects));
    subscriptionServiceSpy.getUserSubscriptions.and.returnValue(throwError(() => new Error('fail')));
    fixture.detectChanges();
    tick();
    expect(component.subjects).toEqual(mockSubjects);
    expect(component.loading).toBeFalse();
    // Pas d'abonnements chargés
    expect(component.subscribedIds).toEqual([]);
  }));

  it('isSubscribed retourne true si abonné', () => {
    component.subscribedIds = [1, 2];
    expect(component.isSubscribed(1)).toBeTrue();
    expect(component.isSubscribed(2)).toBeTrue();
    expect(component.isSubscribed(3)).toBeFalse();
  });

  it('toggleSubscription appelle unsubscribe si déjà abonné', () => {
    component.subscribedIds = [1];
    subscriptionServiceSpy.unsubscribe.and.returnValue(of({}));
    spyOn(component, 'loadSubscriptions');
    component.toggleSubscription(1);
    expect(subscriptionServiceSpy.unsubscribe).toHaveBeenCalledWith(1);
    expect(component.loadSubscriptions).toHaveBeenCalled();
  });

  it('toggleSubscription appelle subscribe si non abonné', () => {
    component.subscribedIds = [];
    subscriptionServiceSpy.subscribe.and.returnValue(of({}));
    spyOn(component, 'loadSubscriptions');
    component.toggleSubscription(2);
    expect(subscriptionServiceSpy.subscribe).toHaveBeenCalledWith(2);
    expect(component.loadSubscriptions).toHaveBeenCalled();
  });

  it('toggleSubscription affiche une alerte en cas d\'erreur de désabonnement', () => {
    component.subscribedIds = [1];
    subscriptionServiceSpy.unsubscribe.and.returnValue(throwError(() => new Error('fail')));
    spyOn(window, 'alert');
    component.toggleSubscription(1);
    expect(window.alert).toHaveBeenCalledWith('Erreur lors de la désinscription');
  });

  it('toggleSubscription affiche une alerte en cas d\'erreur d\'abonnement', () => {
    component.subscribedIds = [];
    subscriptionServiceSpy.subscribe.and.returnValue(throwError(() => new Error('fail')));
    spyOn(window, 'alert');
    component.toggleSubscription(2);
    expect(window.alert).toHaveBeenCalledWith('Erreur lors de l\'abonnement');
  });
});
