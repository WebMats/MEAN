import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { AuthGurad } from './auth/auth.guard';


const AppRoutes: Routes = [
		{ path: '', component: PostListComponent },
		{ path: 'create', component: PostCreateComponent, canActivate:[ AuthGurad] },
		{ path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGurad] },
		{ path: 'auth', loadChildren: "./auth/auth.module#AuthModule" }
	]

@NgModule({
	imports: [RouterModule.forRoot(AppRoutes)],
	exports: [RouterModule],
	providers: [AuthGurad]
})


export class AppRoutingModule {}