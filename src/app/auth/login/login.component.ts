import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Subscription } from 'rxjs';
import { AuthData } from '../auth-data.model'
import { AuthService } from '../auth.service';


@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
	isLoading = false;
	private authStatusSub: Subscription;

	constructor(private authService: AuthService ) {}

	ngOnInit() {
		this.authStatusSub = this.authService.authStatusListener.subscribe(authStatus => {
			this.isLoading = false;
		})
	}

	onLogin = (form: NgForm) =>{
		this.isLoading = true;
		const userToBeChecked: AuthData = {email: form.value.email, password: form.value.password}
		this.authService.login(userToBeChecked)
	}

	ngOnDestroy() {
		this.authStatusSub.unsubscribe();
	}

}