import { Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { DatePipe, NgClass, NgForOf } from '@angular/common';
import { SelectButton } from 'primeng/selectbutton';
import { Tag } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { TournamentService } from '@/services/tournament.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Tournament } from '@/models/tournament.model';
import {Router} from "@angular/router";


@Component({
    selector: 'app-tournaments-directory',
    imports: [Button, DataView, SelectButton, Tag, FormsModule, NgClass, DatePipe],
    templateUrl: './tournaments-directory.component.html',
    styleUrl: './tournaments-directory.component.scss'
})
export class TournamentsDirectory {
    layout: 'list' | 'grid' = 'list';
    options = ['list', 'grid'];

    private tournamentService = inject(TournamentService);
    private router = inject(Router);

    tournaments = toSignal(this.tournamentService.getTournaments(), { initialValue: [] as Tournament[] });

    getStatus(tournament: Tournament) {
        switch (tournament.status) {
            case 'active':
                return 'success';
            case 'completed':
                return 'info';
            default:
                return 'info';
        }
    }

    onTournamentClick(tournamentId: string) {
        this.router.navigate(['dashboard/tournaments/', tournamentId]);
    }

    onDelete(tournamentId: string) {
        this.tournamentService.deleteTournament(tournamentId);
    }
}
