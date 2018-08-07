import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AngularMaterialModule } from '../angular-material.angular';
// Routing 
import { AuthRoutingMolude } from './auth-routing.module';


@NgModule({
	declarations: [
		LoginComponent,
		SignupComponent,
	],
	imports: [
		CommonModule,
		AuthRoutingMolude,
		AngularMaterialModule,
		FormsModule
	]
})
export class AuthModule {}