import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { UserProfileComponent } from './user-profil';
import { CardComponent } from 'src/app/shared/card/card';
import { UserService, UserProfile, Subscription } from 'src/app/services/user/user-profil';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockProfile: UserProfile = { id: 1, username: 'user', email: 'user@test.com', password: '' };
  const mockSubs: Subscription[] = [
    { id: 1, subjectId: 1, subjectName: 'Sujet', description: 'desc', subscribedAt: '2024-06-24T10:00:00Z' }
  ];

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', [
      'getProfile',
      'updateProfile',
      'getSubscriptions',
      'unsubscribe'
    ]);
    // Mock getProfile et getSubscriptions pour tous les tests pour éviter l'erreur lors de ngOnInit
    userServiceSpy.getProfile.and.returnValue(of(mockProfile));
    userServiceSpy.getSubscriptions.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [
        UserProfileComponent,
        CardComponent
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('charge le profil utilisateur au démarrage', fakeAsync(() => {
    userServiceSpy.getProfile.and.returnValue(of(mockProfile));
    component.loadProfile();
    tick();
    expect(component.user.username).toBe('user');
    expect(component.loading).toBeFalse();
  }));

  it('affiche une erreur si le chargement du profil échoue', fakeAsync(() => {
    userServiceSpy.getProfile.and.returnValue(throwError(() => new Error('fail')));
    component.loadProfile();
    tick();
    expect(component.error).toContain('Impossible de charger le profil');
    expect(component.loading).toBeFalse();
  }));

  it('charge les abonnements au démarrage', fakeAsync(() => {
    userServiceSpy.getSubscriptions.and.returnValue(of(mockSubs));
    component.loadSubscriptions();
    tick();
    expect(component.subscriptions.length).toBe(1);
    expect(component.subscriptions[0].subjectName).toBe('Sujet');
  }));

  it('affiche une erreur si le chargement des abonnements échoue', fakeAsync(() => {
    userServiceSpy.getSubscriptions.and.returnValue(throwError(() => new Error('fail')));
    component.loadSubscriptions();
    tick();
    expect(component.error).toContain('Impossible de charger les abonnements');
  }));

  it('saveProfile appelle le service et affiche le succès', fakeAsync(() => {
    userServiceSpy.updateProfile.and.returnValue(of({ ...mockProfile, username: 'modif' }));
    component.user = { ...mockProfile, username: 'modif' };
    component.saveProfile();
    tick();
    expect(userServiceSpy.updateProfile).toHaveBeenCalledWith({ username: 'modif', email: 'user@test.com' });
    expect(component.success).toBe('Profil mis à jour !');
    expect(component.saving).toBeFalse();
    expect(component.user.password).toBe('');
  }));

  it('saveProfile affiche une erreur si update échoue', fakeAsync(() => {
    userServiceSpy.updateProfile.and.returnValue(throwError(() => new Error('fail')));
    component.user = { ...mockProfile, username: 'fail' };
    component.saveProfile();
    tick();
    expect(component.error).toBe('Erreur lors de la mise à jour.');
    expect(component.saving).toBeFalse();
  }));

  it('unsubscribe retire le sujet de la liste si succès', fakeAsync(() => {
    userServiceSpy.unsubscribe.and.returnValue(of(void 0));
    component.subscriptions = [...mockSubs];
    component.unsubscribe(1);
    tick();
    expect(component.subscriptions.length).toBe(0);
  }));

  it('unsubscribe affiche une erreur si échec', fakeAsync(() => {
    userServiceSpy.unsubscribe.and.returnValue(throwError(() => new Error('fail')));
    component.subscriptions = [...mockSubs];
    component.unsubscribe(1);
    tick();
    expect(component.error).toBe('Erreur lors du désabonnement.');
  }));
});
