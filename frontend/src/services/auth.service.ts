import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private router = inject(Router);

    setToken(token: string): void {
        localStorage.setItem('token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
        const token = this.getToken();
        return !!token;
    }

    getUserRole(): string | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const decodedToken = jwtDecode<{role:string}>(token);
            return decodedToken.role || null
        } catch (e) {
            console.log('Could not decode token ',e)
            return null
        }
    }

    logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/auth']);
    }
}
