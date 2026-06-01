import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environment/environment';
import { Tournament, CreateTournamentPayload } from '@/models/tournament.model';

@Injectable({ providedIn: 'root' })
export class TournamentService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/tournaments`;

    getTournaments(): Observable<Tournament[]> {
        console.log('Fetching Tournaments');
        return this.http.get<Tournament[]>(this.baseUrl);
    }

    getTournamentById(id: string): Observable<Tournament> {
        return this.http.get<Tournament>(`${this.baseUrl}/${id}`);
    }

    createTournament(payload: CreateTournamentPayload): Observable<Tournament> {
        return this.http.post<Tournament>(`${this.baseUrl}/create`, payload);
    }

    updateTournament(id: string, payload: Partial<CreateTournamentPayload>): Observable<Tournament> {
        return this.http.patch<Tournament>(`${this.baseUrl}/${id}`, payload);
    }

    updateTournamentStatus(id: string, status: string): Observable<Tournament> {
        return this.http.patch<Tournament>(`${this.baseUrl}/${id}/status`, { status });
    }

    deleteTournament(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    getTournamentPlayers(id: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/${id}/players`);
    }

    getTournamentMatches(id: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/${id}/matches`);
    }
}
