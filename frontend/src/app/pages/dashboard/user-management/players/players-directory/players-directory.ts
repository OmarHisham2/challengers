import { Component, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputText} from "primeng/inputtext";
import { Table, TableModule } from 'primeng/table';
import {Tag} from "primeng/tag";
import { PlayerService } from '@/services/player.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Player } from '@/models/player.model';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-players-directory',
    imports: [ButtonDirective, IconField, InputIcon, InputText, TableModule, Tag, FormsModule],
    templateUrl: './players-directory.html',
    styleUrl: './players-directory.scss'
})
export class PlayersDirectory {
    private playerService = inject(PlayerService);
    isLoading = signal(true);
    private router = inject(Router);
    players = toSignal(
        this.playerService.getPlayers().pipe(
            finalize(() => {
                this.isLoading.set(false);
            })
        ),
        { initialValue: [] as Player[] }
    );

    // idk what these are --

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
    statuses: any[] = [];
    @ViewChild('filter') filter!: ElementRef;

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    // idk what these are --

    onPlayerClick(player: Player) {
        console.log(player)
        this.router.navigate(['dashboard/players/', player._id],{ state: { player:player }});
    }
}
