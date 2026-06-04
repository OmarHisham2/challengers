import { Routes } from '@angular/router';
import { CreateTournament } from './dashboard/tournament/create-tournament/create-tournament';
import { Dashboard } from '@/app/pages/dashboard/dashboard-home';
import { PlayersDirectory } from '@/app/pages/dashboard/user-management/players/players-directory/players-directory';
import { Judges } from '@/app/pages/dashboard/user-management/judges/judges';
import { TournamentsDirectory } from '@/app/pages/dashboard/tournament/tournaments-directory/tournaments-directory.component';
import { PlayerInfo } from '@/app/pages/dashboard/user-management/players/player-info/player-info';
import { TournamentInfo } from '@/app/pages/dashboard/tournament/tournament-info/tournament-info';

export const dashboardRoutes: Routes = [
    { path: '', component: Dashboard },
    { path: 'tournaments', component: TournamentsDirectory },
    { path: 'tournaments/:tournamentId', component: TournamentInfo },
    { path: 'create-tournament', component: CreateTournament },
    { path: 'players', component: PlayersDirectory },
    { path: 'players/:playerId', component: PlayerInfo },

    { path: 'judges', component: Judges }
] as Routes;
