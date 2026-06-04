import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environment/environment';
import { Match } from '@/models/match.model';

@Injectable({ providedIn: 'root' })
export class MatchService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/matches`;

    getMatchesByPlayerId(playerId: string): Observable<Match[]> {
        console.log('Fetching Player Matches');
        return this.http.get<Match[]>(this.baseUrl+`/players/${playerId}`);
    }
}
