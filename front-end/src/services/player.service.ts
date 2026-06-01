import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environment/environment';
import { Player } from '@/models/player.model';

@Injectable({ providedIn: 'root' })
export class PlayerService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/players`;

    getPlayers(): Observable<Player[]> {
        console.log('Fetching Players Directory');
        return this.http.get<Player[]>(this.baseUrl);
    }

    getPlayerById(playerId:string): Observable<Player>
    {
        console.log('Fetching Player By ID')
        return this.http.get<Player>(this.baseUrl+`/${playerId}`);
    }
}
