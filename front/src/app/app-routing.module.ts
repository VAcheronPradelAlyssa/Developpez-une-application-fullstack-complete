import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register';
import { LoginComponent } from './pages/login/login';
import { PostComponent } from './pages/post/post';
import { Subject } from 'rxjs';
import { ListSubjectComponent } from './pages/list-subject/list-subject';
import { CreateSubjectComponent } from './pages/create-subject/create-subject';
import { CreatePostComponent } from './pages/create-post/create-post';
import { PostDetailComponent } from './pages/post-detail/post-detail';
import { LogoutComponent } from './pages/logout/logout';
import { UserProfileComponent } from './pages/user-profil/user-profil';
import { AuthGuard } from './guards/auth-guard';

// consider a guard combined with canLoad / canActivate route option
// to manage unauthenticated user to access private routes
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'post', component: PostComponent, canActivate: [AuthGuard] },
  { path: 'subject', component: ListSubjectComponent, canActivate: [AuthGuard] },
  { path: 'create-subject', component: CreateSubjectComponent, canActivate: [AuthGuard] },
  { path: 'create-post', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'post/:id', component: PostDetailComponent, canActivate: [AuthGuard] },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
