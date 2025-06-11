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
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login';
import { PostComponent } from './pages/post/post';
import { CreateSubjectComponent } from './pages/create-subject/create-subject';
import { ListSubjectComponent } from './pages/list-subject/list-subject';
import { CreatePostComponent } from './pages/create-post/create-post';
import { NavbarComponent } from './navbar/navbar';

@NgModule({
  declarations: [AppComponent, HomeComponent, RegisterComponent, LoginComponent, PostComponent, CreateSubjectComponent, ListSubjectComponent, CreatePostComponent, NavbarComponent],
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
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
