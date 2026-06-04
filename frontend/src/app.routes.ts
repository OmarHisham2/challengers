import { CanMatchFn, RedirectCommand, Router, Routes } from '@angular/router';
import { Landing } from '@/app/pages/landing/landing';
import { Notfound } from '@/app/pages/notfound/notfound';
import { authRoutes } from '@/app/pages/auth/auth.routes';
import { AppLayout } from '@/app/layout/component/layout/app.layout';
import { dashboardRoutes } from '@/app/pages/pages.routes';
import { inject } from '@angular/core';
import { AuthService } from '@/services/auth.service';

const isLoggedIn: CanMatchFn = (route,segments) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const isLoggedIn = authService.isLoggedIn();
    if (isLoggedIn) return true;
    else return new RedirectCommand(router.parseUrl('/auth'));
}

const isAdmin: CanMatchFn = (route,segments) => {
    const router = inject(Router)
    const authService = inject(AuthService)
    const shouldGetAccess = authService.getUserRole() === 'admin';
    if(shouldGetAccess)
        return true;
    else
        return new RedirectCommand(router.parseUrl('/auth'))
}

export const appRoutes: Routes = [
    { path: '', component: Landing },
    { path: 'notfound', component: Notfound },

    { path: 'auth', children: authRoutes },

    { path: 'dashboard', component: AppLayout, children: dashboardRoutes,canMatch:[isLoggedIn,isAdmin] },
    { path: '**', redirectTo: '/notfound' }
];
