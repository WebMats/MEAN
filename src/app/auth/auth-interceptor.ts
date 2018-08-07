import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	constructor(private authService: AuthService ) {}

	intercept(req: HttpRequest<any>, next: HttpHandler) {
		const clientToken = this.authService.getUser().token;
		if ( clientToken ){
			const authRequest = req.clone({
				headers: req.headers.set("Authorization", `Bearer ${clientToken}`)
			})
			return next.handle(authRequest);
		}
		return next.handle(req);
	}

}