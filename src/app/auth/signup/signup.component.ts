import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthData } from '../auth-data.model'
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';


@Component({
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
	isLoading = false;
	private authStatusSub: Subscription;

	constructor(private authService: AuthService ) {}

ngOnInit() {
	this.authStatusSub = this.authService.authStatusListener.subscribe(authStatus => {
		this.isLoading = false;
	})
}

	onSignup = (form: NgForm) =>{
		this.isLoading = true;
		const user: AuthData = {email: form.value.email, password: form.value.password}
		this.authService.createUser(user);
	}


	ngOnDestroy() {
		this.authStatusSub.unsubscribe();
	}

}