import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TournamentChart } from '@/app/pages/dashboard/components/tournament/chart/tournament-chart';
import { MatchCard } from '@/app/pages/dashboard/components/tournament/match-card/match-card';

@Component({
    selector: 'app-tournament-info',
    imports: [TournamentChart, MatchCard],
    templateUrl: './tournament-info.html',
    styleUrl: './tournament-info.scss'
})
export class TournamentInfo {}
