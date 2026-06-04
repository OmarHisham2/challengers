export type MatchStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Match {
    _id: string;
    player1_id: string;
    player2_id: string;
    judge_id: string;
    tournament_id: string;
    winner_id?: string;
    status: MatchStatus;
    round?: number;
    scheduled_at: string | Date;
}
