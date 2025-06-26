import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClientXsrfModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login';
import { PostComponent } from './pages/post/post';
import { CreateSubjectComponent } from './pages/create-subject/create-subject';
import { ListSubjectComponent } from './pages/list-subject/list-subject';
import { CreatePostComponent } from './pages/create-post/create-post';
import { NavbarComponent } from './navbar/navbar';
import { PostDetailComponent } from './pages/post-detail/post-detail';
import { LogoutComponent } from './pages/logout/logout';
import { UserProfileComponent } from './pages/user-profil/user-profil';
import { BoutonRetourComponent } from './shared/bouton-retour/bouton-retour';
import { PasswordFieldComponent } from './shared/password-field/password-field';
import { CardComponent } from './shared/card/card';
import { NotFoundComponent } from './pages/not-found/not-found.component';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// Error Interceptor
import { ErrorInterceptor } from './interceptors/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    PasswordFieldComponent,
    PostComponent,
    CreateSubjectComponent,
    ListSubjectComponent,
    CreatePostComponent,
    NavbarComponent,
    PostDetailComponent,
    LogoutComponent,
    UserProfileComponent,
    BoutonRetourComponent,
    CardComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatAutocompleteModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN'
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
