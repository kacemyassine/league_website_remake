import { useLeagueStore } from '@/store/leagueStore';
import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';
import type { Team } from '@/types/league';

interface StandingsTableProps {
  teams?: Team[];
  readOnly?: boolean;
}

export function StandingsTable({ teams: propTeams, readOnly }: StandingsTableProps) {
  const storeTeams = useLeagueStore(s => s.teams);
  const teams = propTeams || storeTeams;

  const sortedTeams = [...teams].sort((a, b) => {
    const pointsA = a.won * 3 + a.drawn;
    const pointsB = b.won * 3 + b.drawn;
    if (pointsB !== pointsA) return pointsB - pointsA;
    return (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
  });

  return (
    <div className="atlantis-card p-4 md:p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <h2 className="text-xl md:text-2xl font-display font-semibold mb-4 md:mb-6 glow-text text-primary">
        League Standings
      </h2>
      <div className="overflow-x-auto scroll-container -mx-4 md:mx-0 px-4 md:px-0">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-border/50 text-muted-foreground text-xs md:text-sm uppercase tracking-wider">
              <th className="py-3 px-2 text-left">#</th>
              <th className="py-3 px-2 text-left">Team</th>
              <th className="py-3 px-2 text-center">P</th>
              <th className="py-3 px-2 text-center">W</th>
              <th className="py-3 px-2 text-center">D</th>
              <th className="py-3 px-2 text-center">L</th>
              <th className="py-3 px-2 text-center">GF</th>
              <th className="py-3 px-2 text-center">GA</th>
              <th className="py-3 px-2 text-center">GD</th>
              <th className="py-3 px-2 text-center font-bold">PTS</th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team, index) => {
              const points = team.won * 3 + team.drawn;
              const goalDiff = team.goalsFor - team.goalsAgainst;
              const isFirst = index === 0;

              return (
                <tr
                  key={team.id}
                  className={cn(
                    'border-b border-border/30 transition-colors hover:bg-muted/30',
                    isFirst && 'bg-primary/10'
                  )}
                >
                  <td className="py-3 md:py-4 px-2">
                    <span className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs md:text-sm font-bold',
                      isFirst ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
                    )}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 md:py-4 px-2">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className={cn(
                        'w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden border bg-muted/30 flex items-center justify-center shrink-0',
                        team.id === 'team1' ? 'border-primary/50' : 'border-secondary/50'
                      )}>
                        {team.logo ? (
                          <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                        ) : (
                          <Shield className={cn('w-4 h-4 md:w-5 md:h-5', team.id === 'team1' ? 'text-primary/50' : 'text-secondary/50')} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={cn('font-semibold text-sm md:text-base truncate', team.id === 'team1' ? 'text-primary' : 'text-secondary')}>
                          {team.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">Coach {team.coach}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 md:py-4 px-2 text-center text-muted-foreground text-sm">{team.played}</td>
                  <td className="py-3 md:py-4 px-2 text-center text-green-400 text-sm">{team.won}</td>
                  <td className="py-3 md:py-4 px-2 text-center text-muted-foreground text-sm">{team.drawn}</td>
                  <td className="py-3 md:py-4 px-2 text-center text-destructive text-sm">{team.lost}</td>
                  <td className="py-3 md:py-4 px-2 text-center text-sm">{team.goalsFor}</td>
                  <td className="py-3 md:py-4 px-2 text-center text-sm">{team.goalsAgainst}</td>
                  <td className={cn(
                    'py-3 md:py-4 px-2 text-center font-medium text-sm',
                    goalDiff > 0 ? 'text-green-400' : goalDiff < 0 ? 'text-destructive' : ''
                  )}>
                    {goalDiff > 0 ? `+${goalDiff}` : goalDiff}
                  </td>
                  <td className="py-3 md:py-4 px-2 text-center">
                    <span className="text-base md:text-lg font-bold text-secondary">{points}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
