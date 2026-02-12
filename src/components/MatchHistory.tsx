import { useState } from 'react';
import { useLeagueStore } from '@/store/leagueStore';
import { cn } from '@/lib/utils';
import { Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { MatchDetailDialog } from '@/components/MatchDetailDialog';
import type { Match, Team } from '@/types/league';

interface MatchHistoryProps {
  matches?: Match[];
  teams?: Team[];
  readOnly?: boolean;
}

export function MatchHistory({ matches: propMatches, teams: propTeams, readOnly }: MatchHistoryProps) {
  const storeMatches = useLeagueStore(s => s.matches);
  const storeTeams = useLeagueStore(s => s.teams);
  const { isAdmin } = useAdmin();

  const matches = propMatches || storeMatches;
  const teams = propTeams || storeTeams;

  const [showAll, setShowAll] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const displayMatches = showAll ? [...matches].reverse() : [...matches].reverse().slice(0, 10);

  return (
    <div className="atlantis-card p-4 md:p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-display font-semibold glow-text text-primary">
          {showAll ? 'All Matches' : 'Recent Matches'}
        </h2>
        {matches.length > 10 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            {showAll ? <><ChevronUp className="w-4 h-4" /> Show Less</> : <><ChevronDown className="w-4 h-4" /> Show All</>}
          </button>
        )}
      </div>

      {displayMatches.length === 0 ? (
        <p className="text-muted-foreground text-center py-8 text-sm md:text-base">
          No matches played yet. Record your first match!
        </p>
      ) : (
        <div className="space-y-2 md:space-y-3 overflow-x-auto scroll-container -mx-4 md:mx-0 px-4 md:px-0">
          <div className="min-w-[320px]">
            {displayMatches.map((match, index) => {
              const homeTeam = teams.find(t => t.id === match.homeTeamId);
              const awayTeam = teams.find(t => t.id === match.awayTeamId);
              const homeWin = match.homeGoals > match.awayGoals;
              const awayWin = match.awayGoals > match.homeGoals;
              const totalMatches = matches.length;
              const matchNum = showAll ? totalMatches - index : totalMatches - index;

              return (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className="flex items-center gap-2 md:gap-4 p-2 md:p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors mb-2 cursor-pointer"
                >
                  <span className="text-xs text-muted-foreground w-6 md:w-8 shrink-0">#{matchNum}</span>
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <div className="flex items-center gap-1 md:gap-2 min-w-0 flex-1">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg overflow-hidden border border-primary/30 bg-muted/30 flex items-center justify-center shrink-0">
                        {homeTeam?.logo ? (
                          <img src={homeTeam.logo} alt={homeTeam.name} className="w-full h-full object-cover" />
                        ) : (
                          <Shield className="w-3 h-3 md:w-4 md:h-4 text-primary/50" />
                        )}
                      </div>
                      <span className={cn('font-medium text-xs md:text-sm truncate', homeWin ? 'text-green-400' : 'text-foreground')}>
                        {homeTeam?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2 px-2 md:px-4 shrink-0">
                      <span className="text-lg md:text-xl font-bold text-secondary">{match.homeGoals}</span>
                      <span className="text-muted-foreground text-sm">-</span>
                      <span className="text-lg md:text-xl font-bold text-secondary">{match.awayGoals}</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2 min-w-0 flex-1 justify-end">
                      <span className={cn('font-medium text-xs md:text-sm text-right truncate', awayWin ? 'text-green-400' : 'text-foreground')}>
                        {awayTeam?.name}
                      </span>
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg overflow-hidden border border-secondary/30 bg-muted/30 flex items-center justify-center shrink-0">
                        {awayTeam?.logo ? (
                          <img src={awayTeam.logo} alt={awayTeam.name} className="w-full h-full object-cover" />
                        ) : (
                          <Shield className="w-3 h-3 md:w-4 md:h-4 text-secondary/50" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <MatchDetailDialog
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        isAdmin={isAdmin && !readOnly}
      />
    </div>
  );
}
