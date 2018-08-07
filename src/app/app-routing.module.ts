import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGurad } from './auth/auth.guard';


const AppRoutes: Routes = [
		{ path: '', component: PostListComponent },
		{ path: 'create', component: PostCreateComponent, canActivate:[ AuthGurad] },
		{ path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGurad] },
		{ path: 'login', component: LoginComponent },
		{ path: 'signup', component: SignupComponent }
	]

@NgModule({
	imports: [RouterModule.forRoot(AppRoutes)],
	exports: [RouterModule],
	providers: [AuthGurad]
})


export class AppRoutingModule {}