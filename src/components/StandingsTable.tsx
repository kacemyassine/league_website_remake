import { useLeagueStore } from '@/store/leagueStore';
import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';

export function StandingsTable() {
  const { teams } = useLeagueStore();

  const sortedTeams = [...teams].sort((a, b) => {
    const pointsA = a.won * 3 + a.drawn;
    const pointsB = b.won * 3 + b.drawn;
    if (pointsB !== pointsA) return pointsB - pointsA;
    const gdA = a.goalsFor - a.goalsAgainst;
    const gdB = b.goalsFor - b.goalsAgainst;
    return gdB - gdA;
  });

  return (
    <div className="atlantis-card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <h2 className="text-2xl font-display font-semibold mb-6 glow-text text-primary">
        League Standings
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 text-muted-foreground text-sm uppercase tracking-wider">
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
                  <td className="py-4 px-2">
                    <span
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold',
                        isFirst ? 'bg-gold text-primary-foreground' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-lg overflow-hidden border bg-muted/30 flex items-center justify-center shrink-0',
                        team.id === 'team1' ? 'border-primary/50' : 'border-secondary/50'
                      )}>
                        {team.logo ? (
                          <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                        ) : (
                          <Shield className={cn('w-5 h-5', team.id === 'team1' ? 'text-primary/50' : 'text-secondary/50')} />
                        )}
                      </div>
                      <div>
                        <p className={cn('font-semibold', team.id === 'team1' ? 'text-primary' : 'text-secondary')}>
                          {team.name}
                        </p>
                        <p className="text-xs text-muted-foreground">Coach {team.coach}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-center text-muted-foreground">{team.played}</td>
                  <td className="py-4 px-2 text-center text-green-400">{team.won}</td>
                  <td className="py-4 px-2 text-center text-muted-foreground">{team.drawn}</td>
                  <td className="py-4 px-2 text-center text-coral">{team.lost}</td>
                  <td className="py-4 px-2 text-center">{team.goalsFor}</td>
                  <td className="py-4 px-2 text-center">{team.goalsAgainst}</td>
                  <td className={cn('py-4 px-2 text-center font-medium', goalDiff > 0 ? 'text-green-400' : goalDiff < 0 ? 'text-coral' : '')}>
                    {goalDiff > 0 ? `+${goalDiff}` : goalDiff}
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className="text-lg font-bold text-gold">{points}</span>
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
