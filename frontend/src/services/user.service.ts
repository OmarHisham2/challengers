import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environment/environment';
import { User } from '@/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/users`;

    signIn(payload:{email:string,password:string}): Observable<User> {
        return this.http.post<User>(`${this.baseUrl}/signin`, payload);
    }
}
