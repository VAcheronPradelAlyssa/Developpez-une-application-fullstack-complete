import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { PasswordFieldComponent } from './password-field';

describe('PasswordFieldComponent', () => {
  let component: PasswordFieldComponent;
  let fixture: ComponentFixture<PasswordFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordFieldComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordFieldComponent);
    component = fixture.componentInstance;
    component.control = new FormControl('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('affiche le champ input de type password par défaut', () => {
    const input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeTruthy();
    expect(input.attributes['type']).toBe('password');
  });

  it('affiche le champ input de type text quand showPassword est true', () => {
    component.showPassword = true;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.attributes['type']).toBe('text');
  });

  it('change showPassword au clic sur le bouton', () => {
    const btn = fixture.debugElement.query(By.css('button.toggle-password-btn'));
    expect(component.showPassword).toBeFalse();
    btn.triggerEventHandler('click');
    fixture.detectChanges();
    expect(component.showPassword).toBeTrue();
    btn.triggerEventHandler('click');
    fixture.detectChanges();
    expect(component.showPassword).toBeFalse();
  });

  it('émet focus et blur', () => {
    spyOn(component.focus, 'emit');
    spyOn(component.blur, 'emit');
    const input = fixture.debugElement.query(By.css('input'));
    input.triggerEventHandler('focus');
    expect(component.focus.emit).toHaveBeenCalled();
    input.triggerEventHandler('blur');
    expect(component.blur.emit).toHaveBeenCalled();
  });

  it('affiche le placeholder personnalisé', () => {
    component.placeholder = 'Mon mot de passe';
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.attributes['placeholder']).toBe('Mon mot de passe');
  });

  it('le bouton a l\'icône correcte selon showPassword', () => {
    component.showPassword = false;
    fixture.detectChanges();
    let icon = fixture.debugElement.query(By.css('.material-icons')).nativeElement.textContent.trim();
    expect(icon).toBe('visibility');
    component.showPassword = true;
    fixture.detectChanges();
    icon = fixture.debugElement.query(By.css('.material-icons')).nativeElement.textContent.trim();
    expect(icon).toBe('visibility_off');
  });
});
