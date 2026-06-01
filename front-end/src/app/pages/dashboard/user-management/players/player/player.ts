import { Component, effect, ElementRef, inject, input, signal, ViewChild } from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputText} from "primeng/inputtext";
import {Tag} from "primeng/tag";
import { FormsModule } from '@angular/forms';
import { PlayerService } from '@/services/player.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { finalize, switchMap } from 'rxjs';

@Component({
    selector: 'app-player',
    imports: [FormsModule],
    templateUrl: './player.html'
})
export class Player {
    playerId = input.required<string>();

    private playerService = inject(PlayerService);

    playerData = toSignal(toObservable(this.playerId).pipe(switchMap((id) => this.playerService.getPlayerById(id))));
}
