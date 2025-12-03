import { useLeagueStore } from '@/store/leagueStore';
import { useAdmin } from '@/contexts/AdminContext';
import { User, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TopScorersProps {
  onEditPlayer: (playerId: string) => void;
}

export function TopScorers({ onEditPlayer }: TopScorersProps) {
  const { players = [], teams = [], deletePlayer } = useLeagueStore();
  const { isAdmin } = useAdmin();

  const sortedPlayers = [...players].sort((a, b) => (b.goals || 0) - (a.goals || 0));

  const getTeam = (teamId: string) => teams.find((t) => t.id === teamId);

  return (
    <div className="atlantis-card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <h2 className="text-2xl font-display font-semibold mb-6 glow-text text-primary">Top Scorers</h2>

      {sortedPlayers.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No players added yet. Add players to track their goals!</p>
      ) : (
        <div className="space-y-3">
          {sortedPlayers.map((player, index) => {
            const team = getTeam(player.teamId);
            const isTopThree = index < 3;

            return (
              <div
                key={player.id}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-lg transition-all hover:bg-muted/30',
                  isTopThree && 'bg-muted/20'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
                    index === 0 && 'bg-gold text-primary-foreground',
                    index === 1 && 'bg-gray-400 text-primary-foreground',
                    index === 2 && 'bg-amber-700 text-primary-foreground',
                    index > 2 && 'bg-muted text-muted-foreground'
                  )}
                >
                  {index + 1}
                </div>

                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border shrink-0 bg-muted">
                  {player.image ? (
                    <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{player.name}</p>
                  <p className={cn('text-sm', player.teamId === 'team1' ? 'text-primary' : 'text-secondary')}>
                    {team?.name}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-gold">{player.goals || 0}</p>
                  <p className="text-xs text-muted-foreground">goals</p>
                </div>

                {isAdmin && (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => onEditPlayer(player.id)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deletePlayer(player.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
