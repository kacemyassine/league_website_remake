import { useLeagueStore } from '@/store/leagueStore';
import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';

export function MatchHistory() {
  const { matches, teams } = useLeagueStore();

  const recentMatches = [...matches].reverse().slice(0, 10);

  return (
    <div className="atlantis-card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <h2 className="text-2xl font-display font-semibold mb-6 glow-text text-primary">
        Recent Matches
      </h2>

      {recentMatches.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No matches played yet. Record your first match!
        </p>
      ) : (
        <div className="space-y-3">
          {recentMatches.map((match, index) => {
            const homeTeam = teams.find((t) => t.id === match.homeTeamId);
            const awayTeam = teams.find((t) => t.id === match.awayTeamId);
            const homeWin = match.homeGoals > match.awayGoals;
            const awayWin = match.awayGoals > match.homeGoals;
            const matchNum = matches.length - index;

            return (
              <div
                key={match.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <span className="text-xs text-muted-foreground w-8">#{matchNum}</span>
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-primary/30 bg-muted/30 flex items-center justify-center shrink-0">
                      {homeTeam?.logo ? (
                        <img src={homeTeam.logo} alt={homeTeam.name} className="w-full h-full object-cover" />
                      ) : (
                        <Shield className="w-4 h-4 text-primary/50" />
                      )}
                    </div>
                    <span
                      className={cn(
                        'font-medium',
                        homeWin ? 'text-green-400' : 'text-foreground'
                      )}
                    >
                      {homeTeam?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4">
                    <span className="text-xl font-bold text-gold">{match.homeGoals}</span>
                    <span className="text-muted-foreground">-</span>
                    <span className="text-xl font-bold text-gold">{match.awayGoals}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'font-medium text-right',
                        awayWin ? 'text-green-400' : 'text-foreground'
                      )}
                    >
                      {awayTeam?.name}
                    </span>
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-secondary/30 bg-muted/30 flex items-center justify-center shrink-0">
                      {awayTeam?.logo ? (
                        <img src={awayTeam.logo} alt={awayTeam.name} className="w-full h-full object-cover" />
                      ) : (
                        <Shield className="w-4 h-4 text-secondary/50" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
