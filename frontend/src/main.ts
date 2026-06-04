import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@/services/auth.service';

export function authInterceptor(request:HttpRequest<unknown>,next:HttpHandlerFn)
{
    const authService = inject(AuthService)
    const token = authService.getToken();
    const newRequest = request.clone({
        headers: request.headers.set('Authorization',`Bearer ${token}`)
    })
    console.log(newRequest)
    return next(newRequest);
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
