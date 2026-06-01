import { Component, inject } from '@angular/core';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Button } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { NgClass, NgForOf } from '@angular/common';
import { SelectButton } from 'primeng/selectbutton';
import { Tag } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { TournamentService } from '@/services/tournament.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Tournament } from '@/models/tournament.model';

@Component({
    selector: 'app-tournaments',
    imports: [Tab, TabList, Tabs, TabPanel, TabPanels, Button, DataView, NgForOf, SelectButton, Tag, FormsModule, NgClass],
    templateUrl: './tournaments.html',
    styleUrl: './tournaments.scss'
})
export class Tournaments {
    layout: 'list' | 'grid' = 'list';
    options = ['list', 'grid'];

    private tournamentService = inject(TournamentService);

    tournaments = toSignal(this.tournamentService.getTournaments(), { initialValue: []  as Tournament[]});
}
