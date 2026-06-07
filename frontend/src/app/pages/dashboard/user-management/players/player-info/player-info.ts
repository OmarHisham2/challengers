import { Component, computed, inject, input, signal,  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { finalize, switchMap } from 'rxjs';
import { Breadcrumb } from 'primeng/breadcrumb';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Player } from '@/models/player.model';
import { Button, ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { Match } from '@/models/match.model';
import { MatchService } from '@/services/match.service';
import { Tag } from 'primeng/tag';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-player-info',
    imports: [FormsModule, Breadcrumb, IconFieldModule, InputIconModule, ButtonDirective, Ripple, TableModule, Tag, Button, NgOptimizedImage],
    templateUrl: './player-info.html',
    providers: [MatchService]
})
export class PlayerInfo {
    player = input.required<Player>();
    matchService = inject(MatchService);

    playerMatches = toSignal(
        toObservable(this.player).pipe(
            switchMap((player) => this.matchService.getMatchesByPlayerId(player._id)),
            finalize(() => {
                console.log('matches fetched.');
            })
        ),
        { initialValue: [] as Match[] }
    );

    getStatusColor(status: string) {
        console.log(this.player)
        switch (status.toLowerCase()) {
            case 'active':
                return 'success';
            case 'suspended':
                return 'danger';
            case 'inactive':
                return 'warn';
            default:
                return 'info';
        }
    }
    calculateWinRate(wins: number, losses: number): number {
        const total = wins + losses;
        if (total === 0) return 0;
        return Math.round((wins / total) * 100);
    }
}
