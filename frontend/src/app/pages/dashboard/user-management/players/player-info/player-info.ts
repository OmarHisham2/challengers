import { Component, computed, inject, input, signal,  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '@/services/player.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { finalize, switchMap } from 'rxjs';
import { Breadcrumb } from 'primeng/breadcrumb';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Player } from '@/models/player.model';
import { ButtonDirective } from 'primeng/button';
import { CurrencyPipe } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { Match } from '@/models/match.model';
import { MatchService } from '@/services/match.service';

@Component({
    selector: 'app-player-info',
    imports: [FormsModule, Breadcrumb, IconFieldModule, InputIconModule, ButtonDirective, Ripple, TableModule],
    templateUrl: './player-info.html',
    providers: [MatchService]
})
export class PlayerInfo {
    playerId = input.required<string>();

    private playerService = inject(PlayerService);
    matchService = inject(MatchService);

    playerData = toSignal(toObservable(this.playerId).pipe(switchMap((id) => this.playerService.getPlayerById(id))), {
        initialValue: {} as Player
    });

    playerMatches = toSignal(
        toObservable(this.playerId).pipe(
            switchMap((id) => this.matchService.getMatchesByPlayerId(id)),
            finalize(() => {
                console.log('matches fetched.');
            })
        ),
        { initialValue: [] as Match[] }
    );

    matches = signal<Match[]>([]);

    breadcrumbItems = computed(() => {
        const player = this.playerData();
        return [{ label: 'Players', routerLink: '../' }, { label: player ? player.name : 'Loading...' }];
    });
}
