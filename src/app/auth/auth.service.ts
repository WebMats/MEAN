import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { AuthData } from './auth-data.model';
import { User } from './auth-data.model';


const API_URL = `${environment.apiUrl}/user`;

@Injectable({providedIn: 'root'})
export class AuthService {
	private user: User = {id: null, token: null}
	authStatusListener = new Subject<boolean>();
	tokenTimer: any;

constructor( private httpClient: HttpClient, private router: Router ) {}

	getUser = () => {
		return this.user;
	}

	getIsAuth = () => {
		return this.user.token !== null;
	}

	createUser = (authData: AuthData) => {
		this.httpClient.post<{id: string, token: string, expiresIn: number }>(`${API_URL}/signup`, authData).subscribe(response => {
			if (response.token) {
				const expiresInDuration = response.expiresIn;
				this.setAuthTimer(expiresInDuration)
				this.user = { id: response.id, token: response.token };
				this.authStatusListener.next(true);
				const now = new Date();
				const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
				this.saveAuthData(this.user.id, this.user.token, expirationDate)
				this.router.navigate(['/'])
			}
		}, err => {
			this.authStatusListener.next(false);
		})
	}

	login = (authData: AuthData) => {
		this.httpClient.post<{id: string, token: string, expiresIn: number }>(`${API_URL}/login`, authData).subscribe(response => {
			if (response.token) {
				const expiresInDuration = response.expiresIn;
				this.setAuthTimer(expiresInDuration)
				this.user = { id: response.id, token: response.token };
				this.authStatusListener.next(true);
				const now = new Date();
				const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
				this.saveAuthData(this.user.id, this.user.token, expirationDate)
				this.router.navigate(['/'])
			}
		}, err => {
			this.authStatusListener.next(false);
		})
	}

	logout = () => {
		this.user.token = null;
		this.user.id = null;
		this.authStatusListener.next(false)
		this.router.navigate(['/'])
		clearTimeout(this.tokenTimer);
		this.clearAuthData();
	}

	private setAuthTimer = (duration: number) => {
		this.tokenTimer = setTimeout(() => {this.logout()}, duration * 1000);
	}
	private saveAuthData = (id: string, token: string, expirationDate: Date) => {
		localStorage.setItem("token", token);
		localStorage.setItem("expiration", expirationDate.toISOString());
		localStorage.setItem("id", id);
	}
	private clearAuthData = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("expiration");
		localStorage.removeItem("id");
	}
	private getStoredAuthData = () => {
		const token = localStorage.getItem("token");
		const expirationDate = localStorage.getItem("expiration");
		const id = localStorage.getItem("id");
		if (!token && !expirationDate) {
			return;
		}
		return {
			token: token,
			expirationDate: new Date(expirationDate),
			id: id
		}
	}

	autoAuthUser = () => {
		const authInformation = this.getStoredAuthData()
		if (!authInformation) {
			return;
		}
		const now = new Date();
		const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
		if (expiresIn > 0) {
			this.user.id = authInformation.id,
			this.user.token = authInformation.token
			this.setAuthTimer(expiresIn / 1000);
			this.authStatusListener.next(true);
		}

	}


}