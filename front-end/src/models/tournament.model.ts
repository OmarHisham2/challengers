export type TournamentStatus = 'draft' | 'registration' | 'active' | 'completed';
export type TournamentFormat = 'round_robin' | 'single_elimination';
export type BestOf = 3 | 5;

export interface Tournament {
    _id: string;
    name: string;
    location: string;
    format: TournamentFormat;
    status: TournamentStatus;
    best_of: BestOf;
    max_players: number;
    players: string[]; // IDs of PlayersDirectory
    registration_deadline: string;
    start_date: string;
    end_date: string;
    description?: string;
    created_by: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTournamentPayload {
    name: string;
    location: string;
    format: TournamentFormat;
    best_of: BestOf;
    max_players: number;
    registration_deadline: string;
    start_date: string;
    end_date: string;
    description: string | null;
    status: TournamentStatus;
}
