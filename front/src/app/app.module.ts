import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './pages/login/login';
import { PostComponent } from './pages/post/post';
import { CreateSubjectComponent } from './pages/create-subject/create-subject';
import { ListSubjectComponent } from './pages/list-subject/list-subject';
import { CreatePostComponent } from './pages/create-post/create-post';
import { NavbarComponent } from './navbar/navbar';
import { PostDetailComponent } from './pages/post-detail/post-detail';
import { AuthInterceptor } from './services/auth/auth.interceptor';
import { LogoutComponent } from './pages/logout/logout';
import { UserProfileComponent } from './pages/user-profil/user-profil';

@NgModule({
  declarations: [AppComponent, HomeComponent, RegisterComponent, LoginComponent, PostComponent, CreateSubjectComponent, ListSubjectComponent, CreatePostComponent, NavbarComponent, PostDetailComponent, LogoutComponent, UserProfileComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
